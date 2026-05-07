interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-sm border border-dashed border-[#d9d4ca] bg-white px-8 py-14 text-center shadow-sm">
      <h3 className="font-sans text-lg font-bold text-[#383532]">{title}</h3>
      <p className="mt-2 text-sm text-[#8a867f]">{description}</p>
    </div>
  );
}
