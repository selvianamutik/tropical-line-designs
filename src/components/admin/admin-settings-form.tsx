"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminToast } from "@/components/admin/admin-toast";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
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
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={(event) => {
          const file = event.target.files?.[0];
          setPreviewUrl(file ? URL.createObjectURL(file) : null);
        }}
      />
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
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-[#8a867f]">{helpText}</p>
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

  return (
    <form
      action={async (formData) => {
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
            <Input name="studio_name" required defaultValue={values.studio_name} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">Contact Email</label>
            <Input name="contact_email" type="email" required defaultValue={values.contact_email} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">Phone Number</label>
            <Input name="phone_number" required defaultValue={values.phone_number} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">Instagram URL</label>
            <Input
              name="instagram_handle"
              type="url"
              defaultValue={values.instagram_handle}
              placeholder="https://www.instagram.com/tropicallinedesign/"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">Office Address</label>
          <textarea
            name="office_address"
            required
            defaultValue={values.office_address}
            className={cn(
              "flex w-full rounded-sm border border-[#d9d4ca] bg-transparent px-3 py-2 text-sm text-[#383532] transition-colors placeholder:text-[#a5a098] focus-visible:outline-none focus-visible:border-[#d97706] min-h-[120px] resize-y",
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">LinkedIn URL</label>
          <Input
            name="linkedin_url"
            type="url"
            defaultValue={values.linkedin_url}
            placeholder="https://www.linkedin.com/company/..."
          />
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
              className={cn(
                "flex min-h-[90px] w-full resize-y rounded-sm border border-[#d9d4ca] bg-transparent px-3 py-2 text-sm text-[#383532] transition-colors placeholder:text-[#a5a098] focus-visible:border-[#d97706] focus-visible:outline-none",
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">Footer Description</label>
            <textarea
              name="footer_description"
              required
              defaultValue={values.footer_description}
              className={cn(
                "flex min-h-[140px] w-full resize-y rounded-sm border border-[#d9d4ca] bg-transparent px-3 py-2 text-sm text-[#383532] transition-colors placeholder:text-[#a5a098] focus-visible:border-[#d97706] focus-visible:outline-none",
              )}
            />
          </div>
        </div>
      </div>

      <div className="p-8 border-t border-[#e9e6df] bg-[#f4efe6] flex justify-end">
        <Button type="submit">Save Settings</Button>
      </div>
    </form>
  );
}
