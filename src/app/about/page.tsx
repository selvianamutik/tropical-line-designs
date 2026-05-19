import { TeamMemberPortrait } from "@/components/about/team-member-portrait";
import { studioData } from "@/data/about";
import { listPublicTeamMembers } from "@/lib/public/about";

export default async function AboutStudioPage() {
  const people = await listPublicTeamMembers();
  const principal = people.find((person) => person.role.toLowerCase() === "principal") ?? people[0] ?? null;

  return (
    <div id="content" className="flex flex-col gap-12 font-sans scroll-mt-28">
      {/* Top Section: Image floats left, text wraps around it */}
      <div className="text-neutral-600 leading-relaxed font-light text-[17px] font-inter text-justify pb-12">
        {/* Float image so text wraps around it */}
        {principal ? (
          <div className="float-left mr-8 mb-4 w-[200px] md:w-[240px] flex-shrink-0">
            <div className="relative aspect-[3/4] w-full">
              <TeamMemberPortrait
                src={principal.image}
                alt={principal.name}
                className="grayscale-0 hover:grayscale-0"
                sizes="(max-width: 768px) 200px, 240px"
              />
            </div>
          </div>
        ) : null}
        {/* Text flows around the float */}
        <p className="mb-6">{studioData.description[0]}</p>
        <p>{studioData.description[1]}</p>
        {/* Clearfix so subsequent elements don't overlap the float */}
        <div className="clear-both" />
      </div>
    </div>
  );
}
