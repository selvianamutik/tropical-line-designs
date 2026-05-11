"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import {
  GALLERY_LAYOUTS,
  MEMBER_STATUSES,
  PROJECT_STATUSES,
  optionalHttpUrl,
  optionalMonthValue,
  optionalNonNegativeInteger,
  optionalText,
  requiredEmail,
  requiredEnumValue,
  requiredText,
  requiredYear,
  slugifyOrThrow,
} from "@/lib/admin/validation";
import {
  emptyImageColumns,
  getOptionalImageFile,
  removeEntityImage,
  uploadEntityImage,
  uploadPortfolioGalleryAsset,
} from "@/lib/admin/media";

function getObjectPathFromMediaAssetsRelation(
  relation: { object_path: string } | { object_path: string }[] | null,
) {
  return Array.isArray(relation) ? (relation[0]?.object_path ?? null) : (relation?.object_path ?? null);
}

export async function upsertPortfolio(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optionalText(formData, "id", { maxLength: 64 });
  const title = requiredText(formData, "title", { minLength: 2, maxLength: 160 });
  const recordId = id ?? crypto.randomUUID();
  const imageFile = getOptionalImageFile(formData, "image_file");
  const existingRecord = id
    ? await supabase.from("portfolios").select("image_path").eq("id", id).maybeSingle()
    : null;

  if (existingRecord?.error) {
    throw existingRecord.error;
  }

  const payload = {
    id: recordId,
    title,
    slug: slugifyOrThrow(title),
    location: requiredText(formData, "location", { minLength: 2, maxLength: 160 }),
    status: requiredEnumValue(formData, "status", PROJECT_STATUSES),
    commenced_at: optionalMonthValue(formData, "commenced_at"),
    client: optionalText(formData, "client", { maxLength: 160 }),
    category: optionalText(formData, "category", { maxLength: 120 }),
    architect: optionalText(formData, "architect", { maxLength: 160 }),
    landscape_consultant: optionalText(formData, "landscape_consultant", { maxLength: 160 }),
    project_size: optionalText(formData, "project_size", { maxLength: 80 }),
    description: optionalText(formData, "description", { maxLength: 4000, allowMultiline: true }),
    gallery_layout: requiredEnumValue(formData, "gallery_layout", GALLERY_LAYOUTS),
    ...emptyImageColumns(),
  };
  let mutationPayload: typeof payload = payload;
  if (imageFile) {
    const uploadedImage = await uploadEntityImage({
      owner: "portfolios",
      recordId,
      slugSource: title,
      file: imageFile,
    });
    mutationPayload = { ...payload, ...uploadedImage };
  } else if (id) {
    const { id: _id, image_bucket: _bucket, image_path: _path, image_mime_type: _mime, image_size_bytes: _size, ...rest } = payload;
    void _id;
    void _bucket;
    void _path;
    void _mime;
    void _size;
    mutationPayload = rest as typeof payload;
  }

  if (id) {
    const { error } = await supabase
      .from("portfolios")
      .update(mutationPayload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("portfolios")
      .insert([mutationPayload]);
    if (error) throw error;
  }

  if (imageFile && existingRecord?.data?.image_path) {
    await removeEntityImage(existingRecord.data.image_path);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function deletePortfolio(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = requiredText(formData, "id", { maxLength: 64 });
  const existingRecord = await supabase.from("portfolios").select("image_path").eq("id", id).maybeSingle();
  if (existingRecord.error) throw existingRecord.error;
  const { error } = await supabase
    .from("portfolios")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  await removeEntityImage(existingRecord.data?.image_path);

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function updatePortfolioGalleryOrder(formData: FormData) {
  const { supabase } = await requireAdmin();
  const portfolioId = requiredText(formData, "portfolio_id", { maxLength: 64 });
  const orderedItemIdsRaw = requiredText(formData, "ordered_item_ids", { maxLength: 10000 });

  let orderedItemIds: string[];
  try {
    const parsed = JSON.parse(orderedItemIdsRaw);
    if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "string" || item.length === 0)) {
      throw new Error("Invalid gallery order payload.");
    }
    orderedItemIds = parsed;
  } catch {
    throw new Error("Invalid gallery order payload.");
  }

  const { data: existingItems, error: existingError } = await supabase
    .from("portfolio_gallery_items")
    .select("id, portfolio_id")
    .eq("portfolio_id", portfolioId)
    .order("sort_order", { ascending: true });

  if (existingError) {
    throw existingError;
  }

  const existingIds = new Set((existingItems ?? []).map((item) => item.id));
  if (existingIds.size !== orderedItemIds.length || orderedItemIds.some((id) => !existingIds.has(id))) {
    throw new Error("Gallery items do not match the selected project.");
  }

  for (const [index, itemId] of orderedItemIds.entries()) {
    const { error } = await supabase
      .from("portfolio_gallery_items")
      .update({ sort_order: index })
      .eq("id", itemId)
      .eq("portfolio_id", portfolioId);

    if (error) {
      throw error;
    }
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function addPortfolioGalleryImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const portfolioId = requiredText(formData, "portfolio_id", { maxLength: 64 });
  const title = requiredText(formData, "portfolio_title", { maxLength: 160 });
  const imageFile = getOptionalImageFile(formData, "image_file");

  if (!imageFile) {
    throw new Error('Field "image_file" is required.');
  }

  const { data: portfolio, error: portfolioError } = await supabase
    .from("portfolios")
    .select("id")
    .eq("id", portfolioId)
    .maybeSingle();

  if (portfolioError) {
    throw portfolioError;
  }

  if (!portfolio) {
    throw new Error("Project not found.");
  }

  const { data: existingItems, error: existingError } = await supabase
    .from("portfolio_gallery_items")
    .select("sort_order")
    .eq("portfolio_id", portfolioId)
    .order("sort_order", { ascending: false })
    .limit(1);

  if (existingError) {
    throw existingError;
  }

  const nextSortOrder = (existingItems?.[0]?.sort_order ?? -1) + 1;
  const uploaded = await uploadPortfolioGalleryAsset({
    portfolioId,
    slugSource: title,
    file: imageFile,
  });

  const { error: galleryError } = await supabase
    .from("portfolio_gallery_items")
    .insert({
      portfolio_id: portfolioId,
      media_asset_id: uploaded.mediaAssetId,
      sort_order: nextSortOrder,
      caption: null,
    });

  if (galleryError) {
    await supabase.from("media_assets").delete().eq("id", uploaded.mediaAssetId);
    await removeEntityImage(uploaded.objectPath);
    throw galleryError;
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function deletePortfolioGalleryImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const portfolioId = requiredText(formData, "portfolio_id", { maxLength: 64 });
  const galleryItemId = requiredText(formData, "gallery_item_id", { maxLength: 64 });

  const { data: galleryItem, error: galleryItemError } = await supabase
    .from("portfolio_gallery_items")
    .select("id,portfolio_id,media_asset_id,sort_order,media_assets(object_path)")
    .eq("id", galleryItemId)
    .eq("portfolio_id", portfolioId)
    .single();

  if (galleryItemError) {
    throw galleryItemError;
  }

  const objectPath = getObjectPathFromMediaAssetsRelation(
    galleryItem.media_assets as { object_path: string } | { object_path: string }[] | null,
  );
  const removedSortOrder = galleryItem.sort_order as number;
  const mediaAssetId = galleryItem.media_asset_id as string;

  const { error: deleteGalleryError } = await supabase
    .from("portfolio_gallery_items")
    .delete()
    .eq("id", galleryItemId)
    .eq("portfolio_id", portfolioId);

  if (deleteGalleryError) {
    throw deleteGalleryError;
  }

  const { data: trailingItems, error: trailingError } = await supabase
    .from("portfolio_gallery_items")
    .select("id,sort_order")
    .eq("portfolio_id", portfolioId)
    .gt("sort_order", removedSortOrder)
    .order("sort_order", { ascending: true });

  if (trailingError) {
    throw trailingError;
  }

  for (const item of trailingItems ?? []) {
    const { error } = await supabase
      .from("portfolio_gallery_items")
      .update({ sort_order: (item.sort_order as number) - 1 })
      .eq("id", item.id as string)
      .eq("portfolio_id", portfolioId);

    if (error) {
      throw error;
    }
  }

  const { error: deleteMediaAssetError } = await supabase
    .from("media_assets")
    .delete()
    .eq("id", mediaAssetId);

  if (deleteMediaAssetError) {
    throw deleteMediaAssetError;
  }

  await removeEntityImage(objectPath);

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function upsertTeamMember(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optionalText(formData, "id", { maxLength: 64 });
  const recordId = id ?? crypto.randomUUID();
  const imageFile = getOptionalImageFile(formData, "image_file");
  const existingRecord = id
    ? await supabase.from("team_members").select("image_path").eq("id", id).maybeSingle()
    : null;

  if (existingRecord?.error) {
    throw existingRecord.error;
  }

  const payload = {
    id: recordId,
    name: requiredText(formData, "name", { minLength: 2, maxLength: 160 }),
    role: requiredText(formData, "role", { minLength: 2, maxLength: 120 }),
    email: requiredEmail(formData, "email"),
    status: requiredEnumValue(formData, "status", MEMBER_STATUSES),
    ...emptyImageColumns(),
  };
  let mutationPayload: typeof payload = payload;
  if (imageFile) {
    const uploadedImage = await uploadEntityImage({
      owner: "team_members",
      recordId,
      slugSource: payload.name,
      file: imageFile,
    });
    mutationPayload = { ...payload, ...uploadedImage };
  } else if (id) {
    const { id: _id, image_bucket: _bucket, image_path: _path, image_mime_type: _mime, image_size_bytes: _size, ...rest } = payload;
    void _id;
    void _bucket;
    void _path;
    void _mime;
    void _size;
    mutationPayload = rest as typeof payload;
  }

  if (id) {
    const { error } = await supabase
      .from("team_members")
      .update(mutationPayload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("team_members")
      .insert([mutationPayload]);
    if (error) throw error;
  }

  if (imageFile && existingRecord?.data?.image_path) {
    await removeEntityImage(existingRecord.data.image_path);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/team");
}

export async function deleteTeamMember(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = requiredText(formData, "id", { maxLength: 64 });
  const existingRecord = await supabase.from("team_members").select("image_path").eq("id", id).maybeSingle();
  if (existingRecord.error) throw existingRecord.error;
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", id);
    
  if (error) throw error;
  await removeEntityImage(existingRecord.data?.image_path);

  revalidatePath("/admin");
  revalidatePath("/admin/team");
}

export async function upsertCollaborator(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optionalText(formData, "id", { maxLength: 64 });
  const recordId = id ?? crypto.randomUUID();
  const imageFile = getOptionalImageFile(formData, "image_file");
  const existingRecord = id
    ? await supabase.from("collaborators").select("image_path").eq("id", id).maybeSingle()
    : null;

  if (existingRecord?.error) {
    throw existingRecord.error;
  }

  const payload = {
    id: recordId,
    company: requiredText(formData, "company", { minLength: 2, maxLength: 160 }),
    expertise_type: requiredText(formData, "expertise_type", { minLength: 2, maxLength: 120 }),
    contact_email: requiredEmail(formData, "contact_email"),
    joint_projects: optionalNonNegativeInteger(formData, "joint_projects", { max: 100000 }),
    ...emptyImageColumns(),
  };
  let mutationPayload: typeof payload = payload;
  if (imageFile) {
    const uploadedImage = await uploadEntityImage({
      owner: "collaborators",
      recordId,
      slugSource: payload.company,
      file: imageFile,
    });
    mutationPayload = { ...payload, ...uploadedImage };
  } else if (id) {
    const { id: _id, image_bucket: _bucket, image_path: _path, image_mime_type: _mime, image_size_bytes: _size, ...rest } = payload;
    void _id;
    void _bucket;
    void _path;
    void _mime;
    void _size;
    mutationPayload = rest as typeof payload;
  }

  if (id) {
    const { error } = await supabase
      .from("collaborators")
      .update(mutationPayload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("collaborators")
      .insert([mutationPayload]);
    if (error) throw error;
  }

  if (imageFile && existingRecord?.data?.image_path) {
    await removeEntityImage(existingRecord.data.image_path);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/collaborators");
}

export async function deleteCollaborator(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = requiredText(formData, "id", { maxLength: 64 });
  const existingRecord = await supabase.from("collaborators").select("image_path").eq("id", id).maybeSingle();
  if (existingRecord.error) throw existingRecord.error;
  const { error } = await supabase
    .from("collaborators")
    .delete()
    .eq("id", id);
    
  if (error) throw error;
  await removeEntityImage(existingRecord.data?.image_path);

  revalidatePath("/admin");
  revalidatePath("/admin/collaborators");
}

export async function upsertAward(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optionalText(formData, "id", { maxLength: 64 });
  const recordId = id ?? crypto.randomUUID();
  const imageFile = getOptionalImageFile(formData, "image_file");
  const existingRecord = id
    ? await supabase.from("awards").select("image_path").eq("id", id).maybeSingle()
    : null;

  if (existingRecord?.error) {
    throw existingRecord.error;
  }

  const payload = {
    id: recordId,
    title: requiredText(formData, "title", { minLength: 2, maxLength: 160 }),
    organization: requiredText(formData, "organization", { minLength: 2, maxLength: 160 }),
    award_year: requiredYear(formData, "award_year"),
    related_project: optionalText(formData, "related_project", { maxLength: 160 }),
    ...emptyImageColumns(),
  };
  let mutationPayload: typeof payload = payload;
  if (imageFile) {
    const uploadedImage = await uploadEntityImage({
      owner: "awards",
      recordId,
      slugSource: payload.title,
      file: imageFile,
    });
    mutationPayload = { ...payload, ...uploadedImage };
  } else if (id) {
    const { id: _id, image_bucket: _bucket, image_path: _path, image_mime_type: _mime, image_size_bytes: _size, ...rest } = payload;
    void _id;
    void _bucket;
    void _path;
    void _mime;
    void _size;
    mutationPayload = rest as typeof payload;
  }

  if (id) {
    const { error } = await supabase
      .from("awards")
      .update(mutationPayload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("awards")
      .insert([mutationPayload]);
    if (error) throw error;
  }

  if (imageFile && existingRecord?.data?.image_path) {
    await removeEntityImage(existingRecord.data.image_path);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/awards");
}

export async function deleteAward(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = requiredText(formData, "id", { maxLength: 64 });
  const existingRecord = await supabase.from("awards").select("image_path").eq("id", id).maybeSingle();
  if (existingRecord.error) throw existingRecord.error;
  const { error } = await supabase
    .from("awards")
    .delete()
    .eq("id", id);
    
  if (error) throw error;
  await removeEntityImage(existingRecord.data?.image_path);

  revalidatePath("/admin");
  revalidatePath("/admin/awards");
}

export async function updateSiteSettings(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    id: "default",
    studio_name: requiredText(formData, "studio_name", { minLength: 2, maxLength: 160 }),
    contact_email: requiredEmail(formData, "contact_email"),
    phone_number: requiredText(formData, "phone_number", { minLength: 6, maxLength: 50 }),
    office_address: requiredText(formData, "office_address", { minLength: 6, maxLength: 500, allowMultiline: true }),
    instagram_handle: optionalHttpUrl(formData, "instagram_handle"),
    linkedin_url: optionalHttpUrl(formData, "linkedin_url"),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("site_settings")
    .upsert(payload, { onConflict: "id" });
    
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}
