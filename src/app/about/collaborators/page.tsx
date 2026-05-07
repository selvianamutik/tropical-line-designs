import Image from "next/image";
import { collaboratorsData } from "@/data/about";

export default function AboutCollaboratorsPage() {
  return (
    <div className="flex flex-col gap-12 pb-24">
      <h1 className="text-5xl md:text-6xl font-medium text-black">COLLABORATORS</h1>
      <p className="max-w-2xl text-neutral-600 font-light text-lg leading-relaxed font-inter">
        {collaboratorsData.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 mt-4">
        {collaboratorsData.list.map((collab, index) => (
          <div key={index} className="flex flex-col border-b border-neutral-200 pb-6">
            <h3 className="text-xl font-medium mb-4">{collab.name}</h3>
            <div className="flex flex-col gap-1.5 uppercase text-xs tracking-widest text-neutral-500">
              {collab.locations.map((loc, idx) => (
                <span key={idx}>{loc}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 w-full flex flex-col gap-3">
        <div className="relative w-full aspect-video bg-neutral-200 rounded-sm overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069"
            alt="Internal Workshop Series"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex justify-between w-full text-xs font-medium text-neutral-600 uppercase tracking-widest px-1">
          <span>INTERNAL WORKSHOP SERIES / 2024</span>
          <span>&quot;Space is only alive when it is shared.&quot;</span>
        </div>
      </div>
    </div>
  );
}
