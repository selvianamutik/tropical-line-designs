import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/global/site-nav";
import { ProjectsSimpleFooter } from "@/components/global/projects-simple-footer";
import { ProjectsGridPage } from "@/components/projects/projects-grid-page";
import { listPublicProjects } from "@/lib/public/projects";
import { StructuredData } from "@/components/seo/StructuredData";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = await listPublicProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} - Tropical Line Designs`,
    description: project.description || `${project.title} landscape architecture project by Tropical Line Designs. Location: ${project.location}. ${project.type || 'Luxury landscape design'}.`,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: `${project.title} - Tropical Line Designs`,
      description: project.description || `${project.title} landscape architecture project in ${project.location}`,
      url: `/projects/${slug}`,
      images: project.image ? [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const projects = await listPublicProjects();
  const projectExists = projects.some((project) => project.slug === slug);

  if (!projectExists) {
    notFound();
  }

  const project = projects.find((p) => p.slug === slug);

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
      {
        "@type": "ListItem",
        position: 3,
        name: project?.title || slug,
        item: `${SITE_URL}/projects/${slug}`,
      },
    ],
  };

  const projectData = project ? {
    title: project.title,
    description: project.description || '',
    image: project.image || '',
    location: project.location,
    year: project.year || '',
  } : undefined;

  return (
    <main className="min-h-screen bg-[#f8f3ea] text-slate-950">
      <StructuredData type="breadcrumb" data={breadcrumbData} />
      {projectData && <StructuredData type="project" data={projectData} />}
      <SiteNav
        className="sticky inset-x-0 top-0 z-30"
      />
      <ProjectsGridPage projects={projects} selectedProjectSlug={slug} />
      <ProjectsSimpleFooter />
    </main>
  );
}
