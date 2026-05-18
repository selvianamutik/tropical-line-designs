"use client";

import Image from "next/image";
import { useEffect } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicProjectRecord, GalleryLayout } from "@/lib/public/projects";

interface ProjectOverlayProps {
  project: PublicProjectRecord;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  showImageOrderLabels?: boolean;
}

function isSupabaseStorageUrl(value: string) {
  return value.includes(".supabase.co/storage/v1/object/public/");
}

function ImageOrderBadge({ index }: { index: number }) {
  return (
    <div className="absolute left-3 top-3 z-20 flex h-8 min-w-8 items-center justify-center rounded-full bg-[#d97706] px-2 text-[11px] font-bold text-white shadow-lg ring-2 ring-white/90">
      {index + 1}
    </div>
  );
}

function ProjectImage({
  src,
  alt,
  priority = false,
  orderIndex,
  showOrderLabel = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  orderIndex?: number;
  showOrderLabel?: boolean;
}) {
  return (
    <>
      {showOrderLabel && typeof orderIndex === "number" ? <ImageOrderBadge index={orderIndex} /> : null}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
        unoptimized={isSupabaseStorageUrl(src)}
      />
    </>
  );
}

export function ProjectOverlay({
  project,
  isOpen,
  onClose,
  onNext,
  onPrev,
  showImageOrderLabels = false,
}: ProjectOverlayProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const images = project.images || [project.image];
  const layout = project.galleryLayout || "A";

  return (
    <AnimatePresence>
      <motion.div
        layoutId={`container-${project.slug}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] overflow-y-auto bg-[#f8f3ea]"
      >
        {/* Navigation Controls - Top Close Button */}
        <div className="fixed top-0 inset-x-0 z-[2010] flex justify-end items-center p-6 md:p-10 pointer-events-none">
          <button 
            onClick={onClose}
            className="pointer-events-auto p-3 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-lg active:scale-95"
          >
            <X className="w-6 h-6 md:w-8 md:h-8 text-black" />
          </button>
        </div>

        <motion.section
          layoutId={`image-${project.slug}`}
          className="relative min-h-screen bg-[#f8f3ea]"
        >
          <ProjectImage src={project.image} alt={project.title} priority orderIndex={0} showOrderLabel={showImageOrderLabels} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.12)_38%,rgba(0,0,0,0.68)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-24 text-white sm:px-10 md:px-16 lg:px-20">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">{project.location}</p>
            <h1 className="mt-4 max-w-[11ch] font-display text-[44px] font-extrabold uppercase leading-[0.9] tracking-[-0.055em] sm:text-[64px] md:text-[84px] lg:text-[108px]">
              {project.title}
            </h1>
            <div className="mt-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
              <span className="h-px w-12 bg-white/70" />
              Scroll for gallery
            </div>
          </div>
        </motion.section>

        <section className="bg-white px-6 py-14 text-[#383532] sm:px-10 md:px-16 lg:px-20 lg:py-20">
          <div className="mx-auto grid max-w-[1184px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a867f]">Project Detail</p>
              <h2 className="mt-4 font-display text-[34px] font-bold uppercase leading-[0.96] tracking-[-0.04em] text-[#1a1a1a] md:text-[48px]">
                {project.title}
              </h2>
            </div>

            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3">
                {project.type ? (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a867f]">Project Type</p>
                    <p className="mt-2 text-sm font-semibold uppercase text-[#383532]">{project.type}</p>
                  </div>
                ) : null}
                {project.status ? (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a867f]">Status</p>
                    <p className="mt-2 text-sm font-semibold uppercase text-[#383532]">{project.status}</p>
                  </div>
                ) : null}
                {project.year ? (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a867f]">Date</p>
                    <p className="mt-2 text-sm font-semibold uppercase text-[#383532]">{project.year}</p>
                  </div>
                ) : null}
                {project.client ? (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a867f]">Client</p>
                    <p className="mt-2 text-sm font-semibold uppercase text-[#383532]">{project.client}</p>
                  </div>
                ) : null}
                {project.architect || project.landscapeConsultant ? (
                  <div className="md:col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a867f]">
                      {project.landscapeConsultant ? "Landscape Consultant" : "Architect"}
                    </p>
                    <p className="mt-2 text-sm font-semibold uppercase text-[#383532]">
                      {project.landscapeConsultant || project.architect}
                    </p>
                  </div>
                ) : null}
              </div>

              {project.description ? (
                <p className="border-t border-[#d9d4ca] pt-8 text-base leading-8 text-[#5f5a52]">
                  {project.description}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="min-h-screen bg-[#f8f3ea] px-4 py-14 sm:px-8 md:px-12 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a867f]">Gallery</p>
                <h2 className="mt-3 font-display text-[32px] font-bold uppercase leading-none tracking-[-0.04em] text-[#1a1a1a] md:text-[48px]">
                  Project Collage
                </h2>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:hidden">
              {images.map((img, i) => (
                <div key={`${img}-${i}`} className="relative aspect-video w-full overflow-hidden rounded-sm bg-[#e8dfd2]">
                  <ProjectImage src={img} alt={`${project.title} ${i + 1}`} orderIndex={i} showOrderLabel={showImageOrderLabels} />
                </div>
              ))}
            </div>

            <div className="hidden min-h-screen items-center justify-center md:flex">
              <ProjectGalleryTemplate layout={layout} images={images} showImageOrderLabels={showImageOrderLabels} />
            </div>
          </div>
        </section>

        {/* Bottom Footer Navigation (Shared for both, but positioned differently) */}
        <div className="fixed bottom-0 inset-x-0 z-[2010] flex justify-between items-center p-6 md:p-10 pointer-events-none">
          <button 
            onClick={onPrev}
            className="pointer-events-auto flex items-center gap-2 group text-[11px] md:text-[13px] uppercase tracking-[0.2em] font-bold bg-white/85 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Prev</span>
          </button>
          <button 
            onClick={onNext}
            className="pointer-events-auto flex items-center gap-2 group text-[11px] md:text-[13px] uppercase tracking-[0.2em] font-bold bg-white/85 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProjectGalleryTemplate({
  layout,
  images,
  showImageOrderLabels,
}: {
  layout: GalleryLayout;
  images: string[];
  showImageOrderLabels: boolean;
}) {
  // Pad images array to ensure we have enough for layouts
  const safeImages = [...images];
  while (safeImages.length < 4) safeImages.push(images[0]);

  if (layout === "A") {
    // Template A (Anantara style): Big top, long left, two small right stacked
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-4 h-screen w-[90%] aspect-square md:aspect-auto">
        <div className="relative col-span-2 row-span-1">
          <ProjectImage src={safeImages[0]} alt="Project" orderIndex={0} showOrderLabel={showImageOrderLabels} />
        </div>
        <div className="relative col-span-1 row-span-1">
          <ProjectImage src={safeImages[1]} alt="Project" orderIndex={1} showOrderLabel={showImageOrderLabels} />
        </div>
        <div className="flex flex-col gap-4">
           <div className="relative flex-1">
             <ProjectImage src={safeImages[2]} alt="Project" orderIndex={2} showOrderLabel={showImageOrderLabels} />
           </div>
           <div className="relative flex-1">
             <ProjectImage src={safeImages[3]} alt="Project" orderIndex={3} showOrderLabel={showImageOrderLabels} />
           </div>
        </div>
      </div>
    );
  }
  
  if (layout === "B") {
    // Template B (Bajo style): Two horizontal top, two square bottom overlapping
    return (
      <div className="flex flex-col gap-4 h-screen w-[90%] justify-between relative aspect-square md:aspect-auto">
        <div className="grid grid-cols-3 gap-4 h-[40%] absolute w-[145%] right-0">
          <div className="relative col-span-2">
            <ProjectImage src={safeImages[0]} alt="Project" orderIndex={0} showOrderLabel={showImageOrderLabels} />
          </div>
          <div className="relative">
            <ProjectImage src={safeImages[1]} alt="Project" orderIndex={1} showOrderLabel={showImageOrderLabels} />
          </div>
        </div>
        <div className=""></div>
        <div className="grid grid-cols-3 grid-rows-3 relative gap-4 h-[63%]">
          <div className="relative col-start-2 col-span-2 row-span-2 border-t-[12px] border-l-[12px] border-white">
            <ProjectImage src={safeImages[3]} alt="Project" orderIndex={3} showOrderLabel={showImageOrderLabels} />
          </div>
          <div className="relative row-start-3">
            <div className="absolute bottom-0 w-[500px] h-[300px] border-r-[12px] border-t-[12px] border-white">
              <ProjectImage src={safeImages[2]} alt="Project" orderIndex={2} showOrderLabel={showImageOrderLabels} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (layout === "C") {
    // Template C (Sofitel style): Big top, one square left, two small right stacked
    return (
      <div className="grid grid-cols-2 grid-rows-3 gap-4 h-screen w-[90%] aspect-square md:aspect-auto">
        <div className="relative col-span-2 row-span-2">
          <ProjectImage src={safeImages[0]} alt="Project" orderIndex={0} showOrderLabel={showImageOrderLabels} />
        </div>
        <div className="relative col-span-1 row-span-1">
          <ProjectImage src={safeImages[1]} alt="Project" orderIndex={1} showOrderLabel={showImageOrderLabels} />
        </div>
        <div className="flex flex-col gap-4">
           <div className="relative flex-1"> 
             <ProjectImage src={safeImages[2]} alt="Project" orderIndex={2} showOrderLabel={showImageOrderLabels} />
           </div>
        </div>
      </div>
    );
  }
  
  if (layout === "D") {
    // Template D (Four Seasons style): One dominant image with subtle offset siblings
    return (
      <div className="relative h-screen w-[90%]">
         <div className="relative w-full h-full shadow-2xl">
            <ProjectImage src={safeImages[0]} alt="Project" orderIndex={0} showOrderLabel={showImageOrderLabels} />
         </div>
         {/* Subtle floating detail (optional layout variation)
         <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-1/2 hidden md:block border-8 border-white shadow-xl">
         <ProjectImage src={safeImages[1]} alt="Project" />
         </div> */}
      </div>
    );
  }
  
  if (layout === "E") {
    // Template A (Anantara style): Big top, long left, two small right stacked
    return (
      <div className="grid grid-cols-2 grid-rows-2 relative gap-4 h-screen w-[90%] aspect-square md:aspect-auto">
        <div className="relative col-span-2 row-span-1">
          <ProjectImage src={safeImages[0]} alt="Project" orderIndex={0} showOrderLabel={showImageOrderLabels} />
        </div>
        <div className="relative col-span-1 row-span-1">
          <ProjectImage src={safeImages[1]} alt="Project" orderIndex={1} showOrderLabel={showImageOrderLabels} />
        </div>
        <div className="flex flex-col gap-4">
           <div className="relative h-[290px] mt-auto">
             <ProjectImage src={safeImages[2]} alt="Project" orderIndex={2} showOrderLabel={showImageOrderLabels} />
           </div>
          <div className="absolute top-[55%] right-0 -translate-y-1/2 w-[60%] h-[40%] hidden md:block border-l-[12px] border-y-[12px] border-white">
            <ProjectImage src={safeImages[3]} alt="Project" orderIndex={3} showOrderLabel={showImageOrderLabels} />
          </div>
        </div>
      </div>
    );
  }
  
  if (layout === "F") {
    // Template A (Anantara style): Big top, long left, two small right stacked
    return (
      <div className="grid grid-cols-2 grid-rows-2 relative h-screen gap-4 w-[90%] aspect-square md:aspect-auto">
        <div className="relative col-span-2 row-span-1">
          <ProjectImage src={safeImages[0]} alt="Project" orderIndex={0} showOrderLabel={showImageOrderLabels} />
        </div>
        <div className="absolute flex flex-col gap-4 w-full h-full z-10">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[60%] h-[40%] hidden md:block border-l-[12px] border-y-[12px] border-white">
            <ProjectImage src={safeImages[2]} alt="Project" orderIndex={2} showOrderLabel={showImageOrderLabels} />
          </div>
        </div>
        <div className="relative col-span-2 row-span-1">
          <ProjectImage src={safeImages[1]} alt="Project" orderIndex={1} showOrderLabel={showImageOrderLabels} />
        </div>
      </div>
    );
  }

  if (layout === "G") {
    // Template C (Sofitel style): Big top, one square left, two small right stacked
    return (
      <div className="grid grid-cols-2 grid-rows-3 gap-4 h-screen w-[90%] aspect-square md:aspect-auto">
        <div className="relative col-span-2 row-span-1">
          <ProjectImage src={safeImages[0]} alt="Project" orderIndex={0} showOrderLabel={showImageOrderLabels} />
        </div>
        <div className="relative col-span-1 row-span-1">
          <ProjectImage src={safeImages[1]} alt="Project" orderIndex={1} showOrderLabel={showImageOrderLabels} />
        </div>
        <div className="flex flex-col gap-4">
           <div className="relative flex-1"> 
             <ProjectImage src={safeImages[2]} alt="Project" orderIndex={2} showOrderLabel={showImageOrderLabels} />
           </div>
        </div>
        <div className="relative col-span-2 row-span-1">
          <ProjectImage src={safeImages[3]} alt="Project" orderIndex={3} showOrderLabel={showImageOrderLabels} />
        </div>
      </div>
    );
  }
   
  if (layout === "H") {
    // Template C (Sofitel style): Big top, one square left, two small right stacked
    return (
      <div className="grid grid-cols-2 grid-rows-3 gap-4 h-screen w-[90%] aspect-square md:aspect-auto float-end">
        <div className="relative col-span-2 row-span-1">
          <ProjectImage src={safeImages[0]} alt="Project" orderIndex={0} showOrderLabel={showImageOrderLabels} />
        </div>
        <div className="relative col-span-2 row-span-1">
          <ProjectImage src={safeImages[1]} alt="Project" orderIndex={1} showOrderLabel={showImageOrderLabels} />
        </div>
        <div className="relative col-span-2 row-span-1">
          <ProjectImage src={safeImages[2]} alt="Project" orderIndex={2} showOrderLabel={showImageOrderLabels} />
        </div>
      </div>
    );
  }

  if (layout === "I") {
    // Template C (Sofitel style): Big top, one square left, two small right stacked
    return (
      <div className="grid grid-cols-3 grid-rows-3 gap-4 h-screen w-[90%] aspect-square md:aspect-auto">
        <div className="relative col-span-2 row-span-1">
          <ProjectImage src={safeImages[0]} alt="Project" orderIndex={0} showOrderLabel={showImageOrderLabels} />
        </div>
        <div className="flex flex-col gap-4">
           <div className="relative flex-1"> 
             <ProjectImage src={safeImages[1]} alt="Project" orderIndex={1} showOrderLabel={showImageOrderLabels} />
           </div>
        </div>
        <div className="relative col-span-3 row-span-2">
          <ProjectImage src={safeImages[2]} alt="Project" orderIndex={2} showOrderLabel={showImageOrderLabels} />
        </div>
      </div>
    );
  }
  if (layout === "J") {
    // Template C (Sofitel style): Big top, one square left, two small right stacked
    return (
      <div className="grid grid-cols-3 grid-rows-3 gap-4 h-screen w-[90%] aspect-square md:aspect-auto">
        <div className="relative col-span-1 row-span-1">
          <ProjectImage src={safeImages[0]} alt="Project" orderIndex={0} showOrderLabel={showImageOrderLabels} />
        </div>
        <div className="flex flex-col gap-4 col-span-2">
           <div className="relative flex-1"> 
             <ProjectImage src={safeImages[1]} alt="Project" orderIndex={1} showOrderLabel={showImageOrderLabels} />
           </div>
        </div>
        <div className="relative col-span-3 row-span-2">
          <ProjectImage src={safeImages[2]} alt="Project" orderIndex={2} showOrderLabel={showImageOrderLabels} />
        </div>
      </div>
    );
  }

  return null;
}
