"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface TransitionContextType {
  navigateWithHyperspace: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export const useTransition = () => {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("Missing TransitionProvider");
  return ctx;
};

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);

  const navigateWithHyperspace = (href: string) => {
    if (href === pathname || isTransitioning) {
      if (href !== pathname && !isTransitioning) {
        router.push(href);
      }
      return;
    }
    setTargetHref(href);
    setIsTransitioning(true);
  };

  useEffect(() => {
    if (isTransitioning && targetHref) {
      // Delay navigation to let the takeoff video play its initial part
      const timer = setTimeout(() => {
        router.push(targetHref);
      }, 1500); // 1.5s delay before actual navigation
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, targetHref, router]);

  useEffect(() => {
    // When pathname changes and we were waiting for it to load
    if (isTransitioning && targetHref && pathname === targetHref) {
      // Add a small delay to ensure the new page is fully rendered before fading out
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setTargetHref(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, isTransitioning, targetHref]);

  return (
    <TransitionContext.Provider value={{ navigateWithHyperspace }}>
      {children}
      
      {/* Hyperspace Transition Video */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="hyperspace-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-black pointer-events-none"
          >
            <video 
              src="/Skybox/Hyperspace%20kalkis.mp4" 
              autoPlay 
              muted 
              playsInline 
              loop
              className="w-full h-full object-cover" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
