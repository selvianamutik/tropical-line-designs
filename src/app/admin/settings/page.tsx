import { updateSiteSettings } from "@/app/admin/actions";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { getSiteSettings } from "@/lib/admin/repository";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <AdminPageShell
      title="Studio Settings"
      description="Manage studio profile, contact information, and global site preferences from the database."
    >
      <AdminSettingsForm
        action={updateSiteSettings}
        values={{
          studio_name: settings?.studio_name ?? "Tropical Line Design",
          contact_email: settings?.contact_email ?? "hello@tropical-line.com",
          phone_number: settings?.phone_number ?? "+62 812 3456 7890",
          office_address:
            settings?.office_address ?? "Jl. Raya Seminyak No. 123, Kuta, Badung, Bali 80361, Indonesia",
          instagram_handle: settings?.instagram_handle ?? "",
          linkedin_url: settings?.linkedin_url ?? "",
        }}
      />
    </AdminPageShell>
  );
}
