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

function revalidatePublicProjectPaths() {
  revalidatePath("/");
  revalidatePath("/projects");
}

function revalidatePublicAboutPaths() {
  revalidatePath("/about");
  revalidatePath("/about/people");
  revalidatePath("/about/collaborators");
  revalidatePath("/about/awards");
}

async function executeAwardMutationWithFallbacks(args: {
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"];
  id: string | null;
  recordId: string;
  payload: {
    id: string;
    title: string;
    organization: string;
    award_year: number;
    related_project: string | null;
    description: string | null;
    image_bucket: string | null;
    image_path: string | null;
    image_mime_type: string | null;
    image_size_bytes: number | null;
  };
}) {
  const { supabase, id, recordId, payload } = args;
  type AwardMutationPayload = typeof payload;
  type AwardFallbackPayload = Omit<
    AwardMutationPayload,
    "id" | "description" | "related_project" | "image_bucket" | "image_path" | "image_mime_type" | "image_size_bytes"
  > & {
    description?: AwardMutationPayload["description"];
    related_project?: AwardMutationPayload["related_project"];
    id?: AwardMutationPayload["id"];
  };

  const {
    description: _description,
    related_project: _relatedProject,
    image_bucket: _imageBucket,
    image_path: _imagePath,
    image_mime_type: _imageMimeType,
    image_size_bytes: _imageSizeBytes,
    ...basePayload
  } = payload;

  void _description;
  void _relatedProject;
  void _imageBucket;
  void _imagePath;
  void _imageMimeType;
  void _imageSizeBytes;

  const variants: AwardFallbackPayload[] = [
    payload,
    { ...payload, description: undefined },
    { ...payload, related_project: undefined },
    { ...payload, description: undefined, related_project: undefined },
    basePayload,
    { ...basePayload, description: payload.description },
    { ...basePayload, related_project: payload.related_project },
  ];

  let lastError: unknown = null;

  for (const variant of variants) {
    if (id) {
      const { error } = await supabase
        .from("awards")
        .update(variant)
        .eq("id", id);

      if (!error) {
        return;
      }

      if (error.code !== "42703" && error.code !== "PGRST204") {
        throw error;
      }

      lastError = error;
      continue;
    }

    const insertPayload = "id" in variant ? variant : { ...variant, id: recordId };
    const { error } = await supabase
      .from("awards")
      .insert([insertPayload]);

    if (!error) {
      return;
    }

    if (error.code !== "42703" && error.code !== "PGRST204") {
      throw error;
    }

    lastError = error;
  }

  if (lastError) {
    throw lastError;
  }
}

async function syncAwardImageColumns(args: {
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"];
  awardId: string;
  image: {
    image_bucket: string;
    image_path: string;
    image_mime_type: string;
    image_size_bytes: number;
  };
}) {
  const { supabase, awardId, image } = args;
  const { data, error } = await supabase
    .from("awards")
    .select("image_bucket,image_path,image_mime_type,image_size_bytes")
    .eq("id", awardId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const needsSync =
    !data ||
    data.image_bucket !== image.image_bucket ||
    data.image_path !== image.image_path ||
    data.image_mime_type !== image.image_mime_type ||
    data.image_size_bytes !== image.image_size_bytes;

  if (!needsSync) {
    return;
  }

  const { error: syncError } = await supabase
    .from("awards")
    .update(image)
    .eq("id", awardId);

  if (syncError) {
    throw syncError;
  }
}

function getObjectPathFromMediaAssetsRelation(
  relation: { object_path: string } | { object_path: string }[] | null,
) {
  return Array.isArray(relation) ? (relation[0]?.object_path ?? null) : (relation?.object_path ?? null);
}

export async function upsertPortfolio(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optionalText(formData, "id", { maxLength: 64 });
  const title = requiredText(formData, "title", { minLength: 2, maxLength: 160, disallowNumericOnly: true });
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
    location: requiredText(formData, "location", { minLength: 2, maxLength: 160, disallowNumericOnly: true }),
    status: requiredEnumValue(formData, "status", PROJECT_STATUSES),
    commenced_at: optionalMonthValue(formData, "commenced_at"),
    client: optionalText(formData, "client", { maxLength: 160 }),
    category: optionalText(formData, "category", { maxLength: 120 }),
    architect: optionalText(formData, "architect", { maxLength: 160 }),
    landscape_consultant: optionalText(formData, "landscape_consultant", { maxLength: 160 }),
    project_size: optionalText(formData, "project_size", { maxLength: 80 }),
    display_order: optionalNonNegativeInteger(formData, "display_order", { max: 100000 }),
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

  const executePortfolioMutation = async (payloadVariant: typeof mutationPayload) => {
    if (id) {
      return supabase
        .from("portfolios")
        .update(payloadVariant)
        .eq("id", id);
    }

    return supabase
      .from("portfolios")
      .insert([payloadVariant]);
  };

  let mutationResult = await executePortfolioMutation(mutationPayload);

  if (mutationResult.error?.code === "PGRST204" || mutationResult.error?.code === "42703") {
    const { display_order: _displayOrder, ...legacyPayload } = mutationPayload;
    void _displayOrder;
    mutationResult = await executePortfolioMutation(legacyPayload as typeof mutationPayload);
  }

  if (mutationResult.error) throw mutationResult.error;

  if (imageFile && existingRecord?.data?.image_path) {
    await removeEntityImage(existingRecord.data.image_path);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePublicProjectPaths();
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
  revalidatePublicProjectPaths();
}

export async function updatePortfolioDisplayOrder(formData: FormData) {
  const { supabase } = await requireAdmin();
  const orderedProjectIdsRaw = requiredText(formData, "ordered_project_ids", { maxLength: 10000 });

  let orderedProjectIds: string[];
  try {
    const parsed = JSON.parse(orderedProjectIdsRaw);
    if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "string" || item.length === 0)) {
      throw new Error("Invalid project order payload.");
    }
    orderedProjectIds = parsed;
  } catch {
    throw new Error("Invalid project order payload.");
  }

  const { data: existingProjects, error: existingError } = await supabase
    .from("portfolios")
    .select("id");

  if (existingError) {
    throw existingError;
  }

  const existingIds = new Set((existingProjects ?? []).map((project) => project.id as string));
  if (existingIds.size !== orderedProjectIds.length || orderedProjectIds.some((id) => !existingIds.has(id))) {
    throw new Error("Project order does not match the current portfolio list.");
  }

  for (const [index, projectId] of orderedProjectIds.entries()) {
    const { error } = await supabase
      .from("portfolios")
      .update({ display_order: index })
      .eq("id", projectId);

    if (error) {
      throw error;
    }
  }

  revalidatePath("/");
  revalidatePath("/projects");
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

  const temporaryOffset = orderedItemIds.length + 1000;

  for (const [index, itemId] of orderedItemIds.entries()) {
    const { error } = await supabase
      .from("portfolio_gallery_items")
      .update({ sort_order: temporaryOffset + index })
      .eq("id", itemId)
      .eq("portfolio_id", portfolioId);

    if (error) {
      throw error;
    }
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
    name: requiredText(formData, "name", { minLength: 2, maxLength: 160, disallowNumericOnly: true }),
    role: requiredText(formData, "role", { minLength: 2, maxLength: 120, disallowNumericOnly: true }),
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
  revalidatePublicAboutPaths();
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
  revalidatePublicAboutPaths();
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
    company: requiredText(formData, "company", { minLength: 2, maxLength: 160, disallowNumericOnly: true }),
    expertise_type: requiredText(formData, "expertise_type", { minLength: 2, maxLength: 120, disallowNumericOnly: true }),
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
  revalidatePublicAboutPaths();
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
  revalidatePublicAboutPaths();
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
    title: requiredText(formData, "title", { minLength: 2, maxLength: 160, disallowNumericOnly: true }),
    organization: requiredText(formData, "organization", { minLength: 2, maxLength: 160, disallowNumericOnly: true }),
    award_year: requiredYear(formData, "award_year"),
    related_project: optionalText(formData, "related_project", { maxLength: 160 }),
    description: optionalText(formData, "description", { maxLength: 4000, allowMultiline: true }),
    ...emptyImageColumns(),
  };
  let mutationPayload: typeof payload = payload;
  let uploadedImage: Awaited<ReturnType<typeof uploadEntityImage>> | null = null;
  if (imageFile) {
    uploadedImage = await uploadEntityImage({
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

  await executeAwardMutationWithFallbacks({
    supabase,
    id,
    recordId,
    payload: mutationPayload,
  });

  if (uploadedImage) {
    await syncAwardImageColumns({
      supabase,
      awardId: recordId,
      image: uploadedImage,
    });
  }

  if (imageFile && existingRecord?.data?.image_path) {
    await removeEntityImage(existingRecord.data.image_path);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/awards");
  revalidatePublicAboutPaths();
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
  revalidatePublicAboutPaths();
}

function requiredBooleanValue(formData: FormData, key: string) {
  const value = requiredText(formData, key, { maxLength: 5 });
  if (value !== "true" && value !== "false") {
    throw new Error(`Field "${key}" has an invalid value.`);
  }
  return value === "true";
}

export async function upsertService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optionalText(formData, "id", { maxLength: 64 });
  const recordId = id ?? crypto.randomUUID();
  const payload = {
    id: recordId,
    title: requiredText(formData, "title", { minLength: 2, maxLength: 160, disallowNumericOnly: true }),
    description: optionalText(formData, "description", { maxLength: 1200, allowMultiline: true }),
    sort_order: optionalNonNegativeInteger(formData, "sort_order", { max: 100000 }),
    is_active: requiredBooleanValue(formData, "is_active"),
  };

  if (id) {
    const { error } = await supabase
      .from("services")
      .update(payload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("services")
      .insert([payload]);
    if (error) throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/services");
  revalidatePublicAboutPaths();
}

export async function deleteService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = requiredText(formData, "id", { maxLength: 64 });
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/admin/services");
  revalidatePublicAboutPaths();
}

export async function updateSiteSettings(formData: FormData) {
  const { supabase } = await requireAdmin();
  const footerHeading = requiredText(formData, "footer_heading", { minLength: 2, maxLength: 180, allowMultiline: true });
  const footerDescription = requiredText(formData, "footer_description", { minLength: 6, maxLength: 800, allowMultiline: true });
  const payload = {
    id: "default",
    studio_name: requiredText(formData, "studio_name", { minLength: 2, maxLength: 160, disallowNumericOnly: true }),
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

  const { error: footerError } = await supabase
    .from("site_settings")
    .update({
      footer_heading: footerHeading,
      footer_description: footerDescription,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (footerError?.code === "PGRST204" || footerError?.code === "42703") {
    throw new Error(
      "Footer copy belum bisa disimpan karena kolom footer_heading/footer_description belum tersedia di Supabase. Jalankan migration site_settings_footer_copy lalu refresh schema cache.",
    );
  }

  if (footerError) {
    throw footerError;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/about");
  revalidatePath("/contact");
}
