"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { logout } from "@/app/login/actions";

type AdminUserMenuProps = {
  email: string;
};

export function AdminUserMenu({ email }: AdminUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-10 items-center gap-2 rounded-full border border-[#d9d4ca] bg-[#fdfbf7] px-3 text-[#383532] transition-colors hover:bg-[#f4efe6]"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open user menu"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d9d4ca] bg-white">
          <User className="h-4 w-4" />
        </span>
        <ChevronDown className={`h-4 w-4 text-[#8a867f] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-40 w-64 rounded-sm border border-[#e9e6df] bg-white p-2 shadow-xl">
          <div className="border-b border-[#ece6db] px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a867f]">
              Signed In As
            </p>
            <p className="mt-2 break-all text-sm font-semibold text-[#383532]">{email}</p>
          </div>

          <form action={logout} className="pt-2">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm text-[#383532] transition-colors hover:bg-[#fff0ee] hover:text-[#9a3c2f]"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
