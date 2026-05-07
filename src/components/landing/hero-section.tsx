"use client";

import { useEffect, useState } from "react";
import { HeroContent } from "@/components/landing/hero-content";
import { SiteNav } from "@/components/global/site-nav";

export type HeroProject = {
  title: string;
  image: string;
  layout?: "bottom-left" | "center" | "top-right" | "split";
  facts: {
    label: string;
    value: string;
  }[];
};

type HeroSectionProps = {
  projects: HeroProject[];
  intervalMs?: number;
};

const FADE_DURATION_MS = 900;

export function HeroSection({
  projects,
  intervalMs = 5000,
}: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [contentKey, setContentKey] = useState(0);

  useEffect(() => {
    if (projects.length <= 1) {
      return;
    }

    let fadeTimeoutId: number | undefined;
    let startFadeTimeoutId: number | undefined;
    const intervalId = window.setInterval(() => {
      setIncomingIndex((currentIncoming) => {
        if (currentIncoming !== null) {
          return currentIncoming;
        }

        const nextIndex = (activeIndex + 1) % projects.length;
        setIsFading(false);
        setContentKey((current) => current + 1);

        // Wait one tick so the incoming layer mounts at opacity 0
        // before we animate it to opacity 1.
        startFadeTimeoutId = window.setTimeout(() => {
          setIsFading(true);
        }, 30);

        fadeTimeoutId = window.setTimeout(() => {
          setActiveIndex(nextIndex);
          setIncomingIndex(null);
          setIsFading(false);
        }, FADE_DURATION_MS);

        return nextIndex;
      });
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
      if (startFadeTimeoutId) {
        window.clearTimeout(startFadeTimeoutId);
      }
      if (fadeTimeoutId) {
        window.clearTimeout(fadeTimeoutId);
      }
    };
  }, [activeIndex, intervalMs, projects.length]);

  const displayedProject = projects[incomingIndex ?? activeIndex];
  const incomingProject = incomingIndex !== null ? projects[incomingIndex] : null;

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${projects[activeIndex].image}')` }}
      />

      {incomingProject && (
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity ease-out ${
            isFading ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url('${incomingProject.image}')`,
            transitionDuration: `${FADE_DURATION_MS}ms`,
          }}
        />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.04)_22%,rgba(0,0,0,0)_52%,rgba(0,0,0,0.58)_100%)]" />
      <SiteNav />
      <div key={contentKey} className="relative">
        <HeroContent
          title={displayedProject.title}
          facts={displayedProject.facts}
          layout={displayedProject.layout}
        />
      </div>
    </section>
  );
}
