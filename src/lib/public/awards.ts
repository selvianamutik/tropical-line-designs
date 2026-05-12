import { cache } from "react";
import { supabaseAdmin } from "@/lib/db";

export type PublicAwardRecord = {
  id: string;
  title: string;
  organization: string;
  year: string;
  relatedProject?: string;
  description?: string;
  image: string;
};

type AwardRow = {
  id: string;
  title: string;
  organization: string;
  award_year: number;
  related_project: string | null;
  description?: string | null;
  image_bucket?: string | null;
  image_path: string | null;
  created_at: string;
};

const fallbackAwardDescriptions = new Map<string, string>([
  [
    "Completed Ibu Kota Nusantara (Kendari Djaja)",
    "Awarded for 'The Basalt House,' a residential project that redefines tropical living through massive volcanic stone structures and porous spatial planning.",
  ],
  [
    "Completed Ibu Kota Nusantara",
    "Recognized for our research into 'Pre-Colonial Geometry' and its application in modern commercial high-rise developments across Southeast Asia.",
  ],
  [
    "Completion ST Regis Jakarta",
    "Nomination for the 'Java Cultural Pavilion,' a project using locally sourced sustainable bamboo reinforced with monolithic concrete nodes.",
  ],
  [
    "Completion Radison Blu Bali Uluwatu",
    "Residential Category Finalist for 'The Obsidian Retreat.'",
  ],
]);

function fallbackAwardImage(title: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200">
      <rect width="1600" height="1200" fill="#e9dfd1"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#383532" font-family="Arial, sans-serif" font-size="48">
        ${title}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function resolveAwardImage(row: AwardRow) {
  if (row.image_path) {
    const bucket = row.image_bucket ?? "site-media";
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(row.image_path);
    return data.publicUrl;
  }

  return fallbackAwardImage(row.title);
}

export const listPublicAwards = cache(async (): Promise<PublicAwardRecord[]> => {
  const selectVariants = [
    "id,title,organization,award_year,related_project,description,image_bucket,image_path,created_at",
    "id,title,organization,award_year,related_project,image_bucket,image_path,created_at",
  ] as const;

  let rows: AwardRow[] = [];
  let lastError: unknown = null;

  for (const selectClause of selectVariants) {
    const query = await supabaseAdmin
      .from("awards")
      .select(selectClause)
      .order("award_year", { ascending: false })
      .order("created_at", { ascending: false });

    if (!query.error) {
      rows = ((query.data ?? []) as Partial<AwardRow>[]).map((row) => ({
        id: row.id ?? "",
        title: row.title ?? "",
        organization: row.organization ?? "",
        award_year: row.award_year ?? 0,
        related_project: row.related_project ?? null,
        description: row.description ?? null,
        image_bucket: row.image_bucket ?? "site-media",
        image_path: row.image_path ?? null,
        created_at: row.created_at ?? "",
      }));
      lastError = null;
      break;
    }

    if (query.error.code !== "42703" && query.error.code !== "PGRST204") {
      throw query.error;
    }

    lastError = query.error;
  }

  if (lastError) {
    throw lastError;
  }

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    organization: row.organization,
    year: String(row.award_year),
    relatedProject: row.related_project ?? undefined,
    description: row.description ?? fallbackAwardDescriptions.get(row.title) ?? undefined,
    image: resolveAwardImage(row),
  }));
});
