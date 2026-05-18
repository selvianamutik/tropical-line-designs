import { cache } from "react";
import { supabaseAdmin } from "@/lib/db";

export type GalleryLayout = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";

export type PublicProjectRecord = {
  slug: string;
  title: string;
  location: string;
  year: string;
  type: string;
  image: string;
  images?: string[];
  galleryLayout?: GalleryLayout;
  status?: string;
  architect?: string;
  landscapeConsultant?: string;
  client?: string;
  projectSize?: string;
  description?: string;
};

type PortfolioRow = {
  id: string;
  title: string;
  slug: string;
  location: string;
  status: string;
  commenced_at: string | null;
  client: string | null;
  category: string | null;
  architect?: string | null;
  landscape_consultant?: string | null;
  project_size?: string | null;
  display_order?: number | null;
  description: string | null;
  gallery_layout: GalleryLayout;
  image_url?: string | null;
  image_bucket?: string | null;
  image_path: string | null;
  created_at: string;
};

type GalleryItemRow = {
  portfolio_id: string;
  sort_order: number;
  media_assets: {
    public_url: string;
  } | {
    public_url: string;
  }[] | null;
};

function normalizeGalleryAsset(
  asset: GalleryItemRow["media_assets"],
) {
  return Array.isArray(asset) ? (asset[0] ?? null) : asset;
}

function formatProjectYear(commencedAt: string | null) {
  if (!commencedAt) {
    return "Undated";
  }

  const year = new Date(commencedAt).getUTCFullYear();
  return Number.isFinite(year) ? String(year) : "Undated";
}

function fallbackProjectImage(slug: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000">
      <rect width="1600" height="1000" fill="#e9dfd1"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#383532" font-family="Arial, sans-serif" font-size="52">
        ${slug}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function resolveProjectImage(row: PortfolioRow) {
  if (row.image_url) {
    return row.image_url;
  }

  if (row.image_path) {
    const bucket = row.image_bucket ?? "site-media";
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(row.image_path);
    return data.publicUrl;
  }

  return fallbackProjectImage(row.slug);
}

function mapPortfolioToPublicProject(row: PortfolioRow, galleryImages: string[]): PublicProjectRecord {
  const primaryImage = resolveProjectImage(row);
  const images = galleryImages.length > 0 ? galleryImages : [primaryImage];

  return {
    slug: row.slug,
    title: row.title,
    location: row.location,
    year: formatProjectYear(row.commenced_at),
    type: row.category ?? "Landscape Project",
    image: primaryImage,
    images,
    galleryLayout: row.gallery_layout,
    status: row.status,
    architect: row.architect ?? undefined,
    landscapeConsultant: row.landscape_consultant ?? undefined,
    client: row.client ?? undefined,
    projectSize: row.project_size ?? undefined,
    description: row.description ?? undefined,
  };
}

export const listPublicProjects = cache(async (): Promise<PublicProjectRecord[]> => {
  let portfolios: PortfolioRow[] = [];
  const selectVariants = [
    "id,title,slug,location,status,commenced_at,client,category,architect,landscape_consultant,project_size,display_order,description,gallery_layout,image_url,image_bucket,image_path,created_at",
    "id,title,slug,location,status,commenced_at,client,category,architect,landscape_consultant,project_size,display_order,description,gallery_layout,image_bucket,image_path,created_at",
    "id,title,slug,location,status,commenced_at,client,category,architect,landscape_consultant,project_size,display_order,description,image_bucket,image_path,created_at",
    "id,title,slug,location,status,commenced_at,client,category,architect,landscape_consultant,project_size,display_order,description,image_path,created_at",
    "id,title,slug,location,status,commenced_at,client,category,architect,landscape_consultant,project_size,description,gallery_layout,image_url,image_bucket,image_path,created_at",
    "id,title,slug,location,status,commenced_at,client,category,architect,landscape_consultant,project_size,description,gallery_layout,image_bucket,image_path,created_at",
    "id,title,slug,location,status,commenced_at,client,category,architect,landscape_consultant,project_size,description,image_bucket,image_path,created_at",
    "id,title,slug,location,status,commenced_at,client,category,architect,landscape_consultant,project_size,description,image_path,created_at",
    "id,title,slug,location,status,commenced_at,client,category,description,gallery_layout,image_bucket,image_path,created_at",
    "id,title,slug,location,status,commenced_at,client,category,description,image_bucket,image_path,created_at",
  ] as const;

  let lastError: unknown = null;

  for (const selectClause of selectVariants) {
    const query = await supabaseAdmin
      .from("portfolios")
      .select(selectClause)
      .order(selectClause.includes("display_order") ? "display_order" : "commenced_at", {
        ascending: selectClause.includes("display_order"),
        nullsFirst: false,
      })
      .order("commenced_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (!query.error) {
      portfolios = ((query.data ?? []) as Partial<PortfolioRow>[]).map((row) => ({
        id: row.id ?? "",
        title: row.title ?? "",
        slug: row.slug ?? "",
        location: row.location ?? "",
        status: row.status ?? "Planning",
        commenced_at: row.commenced_at ?? null,
        client: row.client ?? null,
        category: row.category ?? null,
        architect: row.architect ?? null,
        landscape_consultant: row.landscape_consultant ?? null,
        project_size: row.project_size ?? null,
        description: row.description ?? null,
        gallery_layout: row.gallery_layout ?? "D",
        image_url: row.image_url ?? null,
        image_bucket: row.image_bucket ?? "site-media",
        image_path: row.image_path ?? null,
        created_at: row.created_at ?? "",
      }));
      lastError = null;
      break;
    }

    if (query.error.code !== "42703") {
      throw query.error;
    }

    lastError = query.error;
  }

  if (lastError) {
    throw lastError;
  }

  const portfolioIds = portfolios.map((row) => row.id);

  let galleryByPortfolioId = new Map<string, string[]>();

  if (portfolioIds.length > 0) {
    const { data: galleryItems, error: galleryError } = await supabaseAdmin
      .from("portfolio_gallery_items")
      .select("portfolio_id,sort_order,media_assets(public_url)")
      .in("portfolio_id", portfolioIds)
      .order("sort_order", { ascending: true });

    if (galleryError?.code === "42P01" || galleryError?.code === "PGRST205") {
      galleryByPortfolioId = new Map<string, string[]>();
    } else if (galleryError) {
      throw galleryError;
    }

    if (galleryItems) {
      galleryByPortfolioId = (galleryItems as GalleryItemRow[]).reduce((map, item) => {
        const publicUrl = normalizeGalleryAsset(item.media_assets)?.public_url;
        if (!publicUrl) {
          return map;
        }
        const current = map.get(item.portfolio_id) ?? [];
        current.push(publicUrl);
        map.set(item.portfolio_id, current);
        return map;
      }, new Map<string, string[]>());
    }
  }

  return portfolios.map((row) => mapPortfolioToPublicProject(row, galleryByPortfolioId.get(row.id) ?? []));
});
