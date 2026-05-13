import { cache } from "react";
import { supabaseAdmin } from "@/lib/db";

export type PublicCollaboratorRecord = {
  id: string;
  company: string;
  expertiseType: string;
  image: string;
};

type CollaboratorRow = {
  id: string;
  company: string;
  expertise_type: string;
  image_bucket?: string | null;
  image_path: string | null;
  created_at: string;
};

function formatCollaboratorExpertise(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((part) => {
      if (part.length <= 3) {
        return part.toUpperCase();
      }

      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
}

function fallbackCollaboratorImage(company: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <rect width="1200" height="800" fill="#ece6dc"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#383532" font-family="Arial, sans-serif" font-size="44">
        ${company}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function resolveCollaboratorImage(row: CollaboratorRow) {
  if (row.image_path) {
    const bucket = row.image_bucket ?? "site-media";
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(row.image_path);
    return data.publicUrl;
  }

  return fallbackCollaboratorImage(row.company);
}

export const listPublicCollaborators = cache(async (): Promise<PublicCollaboratorRecord[]> => {
  const { data, error } = await supabaseAdmin
    .from("collaborators")
    .select("id,company,expertise_type,image_bucket,image_path,created_at")
    .order("joint_projects", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as CollaboratorRow[]).map((row) => ({
    id: row.id,
    company: row.company,
    expertiseType: formatCollaboratorExpertise(row.expertise_type),
    image: resolveCollaboratorImage(row),
  }));
});
