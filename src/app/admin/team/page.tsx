import { upsertTeamMember } from "@/app/admin/actions";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { ResourceFormDialog } from "@/components/admin/resource-form-dialog";
import { TeamDirectoryTable } from "@/components/admin/team-directory-table";
import { listTeamMembers } from "@/lib/admin/repository";

export default async function TeamDirectoryPage() {
  const members = await listTeamMembers();

  return (
    <AdminPageShell
      title="Team Directory"
      description="Manage studio members, roles, and contact information directly from Supabase."
      actions={
        <ResourceFormDialog
          title="Add Team Member"
          description="Add a new member to the studio directory."
          submitLabel="Add Member"
          triggerLabel="Add Member"
          action={upsertTeamMember}
          fields={[
            { name: "name", label: "Full Name", required: true, placeholder: "e.g. John Doe" },
            { name: "email", label: "Email Address", type: "email", required: true, placeholder: "e.g. john@tld.com" },
            { name: "role", label: "Role", required: true, placeholder: "e.g. Junior Architect" },
            {
              name: "image_file",
              label: "Profile Photo",
              type: "file",
              accept: "image/jpeg,image/png,image/webp,image/avif",
              helpText: "Upload a JPG, PNG, WebP, or AVIF image up to 10MB. File will be converted to WebP automatically.",
            },
            { 
              name: "status", 
              label: "Status", 
              type: "select", 
              required: true, 
              defaultValue: "Active",
              options: [
                { label: "Active", value: "Active" },
                { label: "On Leave", value: "On Leave" },
                { label: "Inactive", value: "Inactive" },
              ]
            },
          ]}
        />
      }
    >
      <TeamDirectoryTable members={members} />
    </AdminPageShell>
  );
}
