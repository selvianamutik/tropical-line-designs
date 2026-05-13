import Image from "next/image";
import { MapClient } from "@/components/contact/map-client";
import { ProjectsSimpleFooter } from "@/components/global/projects-simple-footer";
import { SiteNav } from "@/components/global/site-nav";
import { getPublicSiteSettings } from "@/lib/public/site-settings";

export default async function ContactPage() {
  const settings = await getPublicSiteSettings();
  const addressLines = settings.officeAddress
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <SiteNav />

      <section className="relative z-10 flex w-full flex-col items-center pt-40 pb-24">
        <div className="absolute inset-x-0 top-[250px] -z-10 h-[300px] bg-[#e0ded6]" />

        <div className="h-[500px] w-full max-w-5xl px-6 md:px-12">
          <MapClient />
        </div>

        <div className="mt-24 w-full max-w-4xl px-8">
          <div className="grid grid-cols-1 gap-12 text-[#383532] md:grid-cols-3">
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#8a867f]">Location</h4>
              <div>
                {addressLines.length > 0 ? (
                  <>
                    <p className="text-lg font-medium leading-snug">{addressLines[0]}</p>
                    <div className="mt-1 font-inter text-sm font-light leading-relaxed text-neutral-600">
                      {addressLines.slice(1).map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#8a867f]">General Inquiries</h4>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="font-inter text-base font-light text-neutral-800 transition-opacity hover:opacity-70"
              >
                {settings.contactEmail}
              </a>
            </div>

            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#8a867f]">Call Our Studio</h4>
                <a
                  href={`tel:${settings.phoneNumber.replace(/\s+/g, "")}`}
                  className="font-inter text-base font-light text-neutral-800 transition-opacity hover:opacity-70"
                >
                  {settings.phoneNumber}
                </a>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#8a867f]">Digital Presence</h4>
                <div className="flex gap-6 font-inter text-sm font-light">
                  {settings.instagramUrl ? (
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 transition-opacity hover:opacity-70"
                    >
                      Instagram <span aria-hidden="true">&uarr;</span>
                    </a>
                  ) : null}
                  {settings.linkedinUrl ? (
                    <a
                      href={settings.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 transition-opacity hover:opacity-70"
                    >
                      LinkedIn <span aria-hidden="true">&uarr;</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative h-[50vh] min-h-[400px] w-full">
        <div className="absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-[#FDFBF7] to-transparent" />
        <Image
          src="/sofitel/so-1.jpg"
          alt="Coastal Resort"
          fill
          className="object-cover"
        />
      </section>

      <ProjectsSimpleFooter />
    </main>
  );
}
