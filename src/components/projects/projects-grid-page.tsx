"use client";

import { useState } from "react";
import type { PublicProjectRecord } from "@/lib/public/projects";
import { ProjectOverlay } from "./project-overlay";

type ProjectsGridPageProps = {
  projects: PublicProjectRecord[];
};

type ProjectHoverCardProps = {
  title: string;
  location: string;
  projectSize?: string;
  onClick?: () => void;
};

function ProjectHoverCard({
  title,
  location,
  projectSize,
  onClick,
}: ProjectHoverCardProps) {
  return (
    <div 
      onClick={onClick}
      className="absolute left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-[#dedede] p-5 text-black opacity-0 shadow-[0_16px_45px_rgba(0,0,0,0.18)] transition-all duration-300 group-hover:opacity-100 cursor-pointer"
    >
      <button className="rounded-[2px] border border-black/55 bg-[#f7f7f7] px-3 py-1 text-[12px] uppercase leading-none">
        {title}
      </button>

      <div className="mt-[58px] flex items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-bold leading-none">Location</p>
          <p className="mt-1 text-[11px] leading-none">{location}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold leading-none">Project Size</p>
          <p className="mt-1 text-[11px] leading-none">{projectSize ?? "-"}</p>
        </div>
      </div>
    </div>
  );
}

function ProjectGridCard({ project, onClick }: { project: PublicProjectRecord; onClick: () => void }) {
  return (
    <article className="group relative h-[150px] overflow-hidden rounded-[3px] bg-[#ddd]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-[1.04]"
        style={{ backgroundImage: `url("${project.image}")` }}
      />
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

      <ProjectHoverCard
        title={project.title}
        location={project.location}
        projectSize={project.projectSize}
        onClick={onClick}
      />
    </article>
  );
}

export function ProjectsGridPage({ projects }: ProjectsGridPageProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % projects.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + projects.length) % projects.length);
  };

  return (
    <section className="bg-[#f8f3ea] px-6 pb-[104px] pt-8 text-[#151515] sm:px-10 md:px-16 lg:px-[98px]">
      <div className="mx-auto max-w-[1084px]">
        <h1 className="mb-9 text-[22px] font-bold tracking-[-0.03em] text-black">
          Project
        </h1>

        <div className="grid grid-cols-1 gap-x-7 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, index) => (
            <ProjectGridCard 
              key={project.slug} 
              project={project} 
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <ProjectOverlay 
          project={projects[selectedIndex]}
          isOpen={selectedIndex !== null}
          onClose={() => setSelectedIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </section>
  );
}
