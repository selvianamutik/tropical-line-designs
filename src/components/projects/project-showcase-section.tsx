import Link from "next/link";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectSectionHeader } from "@/components/projects/project-section-header";
import { listPublicProjects } from "@/lib/public/projects";

export async function ProjectShowcaseSection() {
  const projects = await listPublicProjects();

  return (
    <section
      id="projects"
      className="bg-[#fdf9f1] px-5 py-14 text-slate-950 sm:px-6 sm:py-16 md:px-8 lg:px-10 lg:py-20 xl:px-12"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10">
        <ProjectSectionHeader
          eyebrow="Selected Works"
          title="Project Page"
          description="A modular project showcase built to carry the same editorial landscape language as the landing hero. Each block is separated into reusable components so future project pages can keep the same rhythm, navigation, and footer structure."
        />
        
        <div className="grid gap-8">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard
              key={project.slug}
              title={project.title}
              location={project.location}
              year={project.year}
              type={project.type}
              image={project.image}
            />
          ))}
        </div>

        <div className="flex justify-end ">
          <Link
            href="/projects"
            className="inline-flex items-center border-b border-black pb-1 text-[11px] uppercase tracking-[0.18em] text-slate-900"
          >
            Open full project page
          </Link>
        </div>
      </div>
    </section>
  );
}
