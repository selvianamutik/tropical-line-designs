"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INTRO_STORAGE_KEY = "has-seen-intro-v1";
const INTRO_RESET_INTERVAL_MS = 5 * 60 * 1000;
const REMOTE_INTRO_VIDEO_URL = "https://raw.githubusercontent.com/selvianamutik/tropical-line-designs/main/intro(1).mp4";
const LOCAL_INTRO_VIDEO_URL = "/intro.mp4";

export function IntroOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [videoSrc, setVideoSrc] = useState(REMOTE_INTRO_VIDEO_URL);

  useEffect(() => {
    setIsMounted(true);
    const seenIntroAt = localStorage.getItem(INTRO_STORAGE_KEY);
    const hasActiveSeenState =
      seenIntroAt !== null &&
      Number.isFinite(Number(seenIntroAt)) &&
      Date.now() - Number(seenIntroAt) < INTRO_RESET_INTERVAL_MS;

    if (!hasActiveSeenState) {
      localStorage.removeItem(INTRO_STORAGE_KEY);
      // Small delay to ensure smooth mounting
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Prevent scrolling while intro is active
        document.body.style.overflow = "hidden";
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(INTRO_STORAGE_KEY, Date.now().toString());
    // Restore scrolling
    document.body.style.overflow = "";
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ 
            y: "-100%",
            transition: { duration: 1.2, ease: [0.83, 0, 0.17, 1] }
          }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] overflow-hidden cursor-pointer"
          onClick={handleDismiss}
        >
          {/* Video Background with Overlay */}
          <div className="absolute inset-0 w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover scale-[1.05]"
              style={{ filter: "brightness(0.7) contrast(1.1)" }}
              onError={() => {
                if (videoSrc !== LOCAL_INTRO_VIDEO_URL) {
                  setVideoSrc(LOCAL_INTRO_VIDEO_URL);
                }
              }}
            >
              <source src={videoSrc} type="video/mp4" />
              {/* Fallback image if video fails or for testing */}
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" 
                className="w-full h-full object-cover" 
                alt="Intro Background"
              />
            </video>
            
            {/* Elegant Gradient Overlays */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
            <div className="absolute inset-0 bg-black/20" /> */}
          </div>
          
          {/* Content Layer */}
          <div className="relative h-full w-full flex flex-col items-center justify-center px-6 text-center">
            <div className="max-w-4xl w-full">
              {/* Decorative Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-[1px] w-24 bg-white/30 mx-auto mb-12"
              />

              {/* Main Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <h1 className="text-5xl md:text-8xl font-light tracking-[-0.03em] text-white uppercase font-sans">
                  Tropical Line <span className="font-bold italic">Design</span>
                </h1>
                <p className="text-sm md:text-base text-white/50 tracking-[0.5em] uppercase font-inter">
                  Integrated Corporate Identity
                </p>
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
              >
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-medium">
                  Click anywhere to explore
                </span>
                
                {/* Animated Mouse/Scroll Icon */}
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent relative overflow-hidden">
                  <motion.div 
                    animate={{ 
                      y: [0, 48],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-0 left-0 w-full h-4 bg-white"
                  />
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Subtle Corner Accents for Premium Look */}
          <div className="absolute top-10 left-10 w-8 h-8 border-t border-l border-white/20" />
          <div className="absolute top-10 right-10 w-8 h-8 border-t border-r border-white/20" />
          <div className="absolute bottom-10 left-10 w-8 h-8 border-b border-l border-white/20" />
          <div className="absolute bottom-10 right-10 w-8 h-8 border-b border-r border-white/20" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
