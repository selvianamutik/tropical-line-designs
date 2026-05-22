export const MAX_IMAGE_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_UPLOAD_SIZE_LABEL = "10MB";
export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;
export const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const IMAGE_UPLOAD_ACCEPT = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";
export const IMAGE_UPLOAD_HELP_TEXT =
  "Upload JPG, JPEG, PNG, atau WebP maksimal 10MB. File akan dikonversi otomatis ke WebP.";

const IMAGE_UPLOAD_FORMAT_LABEL = "JPG, JPEG, PNG, atau WebP";

export type ImageUploadValidationResult =
  | {
      valid: true;
    }
  | {
      valid: false;
      message: string;
    };

function getFileExtension(fileName: string) {
  const parts = fileName.trim().toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

export function validateImageFile(file: File): ImageUploadValidationResult {
  const extension = getFileExtension(file.name);

  if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension as (typeof ALLOWED_IMAGE_EXTENSIONS)[number])) {
    return {
      valid: false,
      message: `File harus berformat ${IMAGE_UPLOAD_FORMAT_LABEL}.`,
    };
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    return {
      valid: false,
      message: `File harus berupa gambar ${IMAGE_UPLOAD_FORMAT_LABEL}.`,
    };
  }

  if (file.size > MAX_IMAGE_UPLOAD_SIZE_BYTES) {
    return {
      valid: false,
      message: `Ukuran file harus ${MAX_IMAGE_UPLOAD_SIZE_LABEL} atau lebih kecil.`,
    };
  }

  return { valid: true };
}
