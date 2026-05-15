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
      className="absolute inset-0 z-10 cursor-pointer bg-[linear-gradient(180deg,rgba(249,245,238,0.42)_0%,rgba(244,238,228,0.86)_38%,rgba(236,229,218,0.97)_100%)] p-4 text-[#2e2924] opacity-0 shadow-[0_20px_45px_rgba(29,23,16,0.16)] backdrop-blur-[2px] transition-all duration-500 ease-out group-hover:opacity-100 sm:p-5"
    >
      <div className="flex h-full flex-col justify-between">
        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-[0.18em] text-[#8b7e6d]">
            View Project
          </p>
          <h3 className="mt-2 max-w-[16ch] text-[13px] font-semibold leading-5 tracking-[-0.01em] text-[#201c18] sm:text-[14px]">
            {title}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[#d8cdbd] pt-3">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.16em] text-[#8b7e6d]">Location</p>
            <p className="mt-1 truncate text-[11px] leading-5 text-[#3c342c]">{location}</p>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.16em] text-[#8b7e6d]">Project Size</p>
            <p className="mt-1 truncate text-[11px] leading-5 text-[#3c342c]">{projectSize ?? "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectGridCard({ project, onClick }: { project: PublicProjectRecord; onClick: () => void }) {
  return (
    <article className="group relative h-[150px] overflow-hidden rounded-[3px] bg-[#ddd]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        style={{ backgroundImage: `url("${project.image}")` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.08)_100%)] transition-colors duration-500 group-hover:bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.22)_100%)]" />

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
