import { HeroSection, HeroProject } from "@/components/landing/hero-section";
import { IntroOverlay } from "@/components/global/intro-overlay";
import { listPublicProjects } from "@/lib/public/projects";

export default async function HomePage() {
  const projects = await listPublicProjects();
  const heroProjects: HeroProject[] = projects.map((project) => {
    const facts = [
      { label: "LOCATION", value: project.location },
    ];
    
    if (project.status?.toLowerCase() === "completed" && project.year) {
      facts.push({ label: "COMPLETED", value: project.year });
    } else if (project.status) {
      facts.push({ label: "STATUS", value: project.status });
    }

    if (project.type) {
      facts.push({ label: "PROJECT TYPE", value: project.type });
    }

    return {
      title: project.title,
      layout: "bottom-left",
      image: project.image,
      facts,
    };
  });

  return (
    <main className="h-screen overflow-hidden bg-[#fdf9f1] text-white">
      <IntroOverlay />
      <HeroSection projects={heroProjects} />
    </main>
  );
}
