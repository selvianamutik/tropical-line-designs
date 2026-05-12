import { cache } from "react";
import { supabaseAdmin } from "@/lib/db";

export type PublicTeamMemberRecord = {
  id: string;
  name: string;
  role: string;
  image: string;
  email?: string;
};

type TeamMemberRow = {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  image_bucket?: string | null;
  image_path: string | null;
  created_at: string;
};

function fallbackMemberImage(name: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200">
      <rect width="900" height="1200" fill="#e9dfd1"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#383532" font-family="Arial, sans-serif" font-size="42">
        ${name}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function resolveMemberImage(row: TeamMemberRow) {
  if (row.image_path) {
    const bucket = row.image_bucket ?? "site-media";
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(row.image_path);
    return data.publicUrl;
  }

  return fallbackMemberImage(row.name);
}

export const listPublicTeamMembers = cache(async (): Promise<PublicTeamMemberRecord[]> => {
  const { data, error } = await supabaseAdmin
    .from("team_members")
    .select("id,name,role,email,status,image_bucket,image_path,created_at")
    .eq("status", "Active")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as TeamMemberRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    role: row.role,
    email: row.email,
    image: resolveMemberImage(row),
  }));
});
