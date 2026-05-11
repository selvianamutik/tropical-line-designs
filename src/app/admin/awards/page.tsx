import { Trophy } from "lucide-react";
import { deleteAward, upsertAward } from "@/app/admin/actions";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { DeleteResourceForm } from "@/components/admin/delete-resource-form";
import { EmptyState } from "@/components/admin/empty-state";
import { ResourceFormDialog } from "@/components/admin/resource-form-dialog";
import { TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/Table";
import { PaginatedTable } from "@/components/admin/paginated-table";
import { listAwards } from "@/lib/admin/repository";

export default async function AwardsPage() {
  const awards = await listAwards();

  return (
    <AdminPageShell
      title="Awards & Recognition"
      description="Curate the studio's achievements and keep the recognition list maintained from the admin panel."
      actions={
        <ResourceFormDialog
          title="Add Award"
          description="Record a new achievement or publication."
          submitLabel="Add Award"
          triggerLabel="Add Award"
          action={upsertAward}
          fields={[
            { name: "title", label: "Award Title", required: true, placeholder: "e.g. Best Hospitality Design" },
            { name: "organization", label: "Issuing Organization", required: true, placeholder: "e.g. Asia Pacific Property Awards" },
            { name: "award_year", label: "Year", type: "number", required: true, min: 1900, max: 2099, placeholder: "2024" },
            { name: "related_project", label: "Related Project", placeholder: "e.g. Oasis Villa" },
            {
              name: "image_file",
              label: "Award Image",
              type: "file",
              accept: "image/jpeg,image/png,image/webp,image/avif",
              helpText: "Upload a JPG, PNG, WebP, or AVIF image up to 10MB. File will be converted to WebP automatically.",
            },
          ]}
        />
      }
    >
      {awards.length === 0 ? (
        <EmptyState
          title="No awards recorded"
          description="Add the first award entry to populate this module from the database."
        />
      ) : (
        <PaginatedTable
          headers={
            <TableHeader>
              <TableRow>
                <TableHead>Award Title</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Related Project</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
          }
        >
            {awards.map((award) => (
              <TableRow key={award.id}>
                <TableCell className="font-semibold flex items-center gap-3">
                  <Trophy className="w-4 h-4 text-[#d97706]" />
                  {award.title}
                </TableCell>
                <TableCell className="text-[#6b6762]">{award.organization}</TableCell>
                <TableCell className="text-[#6b6762] font-medium">{award.award_year}</TableCell>
                <TableCell className="text-[#6b6762]">{award.related_project ?? "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <ResourceFormDialog
                      title="Edit Award"
                      description="Update the award entry."
                      submitLabel="Save Changes"
                      action={upsertAward}
                      initialId={award.id}
                      fields={[
                        { name: "title", label: "Award Title", required: true, defaultValue: award.title },
                        { name: "organization", label: "Issuing Organization", required: true, defaultValue: award.organization },
                        { name: "award_year", label: "Year", type: "number", required: true, min: 1900, max: 2099, defaultValue: award.award_year },
                        { name: "related_project", label: "Related Project", defaultValue: award.related_project },
                        {
                          name: "image_file",
                          label: "Award Image",
                          type: "file",
                          accept: "image/jpeg,image/png,image/webp,image/avif",
                          helpText: award.image_public_url
                            ? `Leave empty to keep the current image. New uploads will be converted to WebP automatically. Current: ${award.image_public_url}`
                            : "Leave empty if you do not want to add an image yet. New uploads will be converted to WebP automatically.",
                        },
                      ]}
                    />
                    <DeleteResourceForm id={award.id} label={`Delete ${award.title}`} action={deleteAward} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </PaginatedTable>
      )}
    </AdminPageShell>
  );
}
