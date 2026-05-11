import type {
  AwardRecord,
  CollaboratorRecord,
  DashboardMetrics,
  PortfolioGalleryItemRecord,
  PortfolioRecord,
  SiteSettingsRecord,
  TeamMemberRecord,
} from "@/lib/admin/types";
import { createClient } from "@/lib/supabase/server";

function withImagePublicUrl<T extends { image_bucket?: string | null; image_path?: string | null }>(record: T) {
  if (!record.image_path) {
    return { ...record, image_public_url: null };
  }

  const bucket = record.image_bucket ?? "site-media";
  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${record.image_path}`;
  return { ...record, image_public_url: publicUrl };
}

export async function listPortfolios() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolios")
    .select("*")
    .order("commenced_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data || []) as PortfolioRecord[]).map(withImagePublicUrl);
}

type RawPortfolioGalleryItemRow = {
  id: string;
  portfolio_id: string;
  media_asset_id: string;
  sort_order: number;
  caption: string | null;
  created_at: string;
  media_assets: {
    public_url: string;
    object_path: string;
  } | {
    public_url: string;
    object_path: string;
  }[] | null;
};

function normalizeGalleryAsset(
  asset: RawPortfolioGalleryItemRow["media_assets"],
) {
  return Array.isArray(asset) ? (asset[0] ?? null) : asset;
}

export async function listPortfolioGalleryItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_gallery_items")
    .select("id,portfolio_id,media_asset_id,sort_order,caption,created_at,media_assets(public_url,object_path)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return ((data ?? []) as RawPortfolioGalleryItemRow[])
    .map((item) => {
      const asset = normalizeGalleryAsset(item.media_assets);
      if (!asset?.public_url || !asset.object_path) {
        return null;
      }

      return {
        id: item.id,
        portfolio_id: item.portfolio_id,
        media_asset_id: item.media_asset_id,
        sort_order: item.sort_order,
        caption: item.caption,
        created_at: item.created_at,
        media_asset_url: asset.public_url,
        media_asset_path: asset.object_path,
      } satisfies PortfolioGalleryItemRecord;
    })
    .filter((item): item is PortfolioGalleryItemRecord => Boolean(item));
}

export async function listTeamMembers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data || []) as TeamMemberRecord[]).map(withImagePublicUrl);
}

export async function listCollaborators() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collaborators")
    .select("*")
    .order("joint_projects", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data || []) as CollaboratorRecord[]).map(withImagePublicUrl);
}

export async function listAwards() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("awards")
    .select("*")
    .order("award_year", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data || []) as AwardRecord[]).map(withImagePublicUrl);
}

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as SiteSettingsRecord | null;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [projects, awards, teamMembers, collaborators] = await Promise.all([
    listPortfolios(),
    listAwards(),
    listTeamMembers(),
    listCollaborators(),
  ]);

  return {
    totalProjects: projects.length,
    totalAwards: awards.length,
    totalTeamMembers: teamMembers.length,
    totalCollaborators: collaborators.length,
    recentProjects: projects.slice(0, 3),
  };
}
