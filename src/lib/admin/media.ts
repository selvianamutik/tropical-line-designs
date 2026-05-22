import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import {
  MAX_IMAGE_UPLOAD_SIZE_BYTES,
  MAX_IMAGE_UPLOAD_SIZE_LABEL,
  validateImageFile,
} from "@/lib/admin/image-validation";

const MEDIA_BUCKET = "site-media";

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

function buildUniqueImageFilename(slugSource: string, extension: string) {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
  return `${buildInitials(slugSource)}-${timestamp}-${random}.${extension}`;
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

function isJpeg(bytes: Uint8Array) {
  return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

function isPng(bytes: Uint8Array) {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  return signature.every((byte, index) => bytes[index] === byte);
}

function isWebp(bytes: Uint8Array) {
  if (bytes.length < 12) {
    return false;
  }

  const riff = String.fromCharCode(...bytes.slice(0, 4));
  const webp = String.fromCharCode(...bytes.slice(8, 12));
  return riff === "RIFF" && webp === "WEBP";
}

async function assertImageSignature(file: File, key: string) {
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const hasValidSignature = isJpeg(header) || isPng(header) || isWebp(header);

  if (!hasValidSignature) {
    throw new Error(`Field "${key}" must contain a valid JPG, JPEG, PNG, or WebP image file.`);
  }
}

export async function getOptionalImageFile(formData: FormData, key: string) {
  const value = formData.get(key);
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  const validation = validateImageFile(value);
  if (!validation.valid) {
    throw new Error(`Field "${key}": ${validation.message}`);
  }

  await assertImageSignature(value, key);

  return value;
}

async function convertImageToWebp(file: File) {
  const inputBuffer = Buffer.from(await file.arrayBuffer());
  if (inputBuffer.byteLength > MAX_IMAGE_UPLOAD_SIZE_BYTES) {
    throw new Error(`Uploaded image must be ${MAX_IMAGE_UPLOAD_SIZE_LABEL} or smaller.`);
  }

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
  const projectSegment = sanitizeSegment(portfolioId) || "project";
  const convertedImage = await convertImageToWebp(file);
  const folderPath = `portfolio-gallery/${projectSegment}/${slug}`;
  const objectPath = `${folderPath}/${buildUniqueImageFilename(slugSource, convertedImage.extension)}`;

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
