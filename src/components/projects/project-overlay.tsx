"use client";

import Image from "next/image";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectRecord, GalleryLayout } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectOverlayProps {
  project: ProjectRecord;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function ProjectOverlay({
  project,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: ProjectOverlayProps) {
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
        className="fixed inset-0 z-[2000] bg-white overflow-y-auto"
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

        {/* Mobile Layout (Simplified & Aesthetic) */}
        <div className="flex flex-col md:hidden pb-32">
          {/* Hero Image */}
          <motion.div 
            layoutId={`image-${project.slug}`}
            className="relative aspect-[4/5] w-full bg-[#f8f3ea]"
          >
            <Image 
              src={project.image} 
              alt={project.title} 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-8 left-6 right-6 text-white">
              <h1 className="text-3xl font-bold uppercase tracking-tight leading-none mb-2">
                {project.title}
              </h1>
              <p className="text-sm uppercase tracking-widest opacity-90">
                {project.location}
              </p>
            </div>
          </motion.div>

          {/* Project Details */}
          <div className="p-8 bg-white">
            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              {project.type && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#8a867f]">Type</span>
                  <span className="text-sm font-bold text-[#1a1a1a] uppercase">{project.type}</span>
                </div>
              )}
              {project.status && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#8a867f]">Status</span>
                  <span className="text-sm font-bold text-[#1a1a1a] uppercase">{project.status}</span>
                </div>
              )}
              {project.year && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#8a867f]">Date</span>
                  <span className="text-sm font-bold text-[#1a1a1a] uppercase">{project.year}</span>
                </div>
              )}
              {project.client && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#8a867f]">Client</span>
                  <span className="text-sm font-bold text-[#1a1a1a] uppercase">{project.client}</span>
                </div>
              )}
            </div>
            
            {project.description && (
              <div className="mt-12 pt-12 border-t border-[#d9d4ca]">
                <p className="text-base leading-relaxed text-[#383532]">
                  {project.description}
                </p>
              </div>
            )}
          </div>

          {/* Simple Gallery Stack */}
          <div className="flex flex-col gap-4 px-4 bg-white">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-video w-full rounded-sm overflow-hidden bg-[#f8f3ea]">
                <Image src={img} alt={`${project.title} ${i}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout (Complex Grid) */}
        <div className={cn(
          "hidden md:flex min-h-screen w-full flex-col relative", 
          layout === "H" ? "md:flex-row-reverse" : "md:flex-row"
        )}>
          {/* Left Info Section */}
          <div className={cn(
            "w-full md:w-[35%] p-8 md:p-16 flex flex-col gap-12 order-2 md:order-1",
            layout === "B" ? "justify-end" : "justify-between"
          )}>
            <div className="flex flex-col gap-2">
              <h1 className={cn(
                "text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#1a1a1a]",
                layout !== "H" && "md:text-end"
              )}>
                {project.title}
              </h1>
              <h2 className={cn(
                "text-xl md:text-2xl uppercase tracking-widest text-[#8a867f]",
                layout !== "H" && "md:text-end"
              )}>
                {project.location}
              </h2>
              <div className="w-full h-[1px] bg-[#d9d4ca] mt-4" />
            </div>

            <div className={cn(
              "grid grid-cols-1 gap-6 text-[11px] uppercase tracking-[0.2em]",
              layout !== "H" && "md:text-end"
            )}>
              {project.type && (
                <div className="flex flex-col gap-1">
                  <span className="text-[#8a867f] font-medium">Project Type</span>
                  <span className="text-[#383532] font-bold">{project.type}</span>
                </div>
              )}
              {project.status && (
                <div className="flex flex-col gap-1">
                  <span className="text-[#8a867f] font-medium">Status</span>
                  <span className="text-[#383532] font-bold">{project.status}</span>
                </div>
              )}
              {project.year && (
                <div className="flex flex-col gap-1">
                  <span className="text-[#8a867f] font-medium">Date</span>
                  <span className="text-[#383532] font-bold">{project.year}</span>
                </div>
              )}
              {(project.architect || project.landscapeConsultant) && (
                <div className="flex flex-col gap-1">
                  <span className="text-[#8a867f] font-medium">
                    {project.landscapeConsultant ? "Landscape Consultant" : "Architect"}
                  </span>
                  <span className="text-[#383532] font-bold">
                    {project.landscapeConsultant || project.architect}
                  </span>
                </div>
              )}
              {project.client && (
                <div className="flex flex-col gap-1">
                  <span className="text-[#8a867f] font-medium">Client</span>
                  <span className="text-[#383532] font-bold">{project.client}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Gallery Section */}
          <motion.div 
            layoutId={`image-${project.slug}`}
            className={`"w-full md:w-[65%] h-full min-h-screen bg-[#FDFBF7] order-1 md:order-2 flex items-center justify-center" ${layout === "H" ? "md:justify-end" :"md:justify-start"}`}
          >
             <ProjectGalleryTemplate layout={layout} images={images} />
          </motion.div>
        </div>

        {/* Bottom Footer Navigation (Shared for both, but positioned differently) */}
        <div className="fixed bottom-0 inset-x-0 z-[2010] flex justify-between items-center p-6 md:p-10 pointer-events-none">
          <button 
            onClick={onPrev}
            className="pointer-events-auto flex items-center gap-2 group text-[11px] md:text-[13px] uppercase tracking-[0.2em] font-bold bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-0 px-4 py-2 md:p-0 rounded-full md:rounded-none shadow-md md:shadow-none"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Prev</span>
          </button>
          <button 
            onClick={onNext}
            className="pointer-events-auto flex items-center gap-2 group text-[11px] md:text-[13px] uppercase tracking-[0.2em] font-bold bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-0 px-4 py-2 md:p-0 rounded-full md:rounded-none shadow-md md:shadow-none"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProjectGalleryTemplate({ layout, images }: { layout: GalleryLayout; images: string[] }) {
  // Pad images array to ensure we have enough for layouts
  const safeImages = [...images];
  while (safeImages.length < 4) safeImages.push(images[0]);

  if (layout === "A") {
    // Template A (Anantara style): Big top, long left, two small right stacked
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-4 h-screen w-[90%] aspect-square md:aspect-auto">
        <div className="relative col-span-2 row-span-1">
          <Image src={safeImages[0]} alt="Project" fill className="object-cover" />
        </div>
        <div className="relative col-span-1 row-span-1">
          <Image src={safeImages[1]} alt="Project" fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-4">
           <div className="relative flex-1">
             <Image src={safeImages[2]} alt="Project" fill className="object-cover" />
           </div>
           <div className="relative flex-1">
             <Image src={safeImages[3]} alt="Project" fill className="object-cover" />
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
            <Image src={safeImages[0]} alt="Project" fill className="object-cover" />
          </div>
          <div className="relative">
            <Image src={safeImages[1]} alt="Project" fill className="object-cover" />
          </div>
        </div>
        <div className=""></div>
        <div className="grid grid-cols-3 grid-rows-3 relative gap-4 h-[63%]">
          <div className="relative col-start-2 col-span-2 row-span-2 border-t-[12px] border-l-[12px] border-white">
            <Image src={safeImages[3]} alt="Project" fill className="object-cover" />
          </div>
          <div className="relative row-start-3">
            <div className="absolute bottom-0 w-[500px] h-[300px] border-r-[12px] border-t-[12px] border-white">
              <Image src={safeImages[2]} alt="Project" fill className="object-cover" />
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
          <Image src={safeImages[0]} alt="Project" fill className="object-cover" />
        </div>
        <div className="relative col-span-1 row-span-1">
          <Image src={safeImages[1]} alt="Project" fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-4">
           <div className="relative flex-1"> 
             <Image src={safeImages[2]} alt="Project" fill className="object-cover" />
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
            <Image src={safeImages[0]} alt="Project" fill className="object-cover" />
         </div>
         {/* Subtle floating detail (optional layout variation)
         <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-1/2 hidden md:block border-8 border-white shadow-xl">
         <Image src={safeImages[1]} alt="Project" fill className="object-cover" />
         </div> */}
      </div>
    );
  }
  
  if (layout === "E") {
    // Template A (Anantara style): Big top, long left, two small right stacked
    return (
      <div className="grid grid-cols-2 grid-rows-2 relative gap-4 h-screen w-[90%] aspect-square md:aspect-auto">
        <div className="relative col-span-2 row-span-1">
          <Image src={safeImages[0]} alt="Project" fill className="object-cover" />
        </div>
        <div className="relative col-span-1 row-span-1">
          <Image src={safeImages[1]} alt="Project" fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-4">
           <div className="relative h-[290px] mt-auto">
             <Image src={safeImages[2]} alt="Project" fill className="object-cover" />
           </div>
          <div className="absolute top-[55%] right-0 -translate-y-1/2 w-[60%] h-[40%] hidden md:block border-l-[12px] border-y-[12px] border-white">
            <Image src={safeImages[3]} alt="Project" fill className="object-cover" />
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
          <Image src={safeImages[0]} alt="Project" fill className="object-cover" />
        </div>
        <div className="absolute flex flex-col gap-4 w-full h-full z-10">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[60%] h-[40%] hidden md:block border-l-[12px] border-y-[12px] border-white">
            <Image src={safeImages[2]} alt="Project" fill className="object-cover" />
          </div>
        </div>
        <div className="relative col-span-2 row-span-1">
          <Image src={safeImages[1]} alt="Project" fill className="object-cover" />
        </div>
      </div>
    );
  }

  if (layout === "G") {
    // Template C (Sofitel style): Big top, one square left, two small right stacked
    return (
      <div className="grid grid-cols-2 grid-rows-3 gap-4 h-screen w-[90%] aspect-square md:aspect-auto">
        <div className="relative col-span-2 row-span-1">
          <Image src={safeImages[0]} alt="Project" fill className="object-cover" />
        </div>
        <div className="relative col-span-1 row-span-1">
          <Image src={safeImages[1]} alt="Project" fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-4">
           <div className="relative flex-1"> 
             <Image src={safeImages[2]} alt="Project" fill className="object-cover" />
           </div>
        </div>
        <div className="relative col-span-2 row-span-1">
          <Image src={safeImages[3]} alt="Project" fill className="object-cover" />
        </div>
      </div>
    );
  }
   
  if (layout === "H") {
    // Template C (Sofitel style): Big top, one square left, two small right stacked
    return (
      <div className="grid grid-cols-2 grid-rows-3 gap-4 h-screen w-[90%] aspect-square md:aspect-auto float-end">
        <div className="relative col-span-2 row-span-1">
          <Image src={safeImages[0]} alt="Project" fill className="object-cover" />
        </div>
        <div className="relative col-span-2 row-span-1">
          <Image src={safeImages[1]} alt="Project" fill className="object-cover" />
        </div>
        <div className="relative col-span-2 row-span-1">
          <Image src={safeImages[2]} alt="Project" fill className="object-cover" />
        </div>
      </div>
    );
  }

  if (layout === "I") {
    // Template C (Sofitel style): Big top, one square left, two small right stacked
    return (
      <div className="grid grid-cols-3 grid-rows-3 gap-4 h-screen w-[90%] aspect-square md:aspect-auto">
        <div className="relative col-span-2 row-span-1">
          <Image src={safeImages[0]} alt="Project" fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-4">
           <div className="relative flex-1"> 
             <Image src={safeImages[1]} alt="Project" fill className="object-cover" />
           </div>
        </div>
        <div className="relative col-span-3 row-span-2">
          <Image src={safeImages[2]} alt="Project" fill className="object-cover" />
        </div>
      </div>
    );
  }
  if (layout === "J") {
    // Template C (Sofitel style): Big top, one square left, two small right stacked
    return (
      <div className="grid grid-cols-3 grid-rows-3 gap-4 h-screen w-[90%] aspect-square md:aspect-auto">
        <div className="relative col-span-1 row-span-1">
          <Image src={safeImages[0]} alt="Project" fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-4 col-span-2">
           <div className="relative flex-1"> 
             <Image src={safeImages[1]} alt="Project" fill className="object-cover" />
           </div>
        </div>
        <div className="relative col-span-3 row-span-2">
          <Image src={safeImages[2]} alt="Project" fill className="object-cover" />
        </div>
      </div>
    );
  }

  return null;
}
