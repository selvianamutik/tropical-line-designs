type ProjectCardProps = {
  title: string;
  location: string;
  year: string;
  type: string;
  image: string;
};

export function ProjectCard({
  title,
  location,
  year,
  type,
  image,
}: ProjectCardProps) {
  return (
    <article className="grid gap-5 border-b border-black/10 pb-8 md:grid-cols-[140px_minmax(0,1fr)] md:items-start lg:grid-cols-[180px_minmax(0,1fr)]">
      <div className="space-y-4">
        <h3 className="font-display text-[1.65rem] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-slate-950">
          {title}
        </h3>
        <div className="space-y-3 text-sm text-slate-600">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
              Location
            </p>
            <p className="mt-1">{location}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
              Year
            </p>
            <p className="mt-1">{year}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
              Type
            </p>
            <p className="mt-1">{type}</p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] bg-[#e8e0d0]">
        <div
          className="aspect-[16/11] w-full bg-cover bg-center bg-no-repeat transition-transform duration-500 hover:scale-[1.03]"
          style={{ backgroundImage: `url("${image}")` }}
        />
      </div>
    </article>
  );
}
