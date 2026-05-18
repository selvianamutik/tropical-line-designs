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

      <div className="mt-2 grid grid-cols-2 gap-4 border-y border-neutral-200 py-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {collaborators.map((collaborator) => (
          <div
            key={collaborator.id}
            className="relative aspect-[4/3] overflow-hidden rounded-sm border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-400"
            title={collaborator.company}
          >
            <Image
              src={collaborator.image}
              alt={collaborator.company}
              fill
              className="object-contain p-4"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              unoptimized={collaborator.image.includes("/storage/v1/object/public/")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
