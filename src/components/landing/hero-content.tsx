import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ProjectFact = {
  label: string;
  value: string;
};

type HeroContentProps = {
  title: string;
  facts: ProjectFact[];
  layout?: "bottom-left" | "center" | "top-right" | "split";
};

function truncateFactValue(value: string, maxWords = 4) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) {
    return value.trim();
  }
  return `${words.slice(0, maxWords).join(" ")}`;
}

const fadeInProps = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
} as const;

export function HeroContent({ title, facts, layout = "bottom-left" }: HeroContentProps) {
  const containerStyles = {
    "bottom-left": "justify-end items-start",
    "center": "justify-center items-center text-center",
    "top-right": "justify-start items-end pt-40",
    "split": "justify-end items-start"
  };

  if (layout === "center") {
    return (
      <div className={cn("relative z-10 flex h-screen flex-col px-5 pt-24 sm:px-6 md:px-8 lg:px-10 xl:px-12", containerStyles[layout])}>
        <motion.div {...fadeInProps} className="max-w-4xl">
          <h1 className="font-display text-[48px] font-extrabold leading-[0.92] tracking-[-0.055em] text-white sm:text-[64px] md:text-[80px] lg:text-[100px]">
            {title}
          </h1>
          <div className="mt-12 flex justify-center gap-12">
              {facts.slice(0, 2).map(fact => (
                <div key={fact.label}>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">{fact.label}</p>
                  <p className="text-lg font-medium text-white">{truncateFactValue(fact.value)}</p>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (layout === "top-right") {
    return (
      <div className={cn("relative z-10 flex h-screen flex-col px-5 pt-24 sm:px-6 md:px-8 lg:px-10 xl:px-12", containerStyles[layout])}>
        <motion.div {...fadeInProps} className="w-full max-w-2xl text-right">
          <h1 className="font-display text-[48px] font-extrabold leading-[0.9] tracking-tighter text-white sm:text-[72px] lg:text-[96px]">
            {title}
          </h1>
          <div className="mt-8 flex flex-col items-end gap-4">
            {facts.map(fact => (
              <div key={fact.label} className="flex gap-4 items-baseline">
                <span className="text-[10px] uppercase text-white/40">{fact.label}</span>
                <span className="text-xl text-white">{truncateFactValue(fact.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (layout === "split") {
    return (
      <div className="relative z-10 flex h-screen items-center px-5 pt-24 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <motion.div {...fadeInProps} className="grid w-full grid-cols-1 lg:grid-cols-2 gap-20">
           <h1 className="font-display text-[56px] font-extrabold leading-[0.85] tracking-tight text-white sm:text-[80px] lg:text-[120px]">
             {title}
           </h1>
           <div className="flex flex-col justify-center gap-12 lg:border-l lg:border-white/20 lg:pl-20">
              {facts.map(fact => (
                <div key={fact.label}>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 mb-2">{fact.label}</p>
                  <p className="text-2xl font-light text-white">{truncateFactValue(fact.value)}</p>
                </div>
              ))}
           </div>
        </motion.div>
      </div>
    );
  }

  // Default: bottom-left
  return (
    <div className={cn("relative z-10 flex h-screen flex-col px-5 pb-8 pt-28 sm:px-6 sm:pb-10 md:px-8 md:pb-12 lg:px-10 lg:pb-14 xl:px-12 xl:pb-16", containerStyles[layout])}>
      <motion.div {...fadeInProps} className="w-full">
        <h1 className="max-w-[10ch] font-display text-[48px] font-extrabold leading-[0.92] tracking-[-0.055em] text-white sm:text-[64px] md:text-[76px] lg:text-[88px] xl:text-[96px]">
          {title}
        </h1>

        <div className="mt-8 flex flex-col gap-8 sm:mt-10 md:mt-12 lg:mt-16 lg:flex-row lg:items-end lg:justify-between xl:mt-24">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-[58px]">
            {facts.map((fact) => (
              <div key={fact.label} className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.1em] text-white/70">
                  {fact.label}
                </p>
                <p className="mt-2 text-base font-medium leading-7 text-white sm:text-[17px] lg:text-[18px]">
                  {truncateFactValue(fact.value)}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="#progress"
            className="group inline-flex w-fit flex-col items-start self-start lg:mb-[6px] lg:self-auto"
          >
            <span className="mb-[10px] h-[2px] w-[42px] bg-white transition-transform duration-300 group-hover:scale-x-110" />
            <span className="text-[10px] font-normal uppercase tracking-[0.02em] text-white/70">
              View Progress
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
