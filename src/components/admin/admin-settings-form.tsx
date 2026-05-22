"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminToast } from "@/components/admin/admin-toast";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import {
  getAdminFieldInputAttributes,
  validateAdminFields,
  type AdminFormFieldValidation,
} from "@/lib/admin/form-field-validation";
import { IMAGE_UPLOAD_ACCEPT, IMAGE_UPLOAD_HELP_TEXT, validateImageFile } from "@/lib/admin/image-validation";
import { cn } from "@/lib/utils";

type SiteSettingsValues = {
  studio_name: string;
  contact_email: string;
  phone_number: string;
  office_address: string;
  instagram_handle: string;
  linkedin_url: string;
  footer_heading: string;
  footer_description: string;
  about_principal_image_url: string | null;
  contact_image_url: string | null;
};

const settingsFields = [
  { name: "studio_name", label: "Studio Name", required: true },
  { name: "contact_email", label: "Contact Email", type: "email", required: true },
  { name: "phone_number", label: "Phone Number", required: true },
  { name: "instagram_handle", label: "Instagram URL", type: "url" },
  { name: "office_address", label: "Office Address", type: "textarea", required: true },
  { name: "linkedin_url", label: "LinkedIn URL", type: "url" },
  { name: "footer_heading", label: "Footer Heading", type: "textarea", required: true },
  { name: "footer_description", label: "Footer Description", type: "textarea", required: true },
] satisfies AdminFormFieldValidation[];

function shouldUseUnoptimizedImage(src: string) {
  return src.startsWith("blob:")
    || src.startsWith("data:")
    || src.includes("/storage/v1/object/public/");
}

function SettingsImageField({
  name,
  label,
  currentMediaUrl,
  helpText,
}: {
  name: string;
  label: string;
  currentMediaUrl?: string | null;
  helpText: string;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const imageUrl = previewUrl ?? currentMediaUrl ?? null;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">{label}</label>
      <Input
        name={name}
        type="file"
        accept={IMAGE_UPLOAD_ACCEPT}
        onChange={(event) => {
          const file = event.target.files?.[0];
          setFileError(null);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }

          if (!file) {
            return;
          }

          const validation = validateImageFile(file);
          if (!validation.valid) {
            event.target.value = "";
            setFileError(validation.message);
            return;
          }

          setPreviewUrl(URL.createObjectURL(file));
        }}
      />
      {fileError ? (
        <p className="text-[11px] font-medium text-[#a13c2f]">{fileError}</p>
      ) : null}
      {imageUrl ? (
        <div className="flex items-center gap-4 rounded-sm border border-[#eadfcd] bg-[#fbf7f0] p-3">
          <div className="relative h-24 w-32 overflow-hidden rounded-[2px] bg-[#efe7dc]">
            <Image
              src={imageUrl}
              alt={`${label} preview`}
              fill
              sizes="128px"
              className="object-cover"
              unoptimized={shouldUseUnoptimizedImage(imageUrl)}
            />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a867f]">
              {previewUrl ? "Selected image" : "Current image"}
            </p>
            <p className="mt-1 text-sm text-[#6b6762]">{helpText}</p>
            {previewUrl ? <p className="mt-1 text-[11px] text-[#8a867f]">{IMAGE_UPLOAD_HELP_TEXT}</p> : null}
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-[#8a867f]">
          {helpText} {IMAGE_UPLOAD_HELP_TEXT}
        </p>
      )}
    </div>
  );
}

export function AdminSettingsForm({
  action,
  values,
}: {
  action: (formData: FormData) => Promise<void>;
  values: SiteSettingsValues;
}) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearFieldError = (name: string) => {
    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const getFieldAttributes = (name: string): ReturnType<typeof getAdminFieldInputAttributes> => {
    const field = settingsFields.find((field) => field.name === name) ?? { name, label: name };
    return getAdminFieldInputAttributes(field);
  };

  const renderFieldError = (name: string) => (
    fieldErrors[name] ? <p className="text-[11px] font-medium text-[#a13c2f]">{fieldErrors[name]}</p> : null
  );

  return (
    <form
      noValidate
      action={async (formData) => {
        const nextFieldErrors = validateAdminFields(settingsFields, formData);
        setFieldErrors(nextFieldErrors);

        if (Object.keys(nextFieldErrors).length > 0) {
          showToast({
            tone: "error",
            title: "Input belum valid.",
            description: "Periksa kembali field yang ditandai sebelum menyimpan.",
          });
          return;
        }

        try {
          await action(formData);
          showToast({
            tone: "success",
            title: "Studio settings berhasil disimpan.",
          });
          router.refresh();
        } catch (error) {
          showToast({
            tone: "error",
            title: "Gagal menyimpan studio settings.",
            description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan pengaturan.",
          });
        }
      }}
      className="bg-white border border-[#e9e6df] rounded-sm shadow-sm"
    >
      <div className="p-8 border-b border-[#e9e6df]">
        <h3 className="font-sans font-bold text-lg text-[#383532] mb-1">General Information</h3>
        <p className="text-[#a5a098] text-sm">This form writes directly to the `site_settings` table.</p>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">Studio Name</label>
            <Input
              name="studio_name"
              required
              defaultValue={values.studio_name}
              aria-invalid={Boolean(fieldErrors.studio_name)}
              onChange={() => clearFieldError("studio_name")}
              {...getFieldAttributes("studio_name")}
            />
            {renderFieldError("studio_name")}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">Contact Email</label>
            <Input
              name="contact_email"
              type="email"
              required
              defaultValue={values.contact_email}
              aria-invalid={Boolean(fieldErrors.contact_email)}
              onChange={() => clearFieldError("contact_email")}
              {...getFieldAttributes("contact_email")}
            />
            {renderFieldError("contact_email")}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">Phone Number</label>
            <Input
              name="phone_number"
              required
              defaultValue={values.phone_number}
              aria-invalid={Boolean(fieldErrors.phone_number)}
              onChange={() => clearFieldError("phone_number")}
              {...getFieldAttributes("phone_number")}
            />
            {renderFieldError("phone_number")}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">Instagram URL</label>
            <Input
              name="instagram_handle"
              type="url"
              defaultValue={values.instagram_handle}
              placeholder="https://www.instagram.com/tropicallinedesign/"
              aria-invalid={Boolean(fieldErrors.instagram_handle)}
              onChange={() => clearFieldError("instagram_handle")}
              {...getFieldAttributes("instagram_handle")}
            />
            {renderFieldError("instagram_handle")}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">Office Address</label>
          <textarea
            name="office_address"
            required
            defaultValue={values.office_address}
            minLength={getFieldAttributes("office_address").minLength}
            maxLength={getFieldAttributes("office_address").maxLength}
            aria-invalid={Boolean(fieldErrors.office_address)}
            onChange={() => clearFieldError("office_address")}
            className={cn(
              "flex w-full rounded-sm border border-[#d9d4ca] bg-transparent px-3 py-2 text-sm text-[#383532] transition-colors placeholder:text-[#a5a098] focus-visible:outline-none focus-visible:border-[#d97706] min-h-[120px] resize-y",
            )}
          />
          {renderFieldError("office_address")}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">LinkedIn URL</label>
          <Input
            name="linkedin_url"
            type="url"
            defaultValue={values.linkedin_url}
            placeholder="https://www.linkedin.com/company/..."
            aria-invalid={Boolean(fieldErrors.linkedin_url)}
            onChange={() => clearFieldError("linkedin_url")}
            {...getFieldAttributes("linkedin_url")}
          />
          {renderFieldError("linkedin_url")}
        </div>

        <div className="grid gap-8 border-t border-[#e9e6df] pt-8 md:grid-cols-2">
          <div>
            <h3 className="font-sans text-base font-bold text-[#383532]">Page Images</h3>
            <p className="mt-1 text-sm text-[#a5a098]">
              Images shown on the About Principal area and Contact page.
            </p>
          </div>

          <div className="grid gap-6">
            <SettingsImageField
              name="about_principal_image_file"
              label="Principal Page Top Image"
              currentMediaUrl={values.about_principal_image_url}
              helpText={
                values.about_principal_image_url
                  ? "Leave empty to keep the current top image on the Principal page."
                  : "Leave empty to use the default top image on the Principal page."
              }
            />
            <SettingsImageField
              name="contact_image_file"
              label="Contact Page Image"
              currentMediaUrl={values.contact_image_url}
              helpText={
                values.contact_image_url
                  ? "Leave empty to keep the current Contact page image."
                  : "Leave empty to use the default contact image."
              }
            />
          </div>
        </div>

        <div className="grid gap-8 border-t border-[#e9e6df] pt-8">
          <div>
            <h3 className="font-sans text-base font-bold text-[#383532]">Footer Copy</h3>
            <p className="mt-1 text-sm text-[#a5a098]">Content shown in the global footer introduction.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">Footer Heading</label>
            <textarea
              name="footer_heading"
              required
              defaultValue={values.footer_heading}
              minLength={getFieldAttributes("footer_heading").minLength}
              maxLength={getFieldAttributes("footer_heading").maxLength}
              aria-invalid={Boolean(fieldErrors.footer_heading)}
              onChange={() => clearFieldError("footer_heading")}
              className={cn(
                "flex min-h-[90px] w-full resize-y rounded-sm border border-[#d9d4ca] bg-transparent px-3 py-2 text-sm text-[#383532] transition-colors placeholder:text-[#a5a098] focus-visible:border-[#d97706] focus-visible:outline-none",
              )}
            />
            {renderFieldError("footer_heading")}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">Footer Description</label>
            <textarea
              name="footer_description"
              required
              defaultValue={values.footer_description}
              minLength={getFieldAttributes("footer_description").minLength}
              maxLength={getFieldAttributes("footer_description").maxLength}
              aria-invalid={Boolean(fieldErrors.footer_description)}
              onChange={() => clearFieldError("footer_description")}
              className={cn(
                "flex min-h-[140px] w-full resize-y rounded-sm border border-[#d9d4ca] bg-transparent px-3 py-2 text-sm text-[#383532] transition-colors placeholder:text-[#a5a098] focus-visible:border-[#d97706] focus-visible:outline-none",
              )}
            />
            {renderFieldError("footer_description")}
          </div>
        </div>
      </div>

      <div className="p-8 border-t border-[#e9e6df] bg-[#f4efe6] flex justify-end">
        <Button type="submit">Save Settings</Button>
      </div>
    </form>
  );
}
