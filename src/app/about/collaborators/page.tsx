import type { Metadata } from "next";
import Image from "next/image";
import { listPublicCollaborators } from "@/lib/public/collaborators";
import { getAboutRouteMetadata, SOCIAL_IMAGE } from "@/lib/seo";

const collaboratorsMetadata = getAboutRouteMetadata("/about/collaborators");

export const metadata: Metadata = {
  title: collaboratorsMetadata?.title,
  description: collaboratorsMetadata?.description,
  alternates: {
    canonical: "/about/collaborators",
  },
  openGraph: {
    title: collaboratorsMetadata?.title,
    description: collaboratorsMetadata?.description,
    url: "/about/collaborators",
    images: [SOCIAL_IMAGE],
  },
};

export default async function AboutCollaboratorsPage() {
  const collaborators = await listPublicCollaborators();

  return (
    <div className="flex flex-col gap-12 pb-24">
      <h1 className="text-5xl md:text-6xl font-medium text-black">COLLABORATORS</h1>

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
