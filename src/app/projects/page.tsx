import type { Metadata } from "next";
import { SiteNav } from "@/components/global/site-nav";
import { ProjectsSimpleFooter } from "@/components/global/projects-simple-footer";
import { ProjectsGridPage } from "@/components/projects/projects-grid-page";
import { listPublicProjects } from "@/lib/public/projects";
import { StructuredData } from "@/components/seo/StructuredData";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Projects Portfolio - Tropical Line Designs",
  description: "Explore our portfolio of luxury resort, hotel, and villa landscape projects including St. Regis, Sofitel, Anantara, IKN, and more across Indonesia.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects Portfolio - Tropical Line Designs",
    description: "Explore our portfolio of luxury resort, hotel, and villa landscape projects across Indonesia.",
    url: "/projects",
  },
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await listPublicProjects();

  const breadcrumbData = {
    items: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${SITE_URL}/projects`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f8f3ea] text-slate-950">
      <StructuredData type="breadcrumb" data={breadcrumbData} />
      <SiteNav
        className="sticky inset-x-0 top-0 z-30"
      />
      <ProjectsGridPage projects={projects} />
      <ProjectsSimpleFooter />
    </main>
  );
}
