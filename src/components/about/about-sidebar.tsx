"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Principal", href: "/about" },
  { name: "People", href: "/about/people" },
  { name: "Services", href: "/about/services" },
  { name: "Collaborators", href: "/about/collaborators" },
  { name: "Awards", href: "/about/awards" },
];

export function AboutSidebar() {
  const pathname = usePathname();

  return (
    <aside className="mb-8 w-full flex-shrink-0 lg:sticky lg:top-32 lg:mb-0 lg:w-64 lg:self-start">
      <ul className="flex flex-row gap-2 overflow-x-auto overflow-y-hidden pb-2 pr-4 scrollbar-hide lg:flex-col lg:gap-4 lg:overflow-visible lg:pb-0 lg:pr-0">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.href} className="flex-shrink-0">
              <Link
                href={link.href}
                className={cn(
                  "relative block transition-colors duration-300",
                  "px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] border rounded-sm whitespace-nowrap lg:border-0 lg:rounded-none lg:px-2 lg:py-0",
                  isActive
                    ? "border-[#383532] bg-[#383532] text-white lg:bg-transparent lg:text-black lg:text-3xl lg:font-medium lg:tracking-normal"
                    : "border-[#d9d4ca] text-[#a5a098] lg:border-0 lg:text-xl lg:font-light lg:text-neutral-600 hover:text-black"
                )}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
