import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { DeleteResourceForm } from "@/components/admin/delete-resource-form";
import { EmptyState } from "@/components/admin/empty-state";
import { ResourceFormDialog } from "@/components/admin/resource-form-dialog";
import { TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/Table";
import { PaginatedTable } from "@/components/admin/paginated-table";
import { deletePortfolio, upsertPortfolio } from "@/app/admin/actions";
import { formatMonthYear, toMonthInputValue } from "@/lib/admin/format";
import { listPortfolios } from "@/lib/admin/repository";

export default async function ProjectManagerPage() {
  const projects = await listPortfolios();

  return (
    <AdminPageShell
      title="Project Manager"
      description="Manage your portfolio, update ongoing projects, and keep the admin catalog synced with the database."
      actions={
        <ResourceFormDialog
          title="Create New Project"
          description="Enter the initial details for the new project."
          submitLabel="Create Project"
          triggerLabel="New Project"
          action={upsertPortfolio}
          fields={[
            { name: "title", label: "Project Title", required: true, placeholder: "e.g. Rumah Kawung Pavilion" },
            { name: "location", label: "Location", required: true, placeholder: "e.g. Ubud, Bali" },
            { 
              name: "status", 
              label: "Status", 
              type: "select", 
              required: true, 
              defaultValue: "Planning",
              options: [
                { label: "Planning", value: "Planning" },
                { label: "Design", value: "Design" },
                { label: "Construction", value: "Construction" },
                { label: "Completed", value: "Completed" },
                { label: "On Hold", value: "On Hold" },
              ]
            },
            { name: "commenced_at", label: "Commenced Date", type: "month" },
            { name: "client", label: "Client", placeholder: "e.g. Private Client" },
            { name: "category", label: "Category", placeholder: "e.g. Hospitality" },
            {
              name: "image_file",
              label: "Cover Image",
              type: "file",
              accept: "image/jpeg,image/png,image/webp,image/avif",
              helpText: "Upload a JPG, PNG, WebP, or AVIF image up to 10MB.",
            },
            { name: "description", label: "Description", type: "textarea", placeholder: "Project summary..." },
          ]}
        />
      }
    >
      {projects.length === 0 ? (
        <EmptyState
          title="No projects in the database yet"
          description="Run the SQL schema, then start adding portfolio entries from this admin page."
        />
      ) : (
        <PaginatedTable
          headers={
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Commenced</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
          }
        >
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-semibold">{project.title}</TableCell>
                <TableCell className="text-[#6b6762]">{project.location}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-[#f4efe6] text-[9px] font-bold tracking-[0.1em] text-[#8a867f] uppercase rounded-sm">
                    {project.status}
                  </span>
                </TableCell>
                <TableCell className="text-[#6b6762]">{formatMonthYear(project.commenced_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <ResourceFormDialog
                      title="Edit Project"
                      description="Update the portfolio entry."
                      submitLabel="Save Changes"
                      action={upsertPortfolio}
                      initialId={project.id}
                      fields={[
                        { name: "title", label: "Project Title", required: true, defaultValue: project.title },
                        { name: "location", label: "Location", required: true, defaultValue: project.location },
                        { 
                          name: "status", 
                          label: "Status", 
                          type: "select", 
                          required: true, 
                          defaultValue: project.status,
                          options: [
                            { label: "Planning", value: "Planning" },
                            { label: "Design", value: "Design" },
                            { label: "Construction", value: "Construction" },
                            { label: "Completed", value: "Completed" },
                            { label: "On Hold", value: "On Hold" },
                          ]
                        },
                        { name: "commenced_at", label: "Commenced Date", type: "month", defaultValue: toMonthInputValue(project.commenced_at) },
                        { name: "client", label: "Client", defaultValue: project.client },
                        { name: "category", label: "Category", defaultValue: project.category },
                        {
                          name: "image_file",
                          label: "Cover Image",
                          type: "file",
                          accept: "image/jpeg,image/png,image/webp,image/avif",
                          helpText: project.image_url
                            ? `Leave empty to keep the current image. Current: ${project.image_url}`
                            : "Leave empty if you do not want to add an image yet.",
                        },
                        { name: "description", label: "Description", type: "textarea", defaultValue: project.description },
                      ]}
                    />
                    <DeleteResourceForm id={project.id} label={`Delete ${project.title}`} action={deletePortfolio} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </PaginatedTable>
      )}
    </AdminPageShell>
  );
}
