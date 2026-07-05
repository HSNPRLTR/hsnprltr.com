"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import SubPageLayout from "@/components/SubPageLayout";
import ProjectRow from "@/components/ProjectRow";
import AboutMeSection from "@/components/AboutMeSection";
import SmokeEffect from "@/components/SmokeEffect";
import {
  getInhaledPastImages,
  getCarGameImages,
  getGameProjects,
} from "@/data/portfolioData";

// ── MovingSatellite ────────────────────────────────────────────────────────────
const MovingSatellite = ({ onClick }: { onClick: () => void }) => {
  const [isBlinking, setIsBlinking] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="relative w-full h-0 pointer-events-none select-none overflow-visible z-20">
      <motion.div
        className="absolute w-24 h-24 -translate-y-12 pointer-events-none"
        animate={{
          x: ["-15vw", "110vw", "110vw", "-15vw", "-15vw"],
          scaleX: [1, 1, -1, -1, 1],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.49, 0.50, 0.99, 1.0],
        }}
      >
        <motion.div
          className="w-full h-full cursor-pointer pointer-events-auto"
          onClick={() => { setIsBlinking(false); onClick(); }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={
            isHovered
              ? { scale: 1.25, opacity: 1, filter: "brightness(1.25) drop-shadow(0 0 15px rgba(34,211,238,0.8))" }
              : isBlinking
                ? { scale: 1, opacity: [0.4, 1, 0.4], filter: "brightness(1) drop-shadow(0 0 5px rgba(34,211,238,0.2))" }
                : { scale: 1, opacity: 1, filter: "brightness(1) drop-shadow(0 0 10px rgba(34,211,238,0.3))" }
          }
          transition={
            isHovered
              ? { type: "spring", stiffness: 300, damping: 15 }
              : isBlinking
                ? { opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0.3 } }
                : { duration: 0.3 }
          }
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Pulsing high-tech scanner rings */}
            <span className="absolute w-20 h-20 rounded-full border border-cyan-500/30 animate-ping opacity-60" />
            <span className="absolute w-14 h-14 rounded-full border-2 border-cyan-400/20 animate-pulse opacity-40" />
          </div>
          <Image src="/Satellite/uydu.png" alt="Satellite" fill className="object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" />
        </motion.div>
      </motion.div>
    </div>
  );
};

// ── BobbingShip ────────────────────────────────────────────────────────────────
const BobbingShip = ({ onClick }: { onClick: () => void }) => {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const randomLeft = React.useMemo(() => {
    if (!mounted) return '50%';
    // eslint-disable-next-line react-hooks/purity
    return `${Math.floor(Math.random() * 70) + 15}%`;
  }, [mounted]);
  const flipScaleX = React.useMemo(() => {
    if (!mounted) return 1;
    // eslint-disable-next-line react-hooks/purity
    return Math.random() < 0.5 ? -1 : 1;
  }, [mounted]);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="relative w-full h-0 pointer-events-none select-none overflow-visible z-20">
      <div
        className="absolute w-48 h-48 pointer-events-auto cursor-pointer flex items-center justify-center"
        style={{ left: randomLeft, transform: "translate(-50%, -6rem)" }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="w-full h-full relative"
          animate={{
            y: [-12, 12, -12],
            scale: isHovered ? 1.2 : 1,
            filter: isHovered
              ? "brightness(1.2) drop-shadow(0 0 25px rgba(34,211,238,0.8))"
              : "brightness(1) drop-shadow(0 0 0px rgba(34,211,238,0))"
          }}
          transition={{
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 300, damping: 20 },
            filter: { duration: 0.3 }
          }}
        >
          <Image src="/gallery/car game/gemi.png" alt="Gemi" fill className="object-contain drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]" style={{ transform: `scaleX(${flipScaleX})` }} />
        </motion.div>
      </div>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function MyGamesPage() {
  const { t } = useLanguage();
  const [isSatelliteModalOpen, setIsSatelliteModalOpen] = React.useState(false);
  const [isShipModalOpen, setIsShipModalOpen] = React.useState(false);
  const [enlargedImageSrc, setEnlargedImageSrc] = React.useState<string | null>(null);
  const [enlargedImageAspect, setEnlargedImageAspect] = React.useState("aspect-[3/4]");
  const [enlargedShipImageSrc, setEnlargedShipImageSrc] = React.useState<string | null>(null);
  const [openProjectModals, setOpenProjectModals] = React.useState<Record<string, boolean>>({});
  const [isMobileDevice] = React.useState(() => {
    const isMobileSize = typeof window !== 'undefined' && window.innerWidth < 768;
    const isMobileUA = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobileSize || isMobileUA;
  });

  const inhaledPastImages = getInhaledPastImages();
  const carGameImages = getCarGameImages();
  const gameProjects = getGameProjects(t);

  // keyboard navigation for lightboxes
  React.useEffect(() => {
    if (enlargedImageSrc === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setEnlargedImageSrc(null); return; }
      const currentIdx = inhaledPastImages.indexOf(enlargedImageSrc);
      if (currentIdx === -1) return;
      if (e.key === "ArrowRight") setEnlargedImageSrc(inhaledPastImages[(currentIdx + 1) % inhaledPastImages.length]);
      if (e.key === "ArrowLeft") setEnlargedImageSrc(inhaledPastImages[(currentIdx - 1 + inhaledPastImages.length) % inhaledPastImages.length]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enlargedImageSrc, inhaledPastImages]);

  React.useEffect(() => {
    if (enlargedShipImageSrc === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setEnlargedShipImageSrc(null); return; }
      const currentIdx = carGameImages.indexOf(enlargedShipImageSrc);
      if (currentIdx === -1) return;
      if (e.key === "ArrowRight") setEnlargedShipImageSrc(carGameImages[(currentIdx + 1) % carGameImages.length]);
      if (e.key === "ArrowLeft") setEnlargedShipImageSrc(carGameImages[(currentIdx - 1 + carGameImages.length) % carGameImages.length]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enlargedShipImageSrc, carGameImages]);

  const handleProjectModalToggle = React.useCallback((projectId: string, isOpen: boolean) => {
    setOpenProjectModals((prev) => {
      if (prev[projectId] === isOpen) return prev;
      return { ...prev, [projectId]: isOpen };
    });
  }, []);

  return (
    <SubPageLayout 
      skyboxPath={isMobileDevice ? undefined : "/Skybox/MyGames.jpg"}
      gradientClass={isMobileDevice ? "bg-gradient-to-b from-[#1C1D1F] via-[#121314] to-black" : undefined}
    >
      <SmokeEffect />
      <div id="games" className="overflow-x-hidden relative z-10">

        {/* About Me Section injected at the top */}
        <div>
          <AboutMeSection />
        </div>

        {/* Block 7: Hero 2 (OYUNLARIM) */}
        <section className="relative w-full h-screen flex flex-col items-center justify-center px-6 pointer-events-auto mt-20 mb-20">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-[10vw] font-bold font-orbitron text-white uppercase tracking-[0.2em] drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] text-center leading-none"
          >
            {t("games_title")}
          </motion.h1>
          <div className="w-32 h-2 bg-gray-500 mx-auto mt-12 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
        </section>

        {gameProjects.map((project) => (
          <React.Fragment key={project.id}>
            <ProjectRow
              {...project}
              onModalToggle={(isOpen) => handleProjectModalToggle(project.id, isOpen)}
            />
            {project.id === "justice" && (
              <MovingSatellite onClick={() => setIsSatelliteModalOpen(true)} />
            )}
            {project.id === "brokenheart" && (
              <BobbingShip onClick={() => setIsShipModalOpen(true)} />
            )}
          </React.Fragment>
        ))}

        {/* Footer spacer */}
        <div className="h-32" />
      </div>

      {/* ── Satellite Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isSatelliteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-xl"
            onClick={() => setIsSatelliteModalOpen(false)}
          >
            <div
              className="relative glass border border-cyan-500/30 bg-gradient-to-b from-slate-950/95 via-black/95 to-black p-6 md:p-10 rounded-2xl max-w-6xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col items-center gap-8 shadow-[0_0_40px_rgba(6,182,212,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sci-Fi HUD corner ticks */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-500/80 rounded-tl-sm pointer-events-none" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan-500/80 rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan-500/80 rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-500/80 rounded-br-sm pointer-events-none" />
              <div className="text-center space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold font-orbitron text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] uppercase tracking-wider">{t("modal_horror_title")}</h3>
                <h4 className="text-sm md:text-base font-rajdhani text-gray-300 font-medium tracking-widest uppercase">{t("modal_horror_sub")}</h4>
              </div>
              <div className="w-24 h-1 bg-cyan-500 mb-2" />
              <div className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                  {inhaledPastImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[210/297] w-full rounded-lg overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.4)] cursor-pointer group/screen"
                      onClick={() => { setEnlargedImageSrc(img); setEnlargedImageAspect("aspect-[210/297]"); }}
                    >
                      <Image src={img} alt={`Inhaled Past Screen ${idx + 1}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover/screen:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover/screen:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="font-orbitron text-[10px] text-cyan-400 bg-black/60 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">{t("row_buyut")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <a href="https://drive.google.com/file/d/1he4meeQ4ZD0Ef7Sz3PlQQ2nYC3Dn0apz/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="mt-2 flex flex-col items-center justify-center group/btn gap-1 text-center">
                <span className="font-orbitron text-lg text-cyan-400 group-hover:text-cyan-300 transition-colors uppercase tracking-[0.2em] font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">{t("modal_horror_report_btn")}</span>
                <span className="text-xs font-rajdhani text-white/40 group-hover:text-white/60 transition-colors">{t("row_pdf_yeni_sekme")}</span>
                <div className="w-0 group-hover/btn:w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent transition-all duration-500 mt-1" />
              </a>
              <button className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 z-[130]" onClick={() => setIsSatelliteModalOpen(false)}>
                <X size={28} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Poster Lightbox ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {enlargedImageSrc !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none"
            onClick={() => setEnlargedImageSrc(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 z-50" onClick={() => setEnlargedImageSrc(null)}><X size={28} /></button>
            <button className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all p-4 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-full hidden md:block cursor-pointer" onClick={(e) => { e.stopPropagation(); const i = inhaledPastImages.indexOf(enlargedImageSrc || ""); if (i !== -1) setEnlargedImageSrc(inhaledPastImages[(i - 1 + inhaledPastImages.length) % inhaledPastImages.length]); }}><ChevronLeft size={32} /></button>
            <motion.div key={enlargedImageSrc} drag={isMobileDevice ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6}
              onDragEnd={(e, info) => { const i = inhaledPastImages.indexOf(enlargedImageSrc || ""); if (i !== -1) { if (info.offset.x < -50) setEnlargedImageSrc(inhaledPastImages[(i + 1) % inhaledPastImages.length]); else if (info.offset.x > 50) setEnlargedImageSrc(inhaledPastImages[(i - 1 + inhaledPastImages.length) % inhaledPastImages.length]); } }}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
              className={`relative w-full max-w-[95vw] h-[96vh] flex items-center justify-center p-6 ${isMobileDevice ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} ${enlargedImageAspect}`}
              style={{ touchAction: "none" }} onClick={(e) => e.stopPropagation()}
            >
              <Image src={enlargedImageSrc || ""} alt="Enlarged Screenshot" fill className="object-contain drop-shadow-[0_0_50px_rgba(6,182,212,0.15)] pointer-events-none select-none" />
            </motion.div>
            <button className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all p-4 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-full hidden md:block cursor-pointer" onClick={(e) => { e.stopPropagation(); const i = inhaledPastImages.indexOf(enlargedImageSrc || ""); if (i !== -1) setEnlargedImageSrc(inhaledPastImages[(i + 1) % inhaledPastImages.length]); }}><ChevronRight size={32} /></button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-orbitron text-xs tracking-widest text-white/40 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              {(enlargedImageSrc ? inhaledPastImages.indexOf(enlargedImageSrc) : 0) + 1} / {inhaledPastImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Ship Modal ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isShipModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-xl"
            onClick={() => setIsShipModalOpen(false)}
          >
            <div className="glass border border-cyan-500/25 p-6 md:p-10 rounded-3xl max-w-6xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col gap-6 md:gap-8 relative" onClick={(e) => e.stopPropagation()}>
              <div className="text-center space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold font-orbitron text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] uppercase tracking-wider">{t("modal_car_title")}</h3>
              </div>
              <div className="w-24 h-1 bg-cyan-500 mx-auto -mt-2 mb-2" />
              <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
                <div className="flex-1 space-y-4 text-gray-300 font-rajdhani text-base md:text-lg leading-relaxed">
                  <p>{t("modal_car_p1")}</p>
                  <p>{t("modal_car_p2")}</p>
                  <p>{t("modal_car_p3")}</p>
                </div>
                <div className="flex-1 w-full flex flex-col gap-4">
                  <h4 className="text-lg font-orbitron text-cyan-400/90 font-bold uppercase tracking-wider border-b border-cyan-500/25 pb-2">{t("modal_screenshots")}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {carGameImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 cursor-pointer group/screen" onClick={() => setEnlargedShipImageSrc(img)}>
                        <Image src={img} alt={`Car Game Screen ${idx + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover/screen:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover/screen:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="font-orbitron text-[10px] text-cyan-400 bg-black/60 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">{t("row_buyut")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 z-[130]" onClick={() => setIsShipModalOpen(false)}><X size={28} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Ship Lightbox ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {enlargedShipImageSrc !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none"
            onClick={() => setEnlargedShipImageSrc(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 z-50" onClick={() => setEnlargedShipImageSrc(null)}><X size={28} /></button>
            <button className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all p-4 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-full hidden md:block cursor-pointer" onClick={(e) => { e.stopPropagation(); const i = carGameImages.indexOf(enlargedShipImageSrc || ""); if (i !== -1) setEnlargedShipImageSrc(carGameImages[(i - 1 + carGameImages.length) % carGameImages.length]); }}><ChevronLeft size={32} /></button>
            <motion.div key={enlargedShipImageSrc} drag={isMobileDevice ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6}
              onDragEnd={(e, info) => { const i = carGameImages.indexOf(enlargedShipImageSrc || ""); if (i !== -1) { if (info.offset.x < -50) setEnlargedShipImageSrc(carGameImages[(i + 1) % carGameImages.length]); else if (info.offset.x > 50) setEnlargedShipImageSrc(carGameImages[(i - 1 + carGameImages.length) % carGameImages.length]); } }}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
              className={`relative w-full max-w-[95vw] h-[96vh] flex items-center justify-center p-2 ${isMobileDevice ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
              style={{ touchAction: "none" }} onClick={(e) => e.stopPropagation()}
            >
              <Image src={enlargedShipImageSrc || ""} alt="Car Game Enlarged Screenshot" fill className="object-contain drop-shadow-[0_0_50px_rgba(6,182,212,0.15)] pointer-events-none select-none" />
            </motion.div>
            <button className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all p-4 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-full hidden md:block cursor-pointer" onClick={(e) => { e.stopPropagation(); const i = carGameImages.indexOf(enlargedShipImageSrc || ""); if (i !== -1) setEnlargedShipImageSrc(carGameImages[(i + 1) % carGameImages.length]); }}><ChevronRight size={32} /></button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-orbitron text-xs tracking-widest text-white/40 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              {(enlargedShipImageSrc ? carGameImages.indexOf(enlargedShipImageSrc) : 0) + 1} / {carGameImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SubPageLayout>
  );
}
