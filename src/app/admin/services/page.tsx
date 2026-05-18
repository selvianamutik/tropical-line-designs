import { upsertService, deleteService } from "@/app/admin/actions";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { DeleteResourceForm } from "@/components/admin/delete-resource-form";
import { EmptyState } from "@/components/admin/empty-state";
import { PaginatedTable } from "@/components/admin/paginated-table";
import { ResourceFormDialog } from "@/components/admin/resource-form-dialog";
import { TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/Table";
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
            { name: "description", label: "Description", type: "textarea", placeholder: "Short service description..." },
            { name: "sort_order", label: "Sort Order", type: "number", defaultValue: 0, min: 0 },
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
        <PaginatedTable
          headers={
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
          }
        >
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                <p className="font-semibold">{service.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-[#6b6762]">{service.description ?? "-"}</p>
              </TableCell>
              <TableCell className="text-[#6b6762]">{service.sort_order}</TableCell>
              <TableCell>
                <span className="rounded-sm bg-[#f4efe6] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a867f]">
                  {service.is_active ? "Active" : "Hidden"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <ResourceFormDialog
                    title="Edit Service"
                    description="Update the service entry."
                    submitLabel="Save Changes"
                    action={upsertService}
                    initialId={service.id}
                    fields={[
                      { name: "title", label: "Service Title", required: true, defaultValue: service.title },
                      { name: "description", label: "Description", type: "textarea", defaultValue: service.description },
                      { name: "sort_order", label: "Sort Order", type: "number", min: 0, defaultValue: service.sort_order },
                      {
                        name: "is_active",
                        label: "Visibility",
                        type: "select",
                        required: true,
                        defaultValue: service.is_active ? "true" : "false",
                        options: [...statusOptions],
                      },
                    ]}
                  />
                  <DeleteResourceForm id={service.id} label={`Delete ${service.title}`} action={deleteService} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </PaginatedTable>
      )}
    </AdminPageShell>
  );
}
