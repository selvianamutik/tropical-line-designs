type ProjectSectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function ProjectSectionHeader({
  eyebrow,
  title,
  description,
}: ProjectSectionHeaderProps) {
  return (
    <div className="grid gap-6 border-b border-black/10 pb-8 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-start">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
        {eyebrow}
      </p>
      <div className="max-w-4xl">
        <h2 className="font-display text-[clamp(2.4rem,6vw,5.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.05em] text-slate-950">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
