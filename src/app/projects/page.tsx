import { SiteNav } from "@/components/global/site-nav";
import { ProjectsSimpleFooter } from "@/components/global/site-nav";
import { ProjectsGridPage } from "@/components/projects/projects-grid-page";
import { listPublicProjects } from "@/lib/public/projects";


export default async function ProjectsPage() {
  const projects = await listPublicProjects();

  return (
    <main className="min-h-screen bg-[#f8f3ea] text-slate-950">
      <SiteNav
        className="sticky inset-x-0 top-0 z-30"
      />
      <ProjectsGridPage projects={projects} />
      <ProjectsSimpleFooter />
    </main>
  );
}
