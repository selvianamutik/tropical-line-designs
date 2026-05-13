import { TeamMemberPortrait } from "@/components/about/team-member-portrait";
import { listPublicTeamMembers } from "@/lib/public/about";

export default async function AboutPeoplePage() {
  const people = await listPublicTeamMembers();

  return (
    <div className="pb-24">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {people.map((person) => (
          <div key={person.id} className="flex flex-col gap-2">
            <div className="relative aspect-[3/4] w-full mb-1">
              <TeamMemberPortrait src={person.image} alt={person.name} />
            </div>
            <div className="flex flex-col border-b border-neutral-300 pb-2 font-inter">
              <h3 className="min-h-[2.5rem] font-semibold text-sm leading-tight text-neutral-900">
                {person.name}
              </h3>
              <p className="text-xs text-neutral-500">{person.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
