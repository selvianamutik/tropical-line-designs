"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { deleteTeamMember, upsertTeamMember } from "@/app/admin/actions";
import { DeleteResourceForm } from "@/components/admin/delete-resource-form";
import { EmptyState } from "@/components/admin/empty-state";
import { PaginatedTable } from "@/components/admin/paginated-table";
import { ResourceFormDialog } from "@/components/admin/resource-form-dialog";
import { TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/Table";
import type { TeamMemberRecord } from "@/lib/admin/types";

export function TeamDirectoryTable({ members }: { members: TeamMemberRecord[] }) {
  const [query, setQuery] = useState("");

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return members;
    }

    return members.filter((member) =>
      [member.name, member.role, member.email, member.status].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [members, query]);

  if (members.length === 0) {
    return (
      <EmptyState
        title="No team members found"
        description="Add your first studio member so the admin directory starts reflecting live data."
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-sm border border-[#e9e6df] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a867f]">Directory Search</p>
          <p className="mt-1 text-sm text-[#8a867f]">Cari berdasarkan nama, role, email, atau status member.</p>
        </div>
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a5a098]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search team member..."
            className="h-11 w-full rounded-sm border border-[#d9d4ca] bg-transparent pl-10 pr-4 text-sm text-[#383532] outline-none transition-colors placeholder:text-[#a5a098] focus:border-[#d97706]"
          />
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <EmptyState
          title="No matching team members"
          description="Coba kata kunci lain untuk menemukan member yang dicari."
        />
      ) : (
        <PaginatedTable
          key={query}
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
          {filteredMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-semibold">{member.name}</TableCell>
              <TableCell className="text-[#6b6762]">{member.role}</TableCell>
              <TableCell className="text-[#6b6762]">{member.email}</TableCell>
              <TableCell>
                <span className="rounded-sm bg-[#f4efe6] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a867f]">
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
                        name: "image_file",
                        label: "Profile Photo",
                        type: "file",
                        accept: "image/jpeg,image/png,image/webp,image/avif",
                        currentMediaUrl: member.image_public_url,
                        helpText: member.image_public_url
                          ? "Leave empty to keep the current photo. New uploads will be converted to WebP automatically."
                          : "Leave empty if you do not want to add a photo yet. New uploads will be converted to WebP automatically.",
                      },
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
                        ],
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
    </div>
  );
}
