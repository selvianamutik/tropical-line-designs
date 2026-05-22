export type AdminFormFieldType = "text" | "email" | "number" | "month" | "textarea" | "select" | "file" | "url";

export type AdminFormFieldValidation = {
  name: string;
  label: string;
  type?: AdminFormFieldType;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  options?: {
    value: string;
  }[];
};

type TextRule = {
  minLength?: number;
  maxLength?: number;
  disallowNumericOnly?: boolean;
};

const SIMPLE_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTTP_URL_PATTERN = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
const MONTH_PATTERN = /^\d{4}-\d{2}$/;
const PHONE_PATTERN = /^[0-9+\-().\s]+$/;

const TEXT_FIELD_RULES: Record<string, TextRule> = {
  architect: { maxLength: 160 },
  category: { maxLength: 120 },
  client: { maxLength: 160 },
  company: { minLength: 2, maxLength: 160, disallowNumericOnly: true },
  description: { maxLength: 4000 },
  expertise_type: { minLength: 2, maxLength: 120, disallowNumericOnly: true },
  footer_description: { minLength: 6, maxLength: 800 },
  footer_heading: { minLength: 2, maxLength: 180 },
  landscape_consultant: { maxLength: 160 },
  location: { minLength: 2, maxLength: 160, disallowNumericOnly: true },
  name: { minLength: 2, maxLength: 160, disallowNumericOnly: true },
  office_address: { minLength: 6, maxLength: 500 },
  organization: { minLength: 2, maxLength: 160, disallowNumericOnly: true },
  phone_number: { minLength: 6, maxLength: 50 },
  project_size: { maxLength: 80 },
  related_project: { maxLength: 160 },
  role: { minLength: 2, maxLength: 120, disallowNumericOnly: true },
  studio_name: { minLength: 2, maxLength: 160, disallowNumericOnly: true },
  title: { minLength: 2, maxLength: 160, disallowNumericOnly: true },
};

const NUMBER_FIELD_MAX: Record<string, number> = {
  display_order: 100000,
  joint_projects: 100000,
  sort_order: 100000,
};

const URL_FIELD_NAMES = new Set(["instagram_handle", "linkedin_url"]);

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getTextRule(field: AdminFormFieldValidation) {
  const baseRule = TEXT_FIELD_RULES[field.name] ?? {};
  return {
    ...baseRule,
    minLength: field.minLength ?? baseRule.minLength,
    maxLength: field.maxLength ?? baseRule.maxLength,
  };
}

function isUrlField(field: AdminFormFieldValidation) {
  return field.type === "url" || URL_FIELD_NAMES.has(field.name);
}

function isPhoneField(field: AdminFormFieldValidation) {
  return field.name === "phone_number";
}

function getMaxNumber(field: AdminFormFieldValidation) {
  return field.max ?? NUMBER_FIELD_MAX[field.name];
}

export function getAdminFieldInputAttributes(field: AdminFormFieldValidation) {
  const textRule = getTextRule(field);
  const maxNumber = getMaxNumber(field);

  return {
    max: field.max ?? maxNumber,
    maxLength: textRule.maxLength,
    min: field.min,
    minLength: textRule.minLength,
    pattern: field.type === "number" ? "\\d+" : isPhoneField(field) ? "[0-9+\\-().\\s]+" : undefined,
    step: field.type === "number" ? 1 : undefined,
    title: field.type === "number"
      ? `${field.label} harus berupa angka bulat.`
      : isPhoneField(field)
        ? `${field.label} hanya boleh berisi angka, spasi, +, -, titik, dan tanda kurung.`
        : undefined,
  };
}

export function validateAdminField(field: AdminFormFieldValidation, formData: FormData) {
  if (field.type === "file") {
    const value = formData.get(field.name);
    const hasFile = value instanceof File && value.size > 0;
    return field.required && !hasFile ? `${field.label} wajib diisi.` : null;
  }

  const rawValue = getStringValue(formData, field.name);

  if (!rawValue) {
    return field.required ? `${field.label} wajib diisi.` : null;
  }

  if (field.type === "select" && field.options?.length) {
    const allowedValues = new Set(field.options.map((option) => option.value));
    if (!allowedValues.has(rawValue)) {
      return `${field.label} tidak valid.`;
    }
  }

  if (field.type === "email") {
    if (rawValue.length > 255) {
      return `${field.label} maksimal 255 karakter.`;
    }
    if (!SIMPLE_EMAIL_PATTERN.test(rawValue)) {
      return `${field.label} harus berupa alamat email yang valid.`;
    }
  }

  if (isUrlField(field)) {
    if (rawValue.length > 2048) {
      return `${field.label} maksimal 2048 karakter.`;
    }
    if (!HTTP_URL_PATTERN.test(rawValue)) {
      return `${field.label} harus berupa URL yang diawali http:// atau https://.`;
    }
  }

  if (isPhoneField(field) && !PHONE_PATTERN.test(rawValue)) {
    return `${field.label} hanya boleh berisi angka, spasi, +, -, titik, dan tanda kurung.`;
  }

  if (field.type === "month" && !MONTH_PATTERN.test(rawValue)) {
    return `${field.label} harus memakai format bulan yang valid.`;
  }

  if (field.type === "number") {
    if (!/^\d+$/.test(rawValue)) {
      return `${field.label} harus berupa angka bulat non-negatif.`;
    }

    const value = Number(rawValue);
    if (!Number.isSafeInteger(value)) {
      return `${field.label} harus berupa angka yang valid.`;
    }

    const min = field.min ?? 0;
    const max = getMaxNumber(field);
    if (value < min) {
      return `${field.label} minimal ${min}.`;
    }
    if (typeof max === "number" && value > max) {
      return `${field.label} maksimal ${max}.`;
    }
  }

  const textRule = getTextRule(field);
  if (textRule.minLength && rawValue.length < textRule.minLength) {
    return `${field.label} minimal ${textRule.minLength} karakter.`;
  }
  if (textRule.maxLength && rawValue.length > textRule.maxLength) {
    return `${field.label} maksimal ${textRule.maxLength} karakter.`;
  }
  if (textRule.disallowNumericOnly && /^\d+$/.test(rawValue)) {
    return `${field.label} tidak boleh hanya angka.`;
  }

  return null;
}

export function validateAdminFields(fields: AdminFormFieldValidation[], formData: FormData) {
  return fields.reduce<Record<string, string>>((errors, field) => {
    const error = validateAdminField(field, formData);
    if (error) {
      errors[field.name] = error;
    }
    return errors;
  }, {});
}
