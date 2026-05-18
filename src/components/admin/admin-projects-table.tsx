"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { GripVertical, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { deletePortfolio, updatePortfolioDisplayOrder, upsertPortfolio } from "@/app/admin/actions";
import { DeleteResourceForm } from "@/components/admin/delete-resource-form";
import { ProjectGalleryDialog } from "@/components/admin/project-gallery-dialog";
import { ResourceFormDialog } from "@/components/admin/resource-form-dialog";
import { useAdminToast } from "@/components/admin/admin-toast";
import { Button } from "@/components/admin/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/Table";
import { ProjectOverlay } from "@/components/projects/project-overlay";
import { formatMonthYear, toMonthInputValue } from "@/lib/admin/format";
import type { PortfolioGalleryItemRecord, PortfolioRecord } from "@/lib/admin/types";
import type { PublicProjectRecord } from "@/lib/public/projects";

type AdminProjectsTableProps = {
  projects: PortfolioRecord[];
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

const projectTypeOptions = [
  { label: "Build", value: "Build" },
  { label: "Design", value: "Design" },
  { label: "Design and Build", value: "Design and Build" },
] as const;

function formatProjectYear(commencedAt: string | null) {
  if (!commencedAt) {
    return "Undated";
  }

  const date = new Date(commencedAt);
  if (Number.isNaN(date.getTime())) {
    return "Undated";
  }

  return String(date.getUTCFullYear());
}

function fallbackProjectImage(slug: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000">
      <rect width="1600" height="1000" fill="#e9dfd1"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#383532" font-family="Arial, sans-serif" font-size="52">
        ${slug}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function moveProject(items: PortfolioRecord[], fromId: string, toId: string) {
  const nextItems = [...items];
  const fromIndex = nextItems.findIndex((item) => item.id === fromId);
  const toIndex = nextItems.findIndex((item) => item.id === toId);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return items;
  }

  const [moved] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, moved);
  return nextItems;
}

export function AdminProjectsTable({ projects, portfolioGalleryItems }: AdminProjectsTableProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [orderedProjects, setOrderedProjects] = useState(projects);
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setOrderedProjects(projects);
  }, [projects]);

  const hasOrderChanges = orderedProjects.some((project, index) => project.id !== projects[index]?.id);

  const portfolioGalleryItemsByPortfolioId = useMemo(() => {
    const grouped = new Map<string, PortfolioGalleryItemRecord[]>();
    for (const item of portfolioGalleryItems) {
      const current = grouped.get(item.portfolio_id) ?? [];
      current.push(item);
      grouped.set(item.portfolio_id, current);
    }
    return grouped;
  }, [portfolioGalleryItems]);

  const overlayEntries = useMemo<PublicProjectRecord[]>(
    () =>
      orderedProjects.map((project) => {
        const coverImage = project.image_public_url || fallbackProjectImage(project.slug);
        const galleryImages = (portfolioGalleryItemsByPortfolioId.get(project.id) ?? []).map(
          (item) => item.media_asset_url,
        );

        return {
          slug: project.slug,
          title: project.title,
          location: project.location,
          year: formatProjectYear(project.commenced_at),
          type: project.category ?? "Landscape Project",
          image: coverImage,
          images: galleryImages.length > 0 ? galleryImages : [coverImage],
          galleryLayout: project.gallery_layout,
          status: project.status,
          architect: project.architect ?? undefined,
          landscapeConsultant: project.landscape_consultant ?? undefined,
          client: project.client ?? undefined,
          projectSize: project.project_size ?? undefined,
          description: project.description ?? undefined,
        };
      }),
    [portfolioGalleryItemsByPortfolioId, orderedProjects],
  );

  const selectedProject = selectedIndex !== null ? overlayEntries[selectedIndex] : null;

  const handleNext = () => {
    if (selectedIndex === null || overlayEntries.length === 0) return;
    setSelectedIndex((selectedIndex + 1) % overlayEntries.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null || overlayEntries.length === 0) return;
    setSelectedIndex((selectedIndex - 1 + overlayEntries.length) % overlayEntries.length);
  };

  const handleSaveProjectOrder = () => {
    const formData = new FormData();
    formData.set("ordered_project_ids", JSON.stringify(orderedProjects.map((project) => project.id)));

    startTransition(async () => {
      try {
        await updatePortfolioDisplayOrder(formData);
        showToast({
          tone: "success",
          title: "Urutan project berhasil disimpan.",
        });
        router.refresh();
      } catch (error) {
        showToast({
          tone: "error",
          title: "Gagal menyimpan urutan project.",
          description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan urutan project.",
        });
      }
    });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-sm border border-[#e9e6df] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a867f]">Project Order</p>
            <p className="mt-1 text-sm text-[#6b6762]">Drag baris project untuk mengubah urutan tampil di halaman publik.</p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!hasOrderChanges || isPending}
              onClick={() => setOrderedProjects(projects)}
            >
              Reset Order
            </Button>
            <Button
              type="button"
              disabled={!hasOrderChanges || isPending}
              onClick={handleSaveProjectOrder}
            >
              <Save className="mr-2 h-4 w-4" />
              {isPending ? "Saving..." : "Save Project Order"}
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[72px]">Move</TableHead>
              <TableHead>Project Title</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Commenced</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
        {orderedProjects.map((project, index) => {
          const overlayIndex = overlayEntries.findIndex((entry) => entry.slug === project.slug);

          return (
            <TableRow
              key={project.id}
              draggable
              onDragStart={() => setDraggedProjectId(project.id)}
              onDragEnd={() => setDraggedProjectId(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (!draggedProjectId || draggedProjectId === project.id) return;
                setOrderedProjects((current) => moveProject(current, draggedProjectId, project.id));
                setDraggedProjectId(null);
              }}
              className={overlayIndex >= 0 ? "cursor-pointer transition-colors hover:bg-[#f4efe6]" : undefined}
              onClick={overlayIndex >= 0 ? () => setSelectedIndex(overlayIndex) : undefined}
            >
              <TableCell>
                <div className="flex items-center gap-3 text-[#8a867f]">
                  <GripVertical className="h-4 w-4 cursor-grab" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-semibold">{project.title}</TableCell>
              <TableCell className="text-[#6b6762]">{index}</TableCell>
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
                      { name: "display_order", label: "Display Order", type: "number", min: 0, defaultValue: project.display_order ?? 0 },
                      { name: "client", label: "Client", defaultValue: project.client },
                      {
                        name: "category",
                        label: "Project Type",
                        type: "select",
                        defaultValue: project.category ?? "Design",
                        options: [...projectTypeOptions],
                      },
                      { name: "architect", label: "Architect", defaultValue: project.architect },
                      { name: "landscape_consultant", label: "Landscape Consultant", defaultValue: project.landscape_consultant },
                      { name: "project_size", label: "Project Size", defaultValue: project.project_size },
                      {
                        name: "gallery_layout",
                        label: "Gallery Layout",
                        type: "select",
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
          </TableBody>
        </Table>
      </div>

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
