const PROJECT_STATUSES = ["Planning", "Design", "Construction", "Completed", "On Hold"] as const;
const MEMBER_STATUSES = ["Active", "On Leave", "Inactive"] as const;
const GALLERY_LAYOUTS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] as const;
const MONTH_PATTERN = /^\d{4}-\d{2}$/;
const SIMPLE_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTTP_URL_PATTERN = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

type StringRuleOptions = {
  minLength?: number;
  maxLength?: number;
  allowMultiline?: boolean;
  disallowNumericOnly?: boolean;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/\r\n/g, "\n").trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeWhitespace(value: string, allowMultiline = false) {
  return allowMultiline
    ? value.split("\n").map((line) => line.replace(/\s+/g, " ").trim()).join("\n").trim()
    : value.replace(/\s+/g, " ").trim();
}

function assertStringRules(value: string, key: string, options: StringRuleOptions = {}) {
  const normalized = normalizeWhitespace(value, options.allowMultiline);

  if (options.minLength && normalized.length < options.minLength) {
    throw new Error(`Field "${key}" must be at least ${options.minLength} characters.`);
  }

  if (options.maxLength && normalized.length > options.maxLength) {
    throw new Error(`Field "${key}" must be at most ${options.maxLength} characters.`);
  }

  if (options.disallowNumericOnly && /^\d+$/.test(normalized)) {
    throw new Error(`Field "${key}" cannot contain numbers only.`);
  }

  return normalized;
}

export function requiredText(formData: FormData, key: string, options: StringRuleOptions = {}) {
  const value = getStringValue(formData, key);
  if (!value) {
    throw new Error(`Field "${key}" is required.`);
  }
  return assertStringRules(value, key, options);
}

export function optionalText(formData: FormData, key: string, options: StringRuleOptions = {}) {
  const value = getStringValue(formData, key);
  if (!value) {
    return null;
  }
  return assertStringRules(value, key, options);
}

export function requiredEmail(formData: FormData, key: string) {
  const value = requiredText(formData, key, { maxLength: 255 }).toLowerCase();
  if (!SIMPLE_EMAIL_PATTERN.test(value)) {
    throw new Error(`Field "${key}" must be a valid email address.`);
  }
  return value;
}

export function optionalHttpUrl(formData: FormData, key: string) {
  const value = optionalText(formData, key, { maxLength: 2048 });
  if (!value) {
    return null;
  }
  if (!HTTP_URL_PATTERN.test(value)) {
    throw new Error(`Field "${key}" must be a valid http or https URL.`);
  }
  return value;
}

export function requiredEnumValue<const T extends readonly string[]>(
  formData: FormData,
  key: string,
  allowed: T,
) {
  const value = requiredText(formData, key, { maxLength: 50 });
  if (!allowed.includes(value as T[number])) {
    throw new Error(`Field "${key}" has an invalid value.`);
  }
  return value as T[number];
}

export function optionalNonNegativeInteger(
  formData: FormData,
  key: string,
  { max }: { max?: number } = {},
) {
  const raw = getStringValue(formData, key);
  if (!raw) {
    return 0;
  }
  if (!/^\d+$/.test(raw)) {
    throw new Error(`Field "${key}" must be a whole number.`);
  }
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Field "${key}" must be a non-negative whole number.`);
  }
  if (typeof max === "number" && value > max) {
    throw new Error(`Field "${key}" must be at most ${max}.`);
  }
  return value;
}

export function requiredYear(formData: FormData, key: string) {
  const value = optionalNonNegativeInteger(formData, key, { max: 2100 });
  if (value < 1900) {
    throw new Error(`Field "${key}" must be between 1900 and 2100.`);
  }
  return value;
}

export function optionalMonthValue(formData: FormData, key: string) {
  const value = optionalText(formData, key, { maxLength: 7 });
  if (!value) {
    return null;
  }
  if (!MONTH_PATTERN.test(value)) {
    throw new Error(`Field "${key}" must use YYYY-MM format.`);
  }
  return `${value}-01`;
}

export function slugifyOrThrow(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    throw new Error("Unable to generate a valid slug from the provided title.");
  }

  return slug;
}

export { GALLERY_LAYOUTS, MEMBER_STATUSES, PROJECT_STATUSES };
