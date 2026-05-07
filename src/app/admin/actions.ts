"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/db";

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Field "${key}" is required.`);
  }
  return value.trim();
}

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function optionalNumber(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    return 0;
  }
  return Number(value);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function upsertPortfolio(formData: FormData) {
  const id = optionalString(formData, "id");
  const title = requiredString(formData, "title");
  
  // Clean empty strings for commenced_at
  let commenced_at = optionalString(formData, "commenced_at");
  if (commenced_at === "") commenced_at = null;

  const payload = {
    title,
    slug: slugify(title),
    location: requiredString(formData, "location"),
    status: requiredString(formData, "status"),
    commenced_at,
    client: optionalString(formData, "client"),
    category: optionalString(formData, "category"),
    description: optionalString(formData, "description"),
    image_url: optionalString(formData, "image_url"),
  };

  if (id) {
    const { error } = await supabaseAdmin
      .from("portfolios")
      .update(payload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin
      .from("portfolios")
      .insert([payload]);
    if (error) throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function deletePortfolio(formData: FormData) {
  const id = requiredString(formData, "id");
  const { error } = await supabaseAdmin
    .from("portfolios")
    .delete()
    .eq("id", id);
  
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function upsertTeamMember(formData: FormData) {
  const id = optionalString(formData, "id");
  const payload = {
    name: requiredString(formData, "name"),
    role: requiredString(formData, "role"),
    email: requiredString(formData, "email"),
    status: requiredString(formData, "status"),
    image_url: optionalString(formData, "image_url"),
  };

  if (id) {
    const { error } = await supabaseAdmin
      .from("team_members")
      .update(payload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin
      .from("team_members")
      .insert([payload]);
    if (error) throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/team");
}

export async function deleteTeamMember(formData: FormData) {
  const id = requiredString(formData, "id");
  const { error } = await supabaseAdmin
    .from("team_members")
    .delete()
    .eq("id", id);
    
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/admin/team");
}

export async function upsertCollaborator(formData: FormData) {
  const id = optionalString(formData, "id");
  const payload = {
    company: requiredString(formData, "company"),
    expertise_type: requiredString(formData, "expertise_type"),
    contact_email: requiredString(formData, "contact_email"),
    joint_projects: optionalNumber(formData, "joint_projects"),
  };

  if (id) {
    const { error } = await supabaseAdmin
      .from("collaborators")
      .update(payload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin
      .from("collaborators")
      .insert([payload]);
    if (error) throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/collaborators");
}

export async function deleteCollaborator(formData: FormData) {
  const id = requiredString(formData, "id");
  const { error } = await supabaseAdmin
    .from("collaborators")
    .delete()
    .eq("id", id);
    
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/admin/collaborators");
}

export async function upsertAward(formData: FormData) {
  const id = optionalString(formData, "id");
  const payload = {
    title: requiredString(formData, "title"),
    organization: requiredString(formData, "organization"),
    award_year: optionalNumber(formData, "award_year"),
    related_project: optionalString(formData, "related_project"),
  };

  if (id) {
    const { error } = await supabaseAdmin
      .from("awards")
      .update(payload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin
      .from("awards")
      .insert([payload]);
    if (error) throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/awards");
}

export async function deleteAward(formData: FormData) {
  const id = requiredString(formData, "id");
  const { error } = await supabaseAdmin
    .from("awards")
    .delete()
    .eq("id", id);
    
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/admin/awards");
}

export async function updateSiteSettings(formData: FormData) {
  const payload = {
    id: "default",
    studio_name: requiredString(formData, "studio_name"),
    contact_email: requiredString(formData, "contact_email"),
    phone_number: requiredString(formData, "phone_number"),
    office_address: requiredString(formData, "office_address"),
    instagram_handle: optionalString(formData, "instagram_handle"),
    linkedin_url: optionalString(formData, "linkedin_url"),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from("site_settings")
    .upsert(payload, { onConflict: "id" });
    
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}
