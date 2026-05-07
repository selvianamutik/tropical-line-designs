import Image from "next/image";
import { peopleData } from "@/data/about";

export default function AboutPeoplePage() {
  return (
    <div className="pb-24">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {peopleData.map((person, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="relative aspect-[3/4] w-full mb-1">
              <Image
                src={person.image}
                alt={person.name}
                fill
                className="object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <div className="flex flex-col border-b border-neutral-300 pb-2 font-inter">
              <h3 className="font-semibold text-sm text-neutral-900 leading-tight">{person.name}</h3>
              <p className="text-xs text-neutral-500">{person.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
