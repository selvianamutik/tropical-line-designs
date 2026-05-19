import { supabaseAdmin } from "@/lib/db";

export type PublicServiceRecord = {
  id: string;
  title: string;
  description: string | null;
  images: string[];
};

type ServiceRow = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  image_1_bucket?: string | null;
  image_1_path?: string | null;
  image_2_bucket?: string | null;
  image_2_path?: string | null;
};

const fallbackServices: PublicServiceRecord[] = [
  {
    id: "design",
    title: "DESIGN",
    description:
      "We embody and harmonize our clients' passion with the beauty of art wrapped in a 2-dimensional design. The design process goes through five stages: Conceptual Design, Design Development, Document for Tender, Document for Construction, and Construction Supervision.",
    images: ["/sofitel/so-1.jpg", "/anantara/an-1.jpg"],
  },
  {
    id: "build",
    title: "BUILD",
    description:
      "Not only do we embody the beauty of landscape art into 2-dimensional media, but we also dedicate ourselves to build the beauty into reality, which can be enjoyed directly. With the support of our complete set of construction equipment and planting nursery that has a wide variety of plants exclusively taken care of for our projects, we aim to build beautifully designed landscape architecture into life.",
    images: ["/bajo-well/bw-1.jpg", "/st-regis-bali/stb-1.png"],
  },
];

function getFallbackImages(title: string) {
  const normalizedTitle = title.trim().toUpperCase();
  const matchedService = fallbackServices.find((service) => service.title === normalizedTitle);
  return matchedService?.images ?? fallbackServices[0].images;
}

function getStoragePublicUrl(bucket: string | null | undefined, path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (path.startsWith("/") || /^https?:\/\//.test(path)) {
    return path;
  }

  const resolvedBucket = bucket ?? "site-media";
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${resolvedBucket}/${path}`;
}

function normalizeService(service: ServiceRow): PublicServiceRecord {
  const imageUrls = [
    getStoragePublicUrl(service.image_1_bucket, service.image_1_path),
    getStoragePublicUrl(service.image_2_bucket, service.image_2_path),
  ].filter((url): url is string => Boolean(url));

  const fallbackImages = getFallbackImages(service.title);
  for (const image of fallbackImages) {
    if (imageUrls.length >= 2) {
      break;
    }

    if (!imageUrls.includes(image)) {
      imageUrls.push(image);
    }
  }

  return {
    id: service.id,
    title: service.title,
    description: service.description,
    images: imageUrls.slice(0, 2),
  };
}

async function queryServices(selectColumns: string) {
  return supabaseAdmin
    .from("services")
    .select(selectColumns)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
}

export async function listPublicServices(): Promise<PublicServiceRecord[]> {
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("id,title,description,sort_order,is_active,image_1_bucket,image_1_path,image_2_bucket,image_2_path")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error?.code === "42P01" || error?.code === "PGRST205") {
    return fallbackServices;
  }

  if (error?.code === "42703" || error?.code === "PGRST204") {
    const fallbackQuery = await queryServices("id,title,description,sort_order,is_active");
    if (fallbackQuery.error?.code === "42P01" || fallbackQuery.error?.code === "PGRST205") {
      return fallbackServices;
    }

    if (fallbackQuery.error) {
      throw fallbackQuery.error;
    }

    return ((fallbackQuery.data ?? []) as unknown as ServiceRow[]).map(normalizeService);
  }

  if (error) {
    throw error;
  }

  return ((data ?? []) as ServiceRow[]).map(normalizeService);
}
