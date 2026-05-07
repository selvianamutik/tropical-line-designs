import Image from "next/image";
import { awardsData } from "@/data/about";

export default function AboutAwardsPage() {
  return (
    <div className="flex flex-col gap-12 pb-24">
      <h1 className="text-5xl md:text-6xl font-display font-medium text-black">AWARDS</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        {awardsData.map((award, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div className="flex items-start gap-3 border-b border-neutral-200 pb-4">
              <h3 className="text-xl font-medium flex-1">{award.title}</h3>
              <span className="bg-neutral-200 px-3 py-1 font-medium text-sm rounded-sm shrink-0">
                {award.year}
              </span>
            </div>
            <p className="text-sm font-light text-neutral-500 leading-relaxed min-h-[4rem] font-inter">
              {award.description}
            </p>
            <div className="relative w-full aspect-[4/3] bg-neutral-100 mt-2">
              <Image
                src="https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=2071"
                alt={award.title}
                fill
                className="object-cover object-center rounded-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
