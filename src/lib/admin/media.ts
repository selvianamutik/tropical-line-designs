import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";

const MEDIA_BUCKET = "site-media";
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

type MediaOwner =
  | "portfolios"
  | "team_members"
  | "collaborators"
  | "awards"
  | "portfolio_gallery"
  | "services"
  | "site_settings";

type StoredImage = {
  image_bucket: string;
  image_path: string;
  image_mime_type: string;
  image_size_bytes: number;
};

type EmptyStoredImage = {
  image_bucket: string;
  image_path: string | null;
  image_mime_type: string | null;
  image_size_bytes: number | null;
};

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildInitials(value: string) {
  const parts = value
    .trim()
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);

  const initials = parts.map((part) => part[0]?.toLowerCase() ?? "").join("");
  return initials || "img";
}

async function nextImageIndex(supabase: Awaited<ReturnType<typeof createClient>>, folderPath: string) {
  const prefix = folderPath;
  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list(prefix, {
    limit: 100,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    throw error;
  }

  return (data ?? []).filter((item) => item.id).length + 1;
}

export function getOptionalImageFile(formData: FormData, key: string) {
  const value = formData.get(key);
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  if (!ALLOWED_IMAGE_TYPES.has(value.type)) {
    throw new Error(`Field "${key}" must be a JPEG, PNG, WebP, or AVIF image.`);
  }

  if (value.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`Field "${key}" must be 10MB or smaller.`);
  }

  return value;
}

async function convertImageToWebp(file: File) {
  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const outputBuffer = await sharp(inputBuffer, { animated: false })
    .rotate()
    .webp({ quality: 82, effort: 6 })
    .toBuffer();

  return {
    bytes: new Uint8Array(outputBuffer),
    mimeType: "image/webp",
    sizeBytes: outputBuffer.byteLength,
    extension: "webp",
  };
}

export async function uploadEntityImage({
  owner,
  recordId,
  slugSource,
  file,
}: {
  owner: MediaOwner;
  recordId: string;
  slugSource: string;
  file: File;
}): Promise<StoredImage> {
  const supabase = await createClient();
  const slug = sanitizeSegment(slugSource) || owner;
  const convertedImage = await convertImageToWebp(file);
  const folderPath = `${owner}/${slug}`;
  const initials = buildInitials(slugSource);
  const index = await nextImageIndex(supabase, folderPath);
  const objectPath = `${folderPath}/${initials}-${index}.${convertedImage.extension}`;

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(objectPath, convertedImage.bytes, {
      contentType: convertedImage.mimeType,
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  return {
    image_bucket: MEDIA_BUCKET,
    image_path: objectPath,
    image_mime_type: convertedImage.mimeType,
    image_size_bytes: convertedImage.sizeBytes,
  };
}

export async function removeEntityImage(imagePath: string | null | undefined) {
  if (!imagePath) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([imagePath]);
  if (error) {
    throw error;
  }
}

export function emptyImageColumns(): EmptyStoredImage {
  return {
    image_bucket: MEDIA_BUCKET,
    image_path: null,
    image_mime_type: null,
    image_size_bytes: null,
  };
}

export async function uploadPortfolioGalleryAsset({
  portfolioId,
  slugSource,
  file,
}: {
  portfolioId: string;
  slugSource: string;
  file: File;
}) {
  const supabase = await createClient();
  const slug = sanitizeSegment(slugSource) || "portfolio-gallery";
  const convertedImage = await convertImageToWebp(file);
  const folderPath = `portfolio-gallery/${slug}`;
  const initials = buildInitials(slugSource);
  const index = await nextImageIndex(supabase, folderPath);
  const objectPath = `${folderPath}/${initials}-${index}.${convertedImage.extension}`;

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(objectPath, convertedImage.bytes, {
      contentType: convertedImage.mimeType,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath);

  const { data: mediaAsset, error: mediaError } = await supabase
    .from("media_assets")
    .insert({
      bucket: MEDIA_BUCKET,
      object_path: objectPath,
      public_url: data.publicUrl,
      mime_type: convertedImage.mimeType,
      size_bytes: convertedImage.sizeBytes,
      alt_text: `${slugSource} gallery image`,
    })
    .select("id, public_url, object_path")
    .single();

  if (mediaError) {
    await removeEntityImage(objectPath);
    throw mediaError;
  }

  return {
    mediaAssetId: mediaAsset.id as string,
    publicUrl: mediaAsset.public_url as string,
    objectPath: mediaAsset.object_path as string,
    mimeType: convertedImage.mimeType,
    sizeBytes: convertedImage.sizeBytes,
  };
}
