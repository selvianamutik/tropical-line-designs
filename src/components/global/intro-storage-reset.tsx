"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const INTRO_STORAGE_KEY = "has-seen-intro-v1";

export function IntroStorageReset() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      localStorage.removeItem(INTRO_STORAGE_KEY);
    }
  }, [pathname]);

  return null;
}
