import { deleteTeamMember, upsertTeamMember } from "@/app/admin/actions";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { DeleteResourceForm } from "@/components/admin/delete-resource-form";
import { EmptyState } from "@/components/admin/empty-state";
import { ResourceFormDialog } from "@/components/admin/resource-form-dialog";
import { TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/Table";
import { PaginatedTable } from "@/components/admin/paginated-table";
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
      {members.length === 0 ? (
        <EmptyState
          title="No team members found"
          description="Add your first studio member so the admin directory starts reflecting live data."
        />
      ) : (
        <PaginatedTable
          headers={
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
          }
        >
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-semibold">{member.name}</TableCell>
                <TableCell className="text-[#6b6762]">{member.role}</TableCell>
                <TableCell className="text-[#6b6762]">{member.email}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-[#f4efe6] text-[9px] font-bold tracking-[0.1em] text-[#8a867f] uppercase rounded-sm">
                    {member.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <ResourceFormDialog
                      title="Edit Team Member"
                      description="Update the member record."
                      submitLabel="Save Changes"
                      action={upsertTeamMember}
                      initialId={member.id}
                      fields={[
                        { name: "name", label: "Full Name", required: true, defaultValue: member.name },
                        { name: "email", label: "Email Address", type: "email", required: true, defaultValue: member.email },
                        { name: "role", label: "Role", required: true, defaultValue: member.role },
                        { 
                          name: "status", 
                          label: "Status", 
                          type: "select", 
                          required: true, 
                          defaultValue: member.status,
                          options: [
                            { label: "Active", value: "Active" },
                            { label: "On Leave", value: "On Leave" },
                            { label: "Inactive", value: "Inactive" },
                          ]
                        },
                      ]}
                    />
                    <DeleteResourceForm id={member.id} label={`Delete ${member.name}`} action={deleteTeamMember} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </PaginatedTable>
      )}
    </AdminPageShell>
  );
}
