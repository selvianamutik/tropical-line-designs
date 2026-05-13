"use client";

import { useRouter } from "next/navigation";
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
};

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
      </div>

      <div className="p-8 border-t border-[#e9e6df] bg-[#f4efe6] flex justify-end">
        <Button type="submit">Save Settings</Button>
      </div>
    </form>
  );
}
