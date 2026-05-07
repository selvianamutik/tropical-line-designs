type ProjectsPageHeroProps = {
  title: string;
  description: string;
};

export function ProjectsPageHero({
  title,
  description,
}: ProjectsPageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-black/10 bg-[#f7f1e7] px-5 pb-12 pt-28 text-slate-950 sm:px-6 sm:pb-14 md:px-8 lg:px-10 lg:pb-20 lg:pt-36 xl:px-12">
      <div className="absolute right-[-8%] top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(145,175,120,0.18)_0%,rgba(145,175,120,0)_72%)] blur-2xl" />
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-end">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
          Project Archive
        </p>
        <div className="max-w-5xl">
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-bold uppercase leading-[0.88] tracking-[-0.06em]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
