import { SiteNav } from "@/components/global/site-nav";
import { AboutSidebar } from "@/components/about/about-sidebar";
import { AboutHero } from "@/components/about/about-hero";
import { AboutPhilosophy } from "@/components/about/about-philosophy";
import { ProjectsSimpleFooter } from "@/components/global/projects-simple-footer";
import { ScrollToTop } from "@/components/global/scroll-to-top";
import { getPublicSiteSettings } from "@/lib/public/site-settings";

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSiteSettings();

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col relative">
      <ScrollToTop />
      <SiteNav />

      <AboutHero imageUrl={settings.aboutPrincipalImageUrl} />

      {/* Main Content Area */}
      <section className="flex-grow max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 pt-36 pb-12 ">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 ">
          <AboutSidebar />
          <div className="flex-grow max-w-4xl min-w-0">
            {children}
          </div>
        </div>
      </section>

      <AboutPhilosophy />

      <ProjectsSimpleFooter />
    </main>
  );
}
