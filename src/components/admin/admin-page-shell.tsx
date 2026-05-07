interface AdminPageShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function AdminPageShell({
  title,
  description,
  children,
  actions,
}: AdminPageShellProps) {
  return (
    <div className="px-12 py-10 max-w-6xl">
      <div className="mb-12 flex items-center justify-between gap-6">
        <div>
          <h2 className="font-display font-bold text-[40px] tracking-tight text-[#383532] mb-3">
            {title}
          </h2>
          <p className="text-[#8a867f] text-[15px] font-sans max-w-lg leading-relaxed">
            {description}
          </p>
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}
