import Image from "next/image";
import { studioData, peopleData } from "@/data/about";

export default function AboutStudioPage() {
  const principal = peopleData[0]; // YeYeQ

  return (
    <div id="content" className="flex flex-col gap-12 font-sans scroll-mt-28">
      {/* Top Section: Image floats left, text wraps around it */}
      <div className="text-neutral-600 leading-relaxed font-light text-[17px] font-inter text-justify pb-12">
        {/* Float image so text wraps around it */}
        <div className="float-left mr-8 mb-4 w-[200px] md:w-[240px] flex-shrink-0">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={principal.image}
              alt={principal.name}
              fill
              className="object-cover rounded-sm"
              sizes="(max-width: 768px) 200px, 240px"
            />
          </div>
        </div>
        {/* Text flows around the float */}
        <p className="mb-6">{studioData.description[0]}</p>
        <p>{studioData.description[1]}</p>
        {/* Clearfix so subsequent elements don't overlap the float */}
        <div className="clear-both" />
      </div>
    </div>
  );
}
