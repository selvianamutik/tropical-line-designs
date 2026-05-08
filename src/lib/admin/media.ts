import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/db";

const MEDIA_BUCKET = "site-media";
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

type MediaOwner = "portfolios" | "team_members" | "collaborators" | "awards";

type StoredImage = {
  image_bucket: string;
  image_path: string;
  image_url: string;
  image_mime_type: string;
  image_size_bytes: number;
};

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extensionForImage(file: File) {
  switch (file.type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      throw new Error("Unsupported image format.");
  }
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
  const slug = sanitizeSegment(slugSource) || owner;
  const objectPath = `${owner}/${slug}/${recordId}-${randomUUID()}.${extensionForImage(file)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from(MEDIA_BUCKET)
    .upload(objectPath, bytes, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath);

  return {
    image_bucket: MEDIA_BUCKET,
    image_path: objectPath,
    image_url: data.publicUrl,
    image_mime_type: file.type,
    image_size_bytes: file.size,
  };
}

export async function removeEntityImage(imagePath: string | null | undefined) {
  if (!imagePath) {
    return;
  }

  const { error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([imagePath]);
  if (error) {
    throw error;
  }
}

export function emptyImageColumns() {
  return {
    image_bucket: MEDIA_BUCKET,
    image_path: null,
    image_url: null,
    image_mime_type: null,
    image_size_bytes: null,
  };
}
