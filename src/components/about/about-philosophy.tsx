"use client";

import { usePathname } from "next/navigation";
import { studioData } from "@/data/about";

export function AboutPhilosophy() {
  const pathname = usePathname();

  // Only show on the Studio page (/about), hide on People, Collaborators, Awards
  if (pathname !== "/about") return null;

  return (
    <div className="-mx-6 md:-mx-12 lg:-mx-0 bg-transparent py-12">
      <div className="px-6 md:px-12 lg:px-40 flex flex-col gap-8 md:gap-12">
        <h2 className="text-center tracking-[0.2em] font-medium uppercase text-[#383532]">
          {studioData.philosophyTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {studioData.philosophies.map((phil, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <h3 className="font-semibold text-neutral-900">{phil.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-600 font-light font-inter">
                {phil.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
