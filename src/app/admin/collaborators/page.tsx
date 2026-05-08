import { deleteCollaborator, upsertCollaborator } from "@/app/admin/actions";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { DeleteResourceForm } from "@/components/admin/delete-resource-form";
import { EmptyState } from "@/components/admin/empty-state";
import { ResourceFormDialog } from "@/components/admin/resource-form-dialog";
import { TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/Table";
import { PaginatedTable } from "@/components/admin/paginated-table";
import { listCollaborators } from "@/lib/admin/repository";

export default async function CollaboratorsPage() {
  const collaborators = await listCollaborators();

  return (
    <AdminPageShell
      title="Collaborator Network"
      description="Manage your network of consultants, contractors, and trusted partners in one live database."
      actions={
        <ResourceFormDialog
          title="Add Collaborator"
          description="Register a new external partner or consultant."
          submitLabel="Add Collaborator"
          triggerLabel="Add Collaborator"
          action={upsertCollaborator}
          fields={[
            { name: "company", label: "Company Name", required: true, placeholder: "e.g. Lumina Lighting" },
            { name: "expertise_type", label: "Expertise / Type", required: true, placeholder: "e.g. Lighting Consultant" },
            { name: "contact_email", label: "Contact Email", type: "email", required: true, placeholder: "e.g. contact@lumina.co.id" },
            { name: "joint_projects", label: "Joint Projects", type: "number", defaultValue: 0, min: 0 },
            {
              name: "image_file",
              label: "Collaborator Image",
              type: "file",
              accept: "image/jpeg,image/png,image/webp,image/avif",
              helpText: "Upload a JPG, PNG, WebP, or AVIF image up to 10MB.",
            },
          ]}
        />
      }
    >
      {collaborators.length === 0 ? (
        <EmptyState
          title="No collaborators found"
          description="Start building the external network directory from this admin module."
        />
      ) : (
        <PaginatedTable
          headers={
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Expertise Type</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Joint Projects</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
          }
        >
            {collaborators.map((collaborator) => (
              <TableRow key={collaborator.id}>
                <TableCell className="font-semibold">{collaborator.company}</TableCell>
                <TableCell className="text-[#6b6762]">{collaborator.expertise_type}</TableCell>
                <TableCell className="text-[#6b6762]">{collaborator.contact_email}</TableCell>
                <TableCell className="text-[#6b6762]">{collaborator.joint_projects} projects</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <ResourceFormDialog
                      title="Edit Collaborator"
                      description="Update the collaborator profile."
                      submitLabel="Save Changes"
                      action={upsertCollaborator}
                      initialId={collaborator.id}
                      fields={[
                        { name: "company", label: "Company Name", required: true, defaultValue: collaborator.company },
                        { name: "expertise_type", label: "Expertise / Type", required: true, defaultValue: collaborator.expertise_type },
                        { name: "contact_email", label: "Contact Email", type: "email", required: true, defaultValue: collaborator.contact_email },
                        { name: "joint_projects", label: "Joint Projects", type: "number", min: 0, defaultValue: collaborator.joint_projects },
                        {
                          name: "image_file",
                          label: "Collaborator Image",
                          type: "file",
                          accept: "image/jpeg,image/png,image/webp,image/avif",
                          helpText: collaborator.image_url
                            ? `Leave empty to keep the current image. Current: ${collaborator.image_url}`
                            : "Leave empty if you do not want to add an image yet.",
                        },
                      ]}
                    />
                    <DeleteResourceForm id={collaborator.id} label={`Delete ${collaborator.company}`} action={deleteCollaborator} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </PaginatedTable>
      )}
    </AdminPageShell>
  );
}
