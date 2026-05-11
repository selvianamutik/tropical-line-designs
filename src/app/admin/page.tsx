import Image from "next/image";
import Link from "next/link";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { EmptyState } from "@/components/admin/empty-state";
import { formatMonthYear } from "@/lib/admin/format";
import { getDashboardMetrics } from "@/lib/admin/repository";

const fallbackImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400";

export default async function AdminDashboard() {
  const metrics = await getDashboardMetrics();

  return (
    <AdminPageShell
      title="Studio Overview"
      description="Operational admin metrics and the latest portfolio activity, now sourced from the database."
    >
      <div className="grid grid-cols-2 gap-8 mb-16">
        <div className="bg-[#f4efe6] border-l-[3px] border-[#383532] px-8 py-8 flex flex-col justify-between h-[140px]">
          <h3 className="text-[10px] font-bold tracking-[0.15em] text-[#8a867f] uppercase">Total Projects</h3>
          <div className="flex items-end justify-between">
            <span className="font-display font-bold text-[40px] text-[#383532] leading-none">{metrics.totalProjects}</span>
            <span className="text-[11px] font-bold text-[#8a6839]">Portfolio entries</span>
          </div>
        </div>

        <div className="bg-[#f4efe6] border-l-[3px] border-[#a5a098] px-8 py-8 flex flex-col justify-between h-[140px]">
          <h3 className="text-[10px] font-bold tracking-[0.15em] text-[#8a867f] uppercase">Awards Won</h3>
          <div className="flex items-end justify-between">
            <span className="font-display font-bold text-[40px] text-[#383532] leading-none">{metrics.totalAwards}</span>
            <span className="text-[11px] font-medium text-[#8a867f]">{metrics.totalTeamMembers} team members</span>
          </div>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-8">
        <div className="rounded-sm border border-[#e9e6df] bg-white px-8 py-6 shadow-sm">
          <h3 className="text-[10px] font-bold tracking-[0.15em] text-[#8a867f] uppercase">Collaborators</h3>
          <p className="mt-3 font-display text-[34px] font-bold text-[#383532]">{metrics.totalCollaborators}</p>
        </div>
        <div className="rounded-sm border border-[#e9e6df] bg-white px-8 py-6 shadow-sm">
          <h3 className="text-[10px] font-bold tracking-[0.15em] text-[#8a867f] uppercase">Team Directory</h3>
          <p className="mt-3 font-display text-[34px] font-bold text-[#383532]">{metrics.totalTeamMembers}</p>
        </div>
      </div>

      <div className="flex items-end justify-between mb-6">
        <h3 className="font-sans font-bold text-[18px] text-[#383532]">Recent Projects</h3>
        <Link href="/admin/projects" className="text-[10px] font-bold tracking-widest text-[#a5a098] hover:text-[#383532] uppercase transition-colors">
          View All Projects
        </Link>
      </div>

      {metrics.recentProjects.length === 0 ? (
        <EmptyState
          title="No recent projects yet"
          description="Once you add records in Project Manager, the latest entries will appear here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {metrics.recentProjects.map((project) => (
            <div key={project.id} className="bg-white p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 object-cover grayscale overflow-hidden">
                  <Image
                    src={project.image_public_url || fallbackImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-sans font-bold text-[16px] text-[#383532] mb-1">{project.title}</h4>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold tracking-widest text-[#d9d4ca] uppercase mb-[2px]">Location</span>
                    <span className="text-[12px] text-[#6b6762]">{project.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-6 mr-4">
                <span className="px-2 py-1 bg-[#f4efe6] text-[9px] font-bold tracking-[0.1em] text-[#8a867f] uppercase rounded-sm">
                  {project.status}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold tracking-widest text-[#d9d4ca] uppercase mb-[2px]">Commenced</span>
                  <span className="text-[12px] font-medium text-[#6b6762]">{formatMonthYear(project.commenced_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}
