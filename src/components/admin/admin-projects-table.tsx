"use client";

import { useMemo, useState } from "react";
import { deletePortfolio, upsertPortfolio } from "@/app/admin/actions";
import { DeleteResourceForm } from "@/components/admin/delete-resource-form";
import { PaginatedTable } from "@/components/admin/paginated-table";
import { ProjectGalleryDialog } from "@/components/admin/project-gallery-dialog";
import { ResourceFormDialog } from "@/components/admin/resource-form-dialog";
import { TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/Table";
import { ProjectOverlay } from "@/components/projects/project-overlay";
import { formatMonthYear, toMonthInputValue } from "@/lib/admin/format";
import type { PortfolioGalleryItemRecord, PortfolioRecord } from "@/lib/admin/types";
import type { PublicProjectRecord } from "@/lib/public/projects";

type AdminProjectsTableProps = {
  projects: PortfolioRecord[];
  overlayProjects: PublicProjectRecord[];
  portfolioGalleryItems: PortfolioGalleryItemRecord[];
};

const galleryLayoutOptions = [
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
] as const;

const statusOptions = [
  { label: "Planning", value: "Planning" },
  { label: "Design", value: "Design" },
  { label: "Construction", value: "Construction" },
  { label: "Completed", value: "Completed" },
  { label: "On Hold", value: "On Hold" },
] as const;

export function AdminProjectsTable({ projects, overlayProjects, portfolioGalleryItems }: AdminProjectsTableProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const overlayEntries = useMemo(() => {
    const projectBySlug = new Map(overlayProjects.map((project) => [project.slug, project]));
    return projects
      .map((project) => projectBySlug.get(project.slug))
      .filter((project): project is PublicProjectRecord => Boolean(project));
  }, [overlayProjects, projects]);

  const portfolioGalleryItemsByPortfolioId = useMemo(() => {
    const grouped = new Map<string, PortfolioGalleryItemRecord[]>();
    for (const item of portfolioGalleryItems) {
      const current = grouped.get(item.portfolio_id) ?? [];
      current.push(item);
      grouped.set(item.portfolio_id, current);
    }
    return grouped;
  }, [portfolioGalleryItems]);

  const selectedProject = selectedIndex !== null ? overlayEntries[selectedIndex] : null;

  const handleNext = () => {
    if (selectedIndex === null || overlayEntries.length === 0) return;
    setSelectedIndex((selectedIndex + 1) % overlayEntries.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null || overlayEntries.length === 0) return;
    setSelectedIndex((selectedIndex - 1 + overlayEntries.length) % overlayEntries.length);
  };

  return (
    <>
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
        {projects.map((project) => {
          const overlayIndex = overlayEntries.findIndex((entry) => entry.slug === project.slug);

          return (
            <TableRow
              key={project.id}
              className={overlayIndex >= 0 ? "cursor-pointer transition-colors hover:bg-[#f4efe6]" : undefined}
              onClick={overlayIndex >= 0 ? () => setSelectedIndex(overlayIndex) : undefined}
            >
              <TableCell className="font-semibold">{project.title}</TableCell>
              <TableCell className="text-[#6b6762]">{project.location}</TableCell>
              <TableCell>
                <span className="rounded-sm bg-[#f4efe6] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a867f]">
                  {project.status}
                </span>
              </TableCell>
              <TableCell className="text-[#6b6762]">{formatMonthYear(project.commenced_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                  <ProjectGalleryDialog
                    project={project}
                    portfolioGalleryItems={portfolioGalleryItemsByPortfolioId.get(project.id) ?? []}
                  />
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
                        options: [...statusOptions],
                      },
                      { name: "commenced_at", label: "Commenced Date", type: "month", defaultValue: toMonthInputValue(project.commenced_at) },
                      { name: "client", label: "Client", defaultValue: project.client },
                      { name: "category", label: "Category", defaultValue: project.category },
                      { name: "architect", label: "Architect", defaultValue: project.architect },
                      { name: "landscape_consultant", label: "Landscape Consultant", defaultValue: project.landscape_consultant },
                      { name: "project_size", label: "Project Size", defaultValue: project.project_size },
                      {
                        name: "gallery_layout",
                        label: "Gallery Layout",
                        type: "select",
                        previewKind: "gallery-layout",
                        required: true,
                        defaultValue: project.gallery_layout,
                        options: [...galleryLayoutOptions],
                      },
                      {
                        name: "image_file",
                        label: "Cover Image",
                        type: "file",
                        accept: "image/jpeg,image/png,image/webp,image/avif",
                        currentMediaUrl: project.image_public_url,
                        helpText: project.image_public_url
                          ? "Leave empty to keep the current image. New uploads will be converted to WebP automatically."
                          : "Leave empty if you do not want to add an image yet. New uploads will be converted to WebP automatically.",
                      },
                      { name: "description", label: "Description", type: "textarea", defaultValue: project.description },
                    ]}
                  />
                  <DeleteResourceForm id={project.id} label={`Delete ${project.title}`} action={deletePortfolio} />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </PaginatedTable>

      {selectedProject ? (
        <ProjectOverlay
          project={selectedProject}
          isOpen={selectedIndex !== null}
          onClose={() => setSelectedIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
          showImageOrderLabels
        />
      ) : null}
    </>
  );
}
