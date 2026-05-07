import Link from "next/link";
import type { ProjectRecord } from "@/data/projects";

type ProjectsPageListProps = {
  projects: ProjectRecord[];
};

export function ProjectsPageList({ projects }: ProjectsPageListProps) {
  return (
    <section
      id="projects-list"
      className="bg-[#fdf9f1] px-5 py-10 text-slate-950 sm:px-6 sm:py-12 md:px-8 lg:px-10 lg:py-16 xl:px-12"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12">
        {projects.map((project, index) => (
          <article
            key={project.slug}
            className="grid gap-8 border-b border-black/10 pb-12 lg:grid-cols-[180px_minmax(0,1fr)]"
          >
            <div className="lg:pt-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                {String(index + 1).padStart(2, "0")}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] lg:gap-10">
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.05em] text-slate-950">
                    {project.title}
                  </h2>
                  {project.description ? (
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {project.description}
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Location
                    </p>
                    <p className="mt-1">{project.location}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Year
                    </p>
                    <p className="mt-1">{project.year}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Type
                    </p>
                    <p className="mt-1">{project.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Status
                    </p>
                    <p className="mt-1">{project.status ?? "Active"}</p>
                  </div>
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex w-fit items-center border-b border-black pb-1 text-[11px] uppercase tracking-[0.18em] text-slate-900"
                >
                  View project
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                <div className="overflow-hidden rounded-[1.85rem] bg-[#e7dfd1]">
                  <div
                    className="aspect-[4/5] bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-[1.03] sm:aspect-[4/4.6]"
                    style={{ backgroundImage: `url("${project.image}")` }}
                  />
                </div>
                <div className="grid gap-4">
                  <div className="overflow-hidden rounded-[1.5rem] bg-[#ece4d8]">
                    <div
                      className="aspect-[4/3] bg-cover bg-center bg-no-repeat opacity-95"
                      style={{ backgroundImage: `url("${project.image}")` }}
                    />
                  </div>
                  <div className="rounded-[1.5rem] border border-black/10 bg-white/60 p-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Architect
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {project.architect ?? "Tropical Line Design"}
                    </p>
                    <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Client
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {project.client ?? "Private Client"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
