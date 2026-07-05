"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageToggleProps {
  inline?: boolean;
}

export default function LanguageToggle({ inline = false }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const [scrollY, setScrollY] = React.useState(() => 
    typeof window !== 'undefined' ? window.scrollY : 0
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const handleMobileMenuToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsMobileMenuOpen(!!customEvent.detail?.open);
    };
    window.addEventListener("mobile-menu-toggle", handleMobileMenuToggle);
    return () => window.removeEventListener("mobile-menu-toggle", handleMobileMenuToggle);
  }, []);

  const isEnglish = language === "en";

  const toggleLanguage = () => {
    setLanguage(isEnglish ? "tr" : "en");
  };

  const isScrolled = scrollY > 20;

  if (inline) {
    return (
      <div className="flex items-center select-none">
        <div 
          onClick={toggleLanguage}
          className="w-[76px] h-9 bg-cyan-950/20 border border-cyan-500/35 rounded-full p-[3px] flex items-center cursor-pointer relative shadow-[0_0_10px_rgba(6,182,212,0.15)] hover:border-cyan-400/80 transition-colors duration-300"
          title={isEnglish ? "Switch to Turkish" : "Türkçe'ye Geç"}
        >
          {/* Sliding indicator */}
          <motion.div
            className="absolute top-[2px] bottom-[2px] w-[34px] bg-gradient-to-r from-cyan-500/80 to-purple-600/80 border border-cyan-300/40 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            animate={{
              x: isEnglish ? 0 : 36,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          />

          {/* Labels */}
          <div className="flex justify-between w-full font-orbitron text-[10px] font-bold tracking-wider relative z-10 px-[9px] pointer-events-none">
            <span 
              className={`transition-colors duration-300 flex items-center justify-center w-[34px] h-[30px] ${
                isEnglish ? "text-black" : "text-gray-400/80"
              }`}
            >
              EN
            </span>
            <span 
              className={`transition-colors duration-300 flex items-center justify-center w-[34px] h-[30px] ${
                !isEnglish ? "text-black" : "text-gray-400/80"
              }`}
            >
              TR
            </span>
          </div>
        </div>
      </div>
    );
  }

  const showOnMobile = !isScrolled || isMobileMenuOpen;
  const showOnDesktop = !isScrolled;

  return (
    <div 
      className={`fixed z-[99999] flex items-center select-none transition-all duration-300 ${
        isMobileMenuOpen ? "top-6 right-24" : (isScrolled ? "top-6 right-24" : "top-6 right-6")
      } ${
        showOnMobile ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      } ${
        showOnDesktop ? "lg:opacity-100 lg:pointer-events-auto" : "lg:opacity-0 lg:pointer-events-none"
      }`}
    >
      <div 
        onClick={toggleLanguage}
        className="w-[76px] h-9 bg-black/60 backdrop-blur-md border border-cyan-500/35 rounded-full p-[3px] flex items-center cursor-pointer relative shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:border-cyan-400/80 transition-colors duration-300"
        title={isEnglish ? "Switch to Turkish" : "Türkçe'ye Geç"}
      >
        {/* Sliding indicator */}
        <motion.div
          className="absolute top-[2px] bottom-[2px] w-[34px] bg-gradient-to-r from-cyan-500/80 to-purple-600/80 border border-cyan-300/40 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          animate={{
            x: isEnglish ? 0 : 36,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        />

        {/* Labels */}
        <div className="flex justify-between w-full font-orbitron text-[10px] font-bold tracking-wider relative z-10 px-[9px] pointer-events-none">
          <span 
            className={`transition-colors duration-300 flex items-center justify-center w-[34px] h-[30px] ${
              isEnglish ? "text-black" : "text-gray-400/80"
            }`}
          >
            EN
          </span>
          <span 
            className={`transition-colors duration-300 flex items-center justify-center w-[34px] h-[30px] ${
              !isEnglish ? "text-black" : "text-gray-400/80"
            }`}
          >
            TR
          </span>
        </div>
      </div>
    </div>
  );
}
