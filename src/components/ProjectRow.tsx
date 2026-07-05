"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ExternalLink, Gamepad2, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ProjectRowProps {
  id: string;
  title: string;
  description: string;
  planetImg: string;
  engine: string;
  gallery: string[];
  links?: { label: string; url: string; icon?: React.ReactNode }[];
  isReversed?: boolean;
  satellite?: {
    img: string;
    title: string;
    docImages: string[];
    docLink: string;
  };
  itchLink?: string;
  role?: string;
  gained?: string;
  onModalToggle?: (isOpen: boolean) => void;
  themeColor?: string;
}

export default function ProjectRow({
  id,
  title,
  description,
  planetImg,
  engine,
  gallery,
  links = [],
  isReversed = false,
  satellite,
  itchLink = "#",
  role = "",
  gained = "",
  onModalToggle,
  themeColor,
}: ProjectRowProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState<number | null>(null);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [activeDocImageIdx, setActiveDocImageIdx] = useState<number | null>(null);
  const { t } = useLanguage();

  const [isMobileDevice, setIsMobileDevice] = useState(() => {
    const isMobileSize = typeof window !== 'undefined' && window.innerWidth <= 1024;
    const isMobileUA = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobileSize || isMobileUA;
  });
  
  useEffect(() => {
    const handleResize = () => {
      const isMobileSize = window.innerWidth <= 1024;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobileDevice(isMobileSize || isMobileUA);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (activeImageIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActiveImageIdx((prev) => (prev !== null ? (prev + 1) % gallery.length : 0));
      } else if (e.key === "ArrowLeft") {
        setActiveImageIdx((prev) => (prev !== null ? (prev - 1 + gallery.length) % gallery.length : 0));
      } else if (e.key === "Escape") {
        setActiveImageIdx(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIdx, gallery.length]);

  useEffect(() => {
    if (activeDocImageIdx === null || !satellite) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActiveDocImageIdx((prev) => (prev !== null ? (prev + 1) % satellite.docImages.length : 0));
      } else if (e.key === "ArrowLeft") {
        setActiveDocImageIdx((prev) => (prev !== null ? (prev - 1 + satellite.docImages.length) % satellite.docImages.length : 0));
      } else if (e.key === "Escape") {
        setActiveDocImageIdx(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeDocImageIdx, satellite]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIdx((prev) => (prev !== null ? (prev - 1 + gallery.length) % gallery.length : 0));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIdx((prev) => (prev !== null ? (prev + 1) % gallery.length : 0));
  };

  const handleDocPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (satellite) {
      setActiveDocImageIdx((prev) => (prev !== null ? (prev - 1 + satellite.docImages.length) % satellite.docImages.length : 0));
    }
  };

  const handleDocNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (satellite) {
      setActiveDocImageIdx((prev) => (prev !== null ? (prev + 1) % satellite.docImages.length : 0));
    }
  };

  useEffect(() => {
    if (!isGalleryOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveImageIdx(null);
    }
  }, [isGalleryOpen]);

  useEffect(() => {
    if (!isDocOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveDocImageIdx(null);
    }
  }, [isDocOpen]);

  const modalToggleRef = React.useRef(onModalToggle);
  React.useEffect(() => {
    modalToggleRef.current = onModalToggle;
  }, [onModalToggle]);

  useEffect(() => {
    const handleCloseLocalModals = () => {
      setIsGalleryOpen(false);
      setIsDocOpen(false);
      setActiveImageIdx(null);
      setActiveDocImageIdx(null);
    };

    window.addEventListener("close-local-modals", handleCloseLocalModals);
    return () => {
      window.removeEventListener("close-local-modals", handleCloseLocalModals);
    };
  }, []);

  useEffect(() => {
    const isOpen = isGalleryOpen || isDocOpen || activeImageIdx !== null || activeDocImageIdx !== null;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    if (modalToggleRef.current) {
      modalToggleRef.current(isOpen);
    }
    return () => {
      document.body.style.overflow = "unset";
      if (modalToggleRef.current) {
        modalToggleRef.current(false);
      }
    };
  }, [isGalleryOpen, isDocOpen, activeImageIdx, activeDocImageIdx]);

  const hasGallery = gallery && gallery.length > 0;

  return (
    <section 
      id={id} 
      className="min-h-screen flex items-center justify-center py-20 px-6"
      onMouseEnter={() => {
        if (typeof window !== "undefined" && themeColor) {
          (window as any).setSmokeColor?.(themeColor);
        }
      }}
      onMouseLeave={() => {
        if (typeof window !== "undefined") {
          (window as any).resetSmokeColor?.();
        }
      }}
    >
      <div className={`container mx-auto flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>

        {/* Left Side: Visuals */}
        <div className="flex-1 relative w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square w-full max-w-[500px] mx-auto"
          >
            {/* Planet Image (Clickable, Glows & Scales on Hover) */}
            <motion.div
              onClick={() => hasGallery && setIsGalleryOpen(true)}
              className={`absolute inset-0 z-0 rounded-full flex items-center justify-center ${hasGallery ? 'cursor-pointer' : 'cursor-default'}`}
              style={{ filter: "brightness(1) drop-shadow(0 0 0px rgba(0,0,0,0))" }}
              whileHover={hasGallery ? {
                scale: 1.05,
                filter: `brightness(1.12) drop-shadow(0 0 25px ${themeColor ? themeColor + '99' : 'rgba(34,211,238,0.6)'})`
              } : undefined}
              whileTap={hasGallery ? {
                scale: 0.98
              } : undefined}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0 }}
            >
              <div 
                className="w-full h-full rounded-full blur-3xl absolute inset-0 scale-110 pointer-events-none animate-pulse" 
                style={{ backgroundColor: themeColor ? `${themeColor}40` : "rgba(6,182,212,0.2)" }} 
              />
              <Image
                src={planetImg}
                alt={`${title} Planet`}
                fill
                className="object-contain pointer-events-none"
                style={{ filter: themeColor ? `drop-shadow(0 0 30px ${themeColor}60)` : "drop-shadow(0 0 30px rgba(34,211,238,0.3))" }}
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </motion.div>

            {/* Orbiting Satellite Moon */}
            {satellite && (
              <div className="absolute inset-[-40px] pointer-events-none select-none overflow-visible z-10">
                <motion.div
                  className="w-full h-full relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div
                    className="absolute w-14 h-14 cursor-pointer pointer-events-auto rounded-full -mt-7 -ml-7"
                    style={{
                      top: "12%",
                      left: "12%",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDocOpen(true);
                    }}
                    whileHover={{
                      scale: 1.2,
                      boxShadow: "0 0 20px rgba(34,211,238,0.4)",
                      transition: { type: "spring", stiffness: 300, damping: 20, delay: 0 }
                    }}
                  >
                    <Image
                      src={satellite.img}
                      alt="Satellite Moon"
                      fill
                      className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                    />
                    {/* Glowing HUD ring on mobile/desktop */}
                    <div className="absolute inset-0 rounded-full border border-cyan-500/40 animate-ping opacity-60 pointer-events-none" />
                    <div className="absolute inset-[-4px] rounded-full border border-cyan-400/20 animate-pulse pointer-events-none" />
                  </motion.div>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Click for Gallery Text */}
          {hasGallery && (
            <motion.div
              onClick={() => hasGallery && setIsGalleryOpen(true)}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center mt-4 font-orbitron text-[10px] uppercase tracking-[0.3em] cursor-pointer transition-colors pointer-events-auto select-none"
              style={{ color: themeColor ? `${themeColor}99` : "rgba(34,211,238,0.6)" }}
            >
              {t("row_galeri_tıkla")}
            </motion.div>
          )}
        </div>

        {/* Right Side: Information */}
        <div className="flex-1 space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: isReversed ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {title}
            </h2>
            <div className="w-20 h-1 mb-6" style={{ backgroundColor: themeColor || "#06b6d4" }} />

            <p className="text-lg md:text-xl font-rajdhani text-gray-300 leading-relaxed max-w-xl">
              {description}
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-4 mt-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-orbitron uppercase tracking-wider" style={{ color: themeColor ? `${themeColor}80` : "rgba(34,211,238,0.5)" }}>{t("row_motor_dil")}</span>
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-rajdhani text-white w-fit font-semibold">
                  {engine}
                </span>
              </div>
              {role && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-orbitron uppercase tracking-wider" style={{ color: themeColor ? `${themeColor}80` : "rgba(34,211,238,0.5)" }}>{t("row_rol")}</span>
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-rajdhani text-white w-fit font-semibold">
                    {role}
                  </span>
                </div>
              )}
              {gained && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-orbitron uppercase tracking-wider" style={{ color: themeColor ? `${themeColor}80` : "rgba(34,211,238,0.5)" }}>{t("row_kazanim")}</span>
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-rajdhani text-white w-fit font-semibold">
                    {gained}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              {links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:shadow-lg transition-all font-orbitron text-xs uppercase tracking-widest rounded-sm"
                  style={{ borderColor: themeColor || "#06b6d4", color: themeColor || "#22d3ee", borderWidth: "1px" }}
                >
                  {link.icon || <ExternalLink size={14} />}
                  {link.label}
                </a>
              ))}
              <a
                href={itchLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 group transition-all font-orbitron text-xs uppercase tracking-widest rounded-sm relative overflow-hidden"
                style={{ borderColor: themeColor ? `${themeColor}80` : "rgba(6,182,212,0.3)", color: themeColor || "#22d3ee", borderWidth: "1px" }}
              >
                <Gamepad2 size={14} className="relative z-10" />
                <span className="relative z-10">{t("row_itch_incele")}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-xl"
            onClick={() => setIsGalleryOpen(false)}
          >
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-40"
              onClick={() => setIsGalleryOpen(false)}
            >
              <X size={32} />
            </button>

            <div className="container max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[80vh] p-4 custom-scrollbar">
              {gallery.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative aspect-video rounded-lg overflow-hidden border border-white/10 cursor-pointer group/item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx(idx);
                  }}
                >
                  <Image src={img} alt={`${title} screenshot ${idx}`} fill className="object-cover group-hover/item:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="font-orbitron text-xs text-cyan-400 bg-black/60 border border-cyan-500/30 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                      {t("row_buyut")}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {activeImageIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none"
            onClick={() => setActiveImageIdx(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 z-50"
              onClick={() => setActiveImageIdx(null)}
            >
              <X size={28} />
            </button>

             {/* Left Control Arrow */}
             <button
               className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all p-4 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/60 z-50 shadow-[0_0_20px_rgba(6,182,212,0.35)] rounded-full hidden md:block cursor-pointer"
               onClick={handlePrev}
             >
               <ChevronLeft size={32} />
             </button>
 
             <motion.div
               key={activeImageIdx}
               drag={isMobileDevice ? "x" : false}
               dragConstraints={{ left: 0, right: 0 }}
               dragElastic={0.6}
               onDragEnd={(e, info) => {
                 if (info.offset.x < -50) {
                   handleNext();
                 } else if (info.offset.x > 50) {
                   handlePrev();
                 }
               }}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.3 }}
               className={`relative w-full max-w-5xl h-[80vh] flex items-center justify-center p-4 ${isMobileDevice ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
               style={{ touchAction: "none" }}
               onClick={(e) => e.stopPropagation()}
             >
               <Image
                 src={gallery[activeImageIdx]}
                 alt={`${title} screenshot large ${activeImageIdx}`}
                 fill
                 className="object-contain drop-shadow-[0_0_50px_rgba(6,182,212,0.15)] pointer-events-none select-none"
                 sizes="(max-width: 1200px) 100vw, 1200px"
                 priority
               />
             </motion.div>
 
             {/* Right Control Arrow */}
             <button
               className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all p-4 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/60 z-50 shadow-[0_0_20px_rgba(6,182,212,0.35)] rounded-full hidden md:block cursor-pointer"
               onClick={handleNext}
             >
               <ChevronRight size={32} />
             </button>

            {/* Image Indicator / Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-orbitron text-xs tracking-widest text-white/40 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              {activeImageIdx + 1} / {gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Documentation Modal */}
      <AnimatePresence>
        {isDocOpen && satellite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-xl"
            onClick={() => setIsDocOpen(false)}
          >
             <div
              className="relative glass border border-cyan-500/30 bg-gradient-to-b from-slate-950/95 via-black/95 to-black p-6 md:p-10 rounded-2xl max-w-6xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col items-center gap-8 shadow-[0_0_40px_rgba(6,182,212,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button inside glass container */}
              <button
                className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 z-50"
                onClick={() => setIsDocOpen(false)}
              >
                <X size={24} />
              </button>
              {/* Sci-Fi HUD corner ticks */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-500/80 rounded-tl-sm pointer-events-none" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan-500/80 rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan-500/80 rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-500/80 rounded-br-sm pointer-events-none" />
              {/* Title */}
              <h3 className="text-3xl md:text-4xl font-bold font-orbitron text-center text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                {satellite.title}
              </h3>
              <div className="w-24 h-1 bg-cyan-500 -mt-4 mb-2" />

              {/* A4 Images displayed side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
                {satellite.docImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[210/297] w-full rounded-xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer group/doc"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDocImageIdx(idx);
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Doc image ${idx + 1}`}
                      fill
                      className="object-cover group-hover/doc:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="font-orbitron text-xs text-cyan-400 bg-black/60 border border-cyan-500/30 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                        {t("row_buyut")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* PDF Document link */}
              <a
                href={satellite.docLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex flex-col items-center justify-center group/btn gap-2 text-center"
              >
                <span className="font-orbitron text-lg md:text-xl text-cyan-400 group-hover:text-cyan-300 transition-colors uppercase tracking-[0.2em] font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                  {t("row_pdf_tikla")}
                </span>
                <span className="text-xs font-rajdhani text-white/40 group-hover:text-white/60 transition-colors">
                  {t("row_pdf_yeni_sekme")}
                </span>
                <div className="w-0 group-hover/btn:w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent transition-all duration-500 mt-1" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Lightbox Overlay */}
      <AnimatePresence>
        {activeDocImageIdx !== null && satellite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none"
            onClick={() => setActiveDocImageIdx(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 z-50"
              onClick={() => setActiveDocImageIdx(null)}
            >
              <X size={28} />
            </button>

            {/* Left Control Arrow */}
            <button
              className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all p-4 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/60 z-50 shadow-[0_0_20px_rgba(6,182,212,0.35)] rounded-full hidden md:block cursor-pointer"
              onClick={handleDocPrev}
            >
              <ChevronLeft size={32} />
            </button>

            {/* Main Image Container */}
            <motion.div
              key={activeDocImageIdx}
              drag={isMobileDevice ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(e, info) => {
                if (info.offset.x < -50) {
                  handleDocNext();
                } else if (info.offset.x > 50) {
                  handleDocPrev();
                }
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`relative w-full max-w-[90vw] md:max-w-2xl h-[80vh] flex items-center justify-center p-3 ${isMobileDevice ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
              style={{ touchAction: "none" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={satellite.docImages[activeDocImageIdx]}
                alt={`Doc large ${activeDocImageIdx + 1}`}
                fill
                className="object-contain drop-shadow-[0_0_50px_rgba(6,182,212,0.15)] pointer-events-none select-none"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </motion.div>

            {/* Right Control Arrow */}
            <button
              className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all p-4 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/60 z-50 shadow-[0_0_20px_rgba(6,182,212,0.35)] rounded-full hidden md:block cursor-pointer"
              onClick={handleDocNext}
            >
              <ChevronRight size={32} />
            </button>

            {/* Image Indicator / Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-orbitron text-xs tracking-widest text-white/40 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              {activeDocImageIdx + 1} / {satellite.docImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
