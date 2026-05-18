import Link from "next/link";
import { getPublicSiteSettings } from "@/lib/public/site-settings";

function getCompactAddress(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2);
}

export async function ProjectsSimpleFooter() {
  const settings = await getPublicSiteSettings();
  const compactAddress = getCompactAddress(settings.officeAddress);

  const primaryLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "Principal" },
    { href: "/about/people", label: "People" },
    { href: "/about/services", label: "Services" },
    { href: "/about/collaborators", label: "Collaborators" },
    { href: "/about/awards", label: "Awards" },
  ];

  const serviceLinks = [
    "Landscape Design",
    "Hospitality Projects",
    "Villa & Estate Planning",
    "Tropical Garden Strategy",
    "Site Consultation",
  ];

  const socialLinks = [
    ...(settings.instagramUrl
      ? [{ href: settings.instagramUrl, label: "Instagram" }]
      : []),
    ...(settings.linkedinUrl
      ? [{ href: settings.linkedinUrl, label: "LinkedIn" }]
      : []),
  ];

  return (
    <footer className="border-t border-[#d8d0c3] bg-[#e7e3dc] px-6 py-14 text-[#383532] sm:px-10 md:px-16 lg:px-12 lg:py-20">
      <div className="mx-auto flex max-w-[1184px] flex-col gap-14">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_0.8fr_0.9fr_1fr] lg:gap-10">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8a867f]">
              {settings.studioName}
            </p>
            <h2 className="mt-5 max-w-[16ch] font-sans text-[30px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#383532] sm:text-[38px]">
              {settings.footerHeading}
            </h2>
            <p className="mt-5 max-w-[58ch] text-sm leading-7 text-[#6f6b65]">
              {settings.footerDescription}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a867f]">Quick Links</p>
            <div className="mt-5 flex flex-col gap-3">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[15px] text-[#383532] transition-colors hover:text-black"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a867f]">Studio Focus</p>
            <div className="mt-5 flex flex-col gap-3">
              {serviceLinks.map((service) => (
                <p key={service} className="text-[15px] text-[#383532]">
                  {service}
                </p>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a867f]">Contact Us</p>
            <Link
              href="/contact"
              className="mt-5 inline-flex h-12 items-center justify-center border border-[#b7aea1] px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-[#383532] transition-colors hover:bg-[#ddd7cd]"
            >
              Visit Contact Page
            </Link>

            <div className="mt-8 space-y-4 text-sm leading-6 text-[#6f6b65]">
              <a href={`mailto:${settings.contactEmail}`} className="block transition-colors hover:text-black">
                {settings.contactEmail}
              </a>
              <a
                href={`tel:${settings.phoneNumber.replace(/\s+/g, "")}`}
                className="block text-lg font-medium tracking-[-0.02em] text-[#383532] transition-colors hover:text-black"
              >
                {settings.phoneNumber}
              </a>
              <div className="text-[#8a867f]">
                {compactAddress.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-[#d8d0c3] pt-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a867f]">
              &copy; 2026 <strong className="text-[#6f6b65]">{settings.studioName}</strong>. All rights reserved.
            </p>
            <p className="max-w-2xl text-xs leading-6 text-[#8a867f]">
              Studio landscape planning, resort grounds, villa gardens, and contextual tropical environments for
              hospitality and residential developments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-[#383532]">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-black"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
