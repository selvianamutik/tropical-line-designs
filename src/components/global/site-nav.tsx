"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
};

const defaultNavItems: NavItem[] = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

type SiteNavProps = {
  className?: string;
  items?: NavItem[];
};

export function SiteNav({
  className,
  items = defaultNavItems,
}: SiteNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  const isLandingPage = pathname === "/";

  // Variant 1: Landing page only — transparent + dark, switches to glass on scroll
  // Variant 2: All other pages — always glass
  const navClass = isLandingPage
    ? cn("bg-[#808080]/20 backdrop-blur-md text-white", isScrolled && "bg-[#808080]/20 backdrop-blur-sm text-slate-900")
    : "bg-[#FDF9F1]/20 backdrop-blur-sm text-slate-900";

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-[999] flex h-24 items-center px-6 transition-all duration-500 sm:px-10 md:px-16 lg:px-12",
          navClass,
          className
        )}
      >
        <div className="mx-auto flex w-full max-w-[1184px] items-baseline justify-between ">
          <Link
            href="/"
            className="text-[23px] font-bold uppercase leading-none"
          >
            Tropical Line Design
          </Link>

          <div className="hidden gap-10 sm:flex">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors hover:opacity-60"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button 
            className="sm:hidden flex items-center justify-center p-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] bg-[#f8f3ea] text-[#383532] flex flex-col pt-24 px-10 animate-in fade-in duration-300">
          <button 
            className="absolute top-8 right-6 p-2 text-[#383532] hover:opacity-70 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>

          <div className="flex flex-col gap-8 mt-12">
            {items.map((item) => (
              <div key={item.label} className="flex flex-col">
                <Link
                  href={item.href}
                  className="text-4xl font-display font-medium uppercase tracking-widest transition-colors hover:text-[#d97706]"
                >
                  {item.label}
                </Link>
                {/* Tampilkan submenu khusus untuk About di tampilan mobile */}
                {item.label === "About" && (
                  <div className="flex flex-col gap-4 mt-6 ml-4 border-l border-[#d9d4ca] pl-5">
                    <Link href="/about" className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#a5a098] hover:text-[#d97706]">
                      Studio
                    </Link>
                    <Link href="/about/people" className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#a5a098] hover:text-[#d97706]">
                      People
                    </Link>
                    <Link href="/about/collaborators" className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#a5a098] hover:text-[#d97706]">
                      Collaborators
                    </Link>
                    <Link href="/about/awards" className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#a5a098] hover:text-[#d97706]">
                      Awards
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

const footerLinks = ["Instagram", "Linkedin", "Journal", "Privacy"];

export function ProjectsSimpleFooter() {
  return (
    <footer className="bg-[#e7e3dc] px-6 py-[72px] text-[#383532] sm:px-10 md:px-16 lg:px-12">
      <div className="mx-auto flex max-w-[1184px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <Link
          href="/"
          className="text-[23px] font-bold uppercase leading-none tracking-[-0.08em]"
        >
          Tropical Line Design
        </Link>

        <div className="flex flex-wrap items-center gap-8 text-[11px] uppercase tracking-[0.22em] text-[#6f6b65] lg:gap-10">
          {footerLinks.map((link) => (
            <Link key={link} href="#" className="transition-colors hover:text-black">
              {link}
            </Link>
          ))}
        </div>

        <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a867f]">
          © 2025 <strong className="text-[#6f6b65]">Tropical Line Design.</strong>{" "}
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
