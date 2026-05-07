"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export function AboutHero() {
  const pathname = usePathname();

  return (
    <AnimatePresence initial={false}>
      {pathname === "/about" && (
        <motion.div
          key="about-hero"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full overflow-hidden"
        >
          <div className="w-full h-24 bg-white"></div>
          <section className="relative w-full h-[60vh] md:h-[70vh] min-h-[400px]">
            <Image
              src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070"
              alt="Tropical Resort"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
            <a href="#content" className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white">
              <span className="text-xs tracking-widest uppercase mb-2 font-medium select-none">View Scroll</span>
              <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
