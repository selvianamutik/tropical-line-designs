import Link from "next/link";

const footerLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-black/10 bg-[#f4efe4] px-5 py-12 text-slate-900 sm:px-6 md:px-8 lg:px-10 xl:px-12"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
            Tropical Line Design
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.75rem)] font-bold uppercase leading-[0.9] tracking-[-0.05em]">
            Landscape spaces with tropical clarity.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
            Studio landscape design and construction for resorts, villas,
            commercial developments, and refined private residences.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:min-w-[360px]">
          <div className="flex flex-col gap-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-[0.14em] text-slate-700 transition-colors hover:text-black"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="text-sm leading-6 text-slate-600">
            <p>hello@tropicallinedesign.com</p>
            <p>Bali, Indonesia</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
