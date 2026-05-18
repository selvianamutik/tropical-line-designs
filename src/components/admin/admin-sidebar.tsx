"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Compass, 
  Award, 
  Settings, 
  LogOut, 
  Users, 
  Network,
  Briefcase
} from "lucide-react";

const sidebarLinks = [
  { name: "DASHBOARD", href: "/admin", icon: LayoutDashboard },
  { name: "PROJECT MANAGER", href: "/admin/projects", icon: Compass },
  { name: "SERVICES", href: "/admin/services", icon: Briefcase },
  { name: "TEAM DIRECTORY", href: "/admin/team", icon: Users },
  { name: "COLLABORATOR NETWORK", href: "/admin/collaborators", icon: Network },
  { name: "AWARDS & RECOGNITION", href: "/admin/awards", icon: Award },
  { name: "STUDIO SETTINGS", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#FDFBF7] border-r border-[#e9e6df] flex flex-col justify-between py-10">
      <div>
        {/* LOGO */}
        <div className="px-10 mb-16">
          <Link href="/admin" className="flex flex-col gap-1">
            <span className="font-display font-bold text-sm tracking-widest text-[#383532]">TROPICAL LINE DESIGN</span>
            <span className="font-sans text-[10px] tracking-widest text-[#8a867f] uppercase">Admin Terminal</span>
          </Link>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col gap-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "relative flex items-center gap-4 px-10 py-3 text-[11px] font-semibold tracking-widest uppercase transition-colors",
                  isActive 
                    ? "text-[#383532]" 
                    : "text-[#a5a098] hover:text-[#383532]"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "stroke-[2.5]" : "stroke-2")} />
                {link.name}
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#d97706]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* LOGOUT BUTTON */}
      <div className="px-10 mt-10">
        <button className="flex items-center gap-4 text-[11px] font-semibold tracking-widest uppercase transition-colors text-[#e86654] hover:opacity-70">
          <LogOut className="w-4 h-4" />
          LOG OUT
        </button>
      </div>
    </aside>
  );
}
