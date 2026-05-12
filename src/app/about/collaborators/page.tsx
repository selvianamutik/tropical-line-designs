import Image from "next/image";
import { collaboratorsData } from "@/data/about";
import { listPublicCollaborators } from "@/lib/public/collaborators";

export default async function AboutCollaboratorsPage() {
  const collaborators = await listPublicCollaborators();

  return (
    <div className="flex flex-col gap-12 pb-24">
      <h1 className="text-5xl md:text-6xl font-medium text-black">COLLABORATORS</h1>
      <p className="max-w-2xl text-neutral-600 font-light text-lg leading-relaxed font-inter">
        {collaboratorsData.description}
      </p>

      <div className="mt-2 flex flex-col divide-y divide-neutral-200 border-y border-neutral-200">
        {collaborators.map((collaborator) => (
          <div
            key={collaborator.id}
            className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-5 py-4 md:grid-cols-[120px_minmax(0,1fr)] md:gap-8 md:py-5"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-neutral-200 bg-white p-3">
              <Image
                src={collaborator.image}
                alt={collaborator.company}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 92px, 120px"
                unoptimized={collaborator.image.includes("/storage/v1/object/public/")}
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-medium leading-tight text-black md:text-xl">
                {collaborator.company}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-neutral-500 md:text-sm">
                {collaborator.expertiseType}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
