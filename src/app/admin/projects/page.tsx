import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { EmptyState } from "@/components/admin/empty-state";
import { AdminProjectsTable } from "@/components/admin/admin-projects-table";
import { ResourceFormDialog } from "@/components/admin/resource-form-dialog";
import { upsertPortfolio } from "@/app/admin/actions";
import { listPortfolioGalleryItems, listPortfolios } from "@/lib/admin/repository";

export default async function ProjectManagerPage() {
  const [projects, portfolioGalleryItems] = await Promise.all([
    listPortfolios(),
    listPortfolioGalleryItems(),
  ]);

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
            { name: "display_order", label: "Display Order", type: "number", defaultValue: 0, min: 0 },
            { name: "client", label: "Client", placeholder: "e.g. Private Client" },
            {
              name: "category",
              label: "Project Type",
              type: "select",
              defaultValue: "Design",
              options: [
                { label: "Build", value: "Build" },
                { label: "Design", value: "Design" },
                { label: "Design and Build", value: "Design and Build" },
              ],
            },
            { name: "architect", label: "Architect", placeholder: "e.g. Han Awal & Partners" },
            { name: "landscape_consultant", label: "Landscape Consultant", placeholder: "e.g. Bensley Design Studio" },
            { name: "project_size", label: "Project Size", placeholder: "e.g. 2.1 ha" },
            {
              name: "gallery_layout",
              label: "Gallery Layout",
              type: "select",
              required: true,
              defaultValue: "D",
              options: [
                { label: "Layout A", value: "A" },
                { label: "Layout B", value: "B" },
                { label: "Layout C", value: "C" },
                { label: "Layout D", value: "D" },
                { label: "Layout E", value: "E" },
                { label: "Layout F", value: "F" },
                { label: "Layout G", value: "G" },
                { label: "Layout H", value: "H" },
                { label: "Layout I", value: "I" },
                { label: "Layout J", value: "J" },
              ],
            },
            {
              name: "image_file",
              label: "Cover Image",
              type: "file",
              accept: "image/jpeg,image/png,image/webp,image/avif",
              helpText: "Upload a JPG, PNG, WebP, or AVIF image up to 10MB. File will be converted to WebP automatically.",
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
        <AdminProjectsTable projects={projects} portfolioGalleryItems={portfolioGalleryItems} />
      )}
    </AdminPageShell>
  );
}
