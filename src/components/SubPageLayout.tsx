"use client";

import React from "react";
import { useTransition } from "@/context/TransitionContext";
import { motion } from "framer-motion";
import ThreeStarfield from "@/components/ThreeStarfield";
import LanguageToggle from "@/components/LanguageToggle";
import PlanetNavFooter from "@/components/PlanetNavFooter";

interface SubPageLayoutProps {
  children: React.ReactNode;
  /** Optional extra CSS classes for the gradient overlay (themed per sub-page) */
  gradientClass?: string;
  skyboxPath?: string;
  skyboxRotationY?: number;
  autoRotateSkybox?: boolean;
}

export default function SubPageLayout({ children, gradientClass, skyboxPath, skyboxRotationY, autoRotateSkybox }: SubPageLayoutProps) {
  const { navigateWithHyperspace } = useTransition();

  return (
    <div className="relative min-h-screen text-white selection:bg-cyan-500/30">
      {/* Shared space starfield background */}
      <ThreeStarfield skyboxPath={skyboxPath} skyboxRotationY={skyboxRotationY} autoRotateSkybox={autoRotateSkybox} />

      {/* Optional per-route themed gradient overlay */}
      {gradientClass && (
        <div className={`fixed inset-0 pointer-events-none -z-[5] ${gradientClass}`} />
      )}

      {/* Fixed top-left: Return to Orbit button */}
      <motion.button
        id="return-to-orbit-btn"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        onClick={() => navigateWithHyperspace("/")}
        className="fixed top-5 left-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400/70 hover:bg-cyan-950/60 transition-all duration-300 group shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer"
        aria-label="Return to orbit"
      >
        {/* Animated orbit icon */}
        <svg
          className="w-4 h-4 text-cyan-400 group-hover:rotate-[-20deg] transition-transform duration-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="M2 12a10 10 0 0 0 20 0" />
        </svg>
        <span className="font-orbitron text-[10px] uppercase tracking-widest text-cyan-400 group-hover:text-cyan-300 transition-colors hidden sm:inline">
          Yörüngeye Dön
        </span>
      </motion.button>

      {/* Language toggle, shifted right to not overlap return button */}
      <div className="fixed top-5 right-5 z-50">
        <LanguageToggle />
      </div>

      {/* Page content */}
      <div className="relative z-10 flex flex-col min-h-[100dvh]">
        <div className="flex-grow">
          {children}
        </div>
        <PlanetNavFooter />
      </div>
    </div>
  );
}
