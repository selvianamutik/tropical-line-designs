import Image from "next/image";
import { listPublicAwards } from "@/lib/public/awards";

export default async function AboutAwardsPage() {
  const awards = await listPublicAwards();

  return (
    <div className="flex flex-col gap-12 pb-24">
      <h1 className="text-5xl md:text-6xl font-display font-medium text-black">AWARDS</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        {awards.map((award) => (
          <div key={award.id} className="flex flex-col gap-4">
            <div className="flex items-start gap-3 border-b border-neutral-200 pb-4">
              <h3 className="min-h-[5rem] flex-1 text-xl font-medium leading-tight">
                {award.title}
              </h3>
              <span className="bg-neutral-200 px-3 py-1 font-medium text-sm rounded-sm shrink-0">
                {award.year}
              </span>
            </div>
            <p className="text-sm font-light text-neutral-500 leading-relaxed min-h-[4rem] font-inter">
              {award.description ?? award.organization}
            </p>
            <div className="relative w-full aspect-[4/3] bg-neutral-100 mt-2">
              <Image
                src={award.image}
                alt={award.title}
                fill
                className="object-cover object-center rounded-sm"
                unoptimized={award.image.includes("/storage/v1/object/public/")}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
