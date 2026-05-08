"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/db";
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
} from "@/lib/admin/media";

export async function upsertPortfolio(formData: FormData) {
  const id = optionalText(formData, "id", { maxLength: 64 });
  const title = requiredText(formData, "title", { minLength: 2, maxLength: 160 });
  const recordId = id ?? crypto.randomUUID();
  const imageFile = getOptionalImageFile(formData, "image_file");
  const existingRecord = id
    ? await supabaseAdmin.from("portfolios").select("image_path").eq("id", id).maybeSingle()
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
    const { id: _id, image_bucket: _bucket, image_path: _path, image_url: _url, image_mime_type: _mime, image_size_bytes: _size, ...rest } = payload;
    void _id;
    void _bucket;
    void _path;
    void _url;
    void _mime;
    void _size;
    mutationPayload = rest as typeof payload;
  }

  if (id) {
    const { error } = await supabaseAdmin
      .from("portfolios")
      .update(mutationPayload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin
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
  const id = requiredText(formData, "id", { maxLength: 64 });
  const existingRecord = await supabaseAdmin.from("portfolios").select("image_path").eq("id", id).maybeSingle();
  if (existingRecord.error) throw existingRecord.error;
  const { error } = await supabaseAdmin
    .from("portfolios")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  await removeEntityImage(existingRecord.data?.image_path);

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function upsertTeamMember(formData: FormData) {
  const id = optionalText(formData, "id", { maxLength: 64 });
  const recordId = id ?? crypto.randomUUID();
  const imageFile = getOptionalImageFile(formData, "image_file");
  const existingRecord = id
    ? await supabaseAdmin.from("team_members").select("image_path").eq("id", id).maybeSingle()
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
    const { id: _id, image_bucket: _bucket, image_path: _path, image_url: _url, image_mime_type: _mime, image_size_bytes: _size, ...rest } = payload;
    void _id;
    void _bucket;
    void _path;
    void _url;
    void _mime;
    void _size;
    mutationPayload = rest as typeof payload;
  }

  if (id) {
    const { error } = await supabaseAdmin
      .from("team_members")
      .update(mutationPayload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin
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
  const id = requiredText(formData, "id", { maxLength: 64 });
  const existingRecord = await supabaseAdmin.from("team_members").select("image_path").eq("id", id).maybeSingle();
  if (existingRecord.error) throw existingRecord.error;
  const { error } = await supabaseAdmin
    .from("team_members")
    .delete()
    .eq("id", id);
    
  if (error) throw error;
  await removeEntityImage(existingRecord.data?.image_path);

  revalidatePath("/admin");
  revalidatePath("/admin/team");
}

export async function upsertCollaborator(formData: FormData) {
  const id = optionalText(formData, "id", { maxLength: 64 });
  const recordId = id ?? crypto.randomUUID();
  const imageFile = getOptionalImageFile(formData, "image_file");
  const existingRecord = id
    ? await supabaseAdmin.from("collaborators").select("image_path").eq("id", id).maybeSingle()
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
    const { id: _id, image_bucket: _bucket, image_path: _path, image_url: _url, image_mime_type: _mime, image_size_bytes: _size, ...rest } = payload;
    void _id;
    void _bucket;
    void _path;
    void _url;
    void _mime;
    void _size;
    mutationPayload = rest as typeof payload;
  }

  if (id) {
    const { error } = await supabaseAdmin
      .from("collaborators")
      .update(mutationPayload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin
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
  const id = requiredText(formData, "id", { maxLength: 64 });
  const existingRecord = await supabaseAdmin.from("collaborators").select("image_path").eq("id", id).maybeSingle();
  if (existingRecord.error) throw existingRecord.error;
  const { error } = await supabaseAdmin
    .from("collaborators")
    .delete()
    .eq("id", id);
    
  if (error) throw error;
  await removeEntityImage(existingRecord.data?.image_path);

  revalidatePath("/admin");
  revalidatePath("/admin/collaborators");
}

export async function upsertAward(formData: FormData) {
  const id = optionalText(formData, "id", { maxLength: 64 });
  const recordId = id ?? crypto.randomUUID();
  const imageFile = getOptionalImageFile(formData, "image_file");
  const existingRecord = id
    ? await supabaseAdmin.from("awards").select("image_path").eq("id", id).maybeSingle()
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
    const { id: _id, image_bucket: _bucket, image_path: _path, image_url: _url, image_mime_type: _mime, image_size_bytes: _size, ...rest } = payload;
    void _id;
    void _bucket;
    void _path;
    void _url;
    void _mime;
    void _size;
    mutationPayload = rest as typeof payload;
  }

  if (id) {
    const { error } = await supabaseAdmin
      .from("awards")
      .update(mutationPayload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin
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
  const id = requiredText(formData, "id", { maxLength: 64 });
  const existingRecord = await supabaseAdmin.from("awards").select("image_path").eq("id", id).maybeSingle();
  if (existingRecord.error) throw existingRecord.error;
  const { error } = await supabaseAdmin
    .from("awards")
    .delete()
    .eq("id", id);
    
  if (error) throw error;
  await removeEntityImage(existingRecord.data?.image_path);

  revalidatePath("/admin");
  revalidatePath("/admin/awards");
}

export async function updateSiteSettings(formData: FormData) {
  const payload = {
    id: "default",
    studio_name: requiredText(formData, "studio_name", { minLength: 2, maxLength: 160 }),
    contact_email: requiredEmail(formData, "contact_email"),
    phone_number: requiredText(formData, "phone_number", { minLength: 6, maxLength: 50 }),
    office_address: requiredText(formData, "office_address", { minLength: 6, maxLength: 500, allowMultiline: true }),
    instagram_handle: optionalText(formData, "instagram_handle", { maxLength: 100 }),
    linkedin_url: optionalHttpUrl(formData, "linkedin_url"),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from("site_settings")
    .upsert(payload, { onConflict: "id" });
    
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}
