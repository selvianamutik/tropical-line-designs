import { upsertService } from "@/app/admin/actions";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminServicesTable } from "@/components/admin/admin-services-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ResourceFormDialog } from "@/components/admin/resource-form-dialog";
import { listServices } from "@/lib/admin/repository";

const statusOptions = [
  { label: "Active", value: "true" },
  { label: "Hidden", value: "false" },
] as const;

export default async function ServicesPage() {
  const services = await listServices();

  return (
    <AdminPageShell
      title="Services"
      description="Manage services shown on the About section."
      actions={
        <ResourceFormDialog
          title="Add Service"
          description="Create a service entry for the public About page."
          submitLabel="Add Service"
          triggerLabel="Add Service"
          action={upsertService}
          fields={[
            { name: "title", label: "Service Title", required: true, placeholder: "e.g. Landscape Design" },
            { name: "description", label: "Description", type: "textarea", maxLength: 1200, placeholder: "Short service description..." },
            {
              name: "image_1_file",
              label: "Image 1",
              type: "file",
              required: true,
              accept: "image/jpeg,image/png,image/webp",
              helpText: "Upload service image 1.",
            },
            {
              name: "image_2_file",
              label: "Image 2",
              type: "file",
              accept: "image/jpeg,image/png,image/webp",
              helpText: "Upload service image 2.",
            },
            {
              name: "is_active",
              label: "Visibility",
              type: "select",
              required: true,
              defaultValue: "true",
              options: [...statusOptions],
            },
          ]}
        />
      }
    >
      {services.length === 0 ? (
        <EmptyState
          title="No services found"
          description="Add services to populate the public About services page."
        />
      ) : (
        <AdminServicesTable services={services} />
      )}
    </AdminPageShell>
  );
}
