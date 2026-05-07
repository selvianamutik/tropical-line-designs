import { SiteNav } from "@/components/global/site-nav";
import { ProjectsSimpleFooter } from "@/components/global/site-nav";
import { ProjectsGridPage } from "@/components/projects/projects-grid-page";
import { projects } from "@/data/projects";


export default function ProjectsPage() {
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
