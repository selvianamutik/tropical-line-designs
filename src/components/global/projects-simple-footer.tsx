import Link from "next/link";
import { getPublicSiteSettings } from "@/lib/public/site-settings";

export async function ProjectsSimpleFooter() {
  const settings = await getPublicSiteSettings();

  const footerLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    ...(settings.instagramUrl
      ? [{ href: settings.instagramUrl, label: "Instagram", external: true as const }]
      : []),
    ...(settings.linkedinUrl
      ? [{ href: settings.linkedinUrl, label: "LinkedIn", external: true as const }]
      : []),
  ];

  return (
    <footer className="bg-[#e7e3dc] px-6 py-[72px] text-[#383532] sm:px-10 md:px-16 lg:px-12">
      <div className="mx-auto flex max-w-[1184px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <Link
          href="/"
          className="text-[23px] font-bold uppercase leading-none tracking-[-0.08em]"
        >
          {settings.studioName}
        </Link>

        <div className="flex flex-wrap items-center gap-8 text-[11px] uppercase tracking-[0.22em] text-[#6f6b65] lg:gap-10">
          {footerLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-black"
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.label} href={link.href} className="transition-colors hover:text-black">
                {link.label}
              </Link>
            ),
          )}
        </div>

        <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a867f]">
          &copy; 2026 <strong className="text-[#6f6b65]">{settings.studioName}.</strong> All rights reserved.
        </p>
      </div>
    </footer>
  );
}
