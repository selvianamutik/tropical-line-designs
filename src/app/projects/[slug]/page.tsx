import { notFound } from "next/navigation";
import { SiteNav } from "@/components/global/site-nav";
import { ProjectsSimpleFooter } from "@/components/global/projects-simple-footer";
import { ProjectsGridPage } from "@/components/projects/projects-grid-page";
import { listPublicProjects } from "@/lib/public/projects";

export const dynamic = "force-dynamic";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const projects = await listPublicProjects();
  const projectExists = projects.some((project) => project.slug === slug);

  if (!projectExists) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] text-slate-950">
      <SiteNav
        className="sticky inset-x-0 top-0 z-30"
      />
      <ProjectsGridPage projects={projects} selectedProjectSlug={slug} />
      <ProjectsSimpleFooter />
    </main>
  );
}
