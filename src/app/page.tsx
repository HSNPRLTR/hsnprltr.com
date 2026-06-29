"use client";

import React from "react";
import ThreeStarfield from "@/components/ThreeStarfield";
import PlanetModel from "@/components/PlanetModel";
import ProjectRow from "@/components/ProjectRow";
import Navbar from "@/components/Navbar";
import SocialSection from "@/components/SocialSection";
import { Youtube, Instagram, Music, Gamepad2, Mail, MessageSquare, Cpu, Rocket, Layout, Sparkles, X, ChevronLeft, ChevronRight, Server, Globe, ExternalLink, Github, ArrowLeft, Images, Award, GraduationCap, Languages, Wrench, Film, Lock, Unlock, CheckCircle2, Radio, FileText } from "lucide-react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SiUnity, SiCplusplus, SiCanva } from "react-icons/si";
import { TbBrandCSharp, TbBrandAdobePhotoshop, TbBrandAdobePremier } from "react-icons/tb";
import { PiMicrosoftExcelLogo, PiMicrosoftPowerpointLogo, PiMicrosoftWordLogo } from "react-icons/pi";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import IntroVideoLoader from "@/components/IntroVideoLoader";
import {
  getInhaledPastImages,
  getCarGameImages,
  getBackgroundPlanets,
  getMenuPlanets,
  getGameProjects,
  getSoftwareProjects,
  getCertificates,
  getEducations
} from "@/data/portfolioData";

interface PlanetWrapperProps {
  planet: {
    name: string;
    href: string;
    model: string;
    x: string;
    y: string;
    size: string;
    labelOffset: string;
    baseScale: number;
    hoverRadius?: number;
  };
  mouseX: any;
  mouseY: any;
  i: number;
  onHoverChange?: (isHovered: boolean, rect: DOMRect | null) => void;
  isBlackholeHovered: boolean;
  startAnimation: boolean;
  isInteractive: boolean;
}

const PlanetWrapper = ({ planet, mouseX, mouseY, i, onHoverChange, isBlackholeHovered, startAnimation, isInteractive }: PlanetWrapperProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const isInitial = React.useRef(true);

  React.useEffect(() => {
    if (startAnimation) {
      const timer = setTimeout(() => {
        isInitial.current = false;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [startAnimation]);

  const scale = useSpring(1, { damping: 20, stiffness: 150 });

  React.useEffect(() => {
    const updateScale = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const planetCenterX = rect.left + rect.width / 2;
      const planetCenterY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(mouseX.get() - planetCenterX, 2) +
        Math.pow(mouseY.get() - planetCenterY, 2)
      );

      let targetScale = 1;
      if (distance < 400) {
        targetScale = 1 + (0.4 * (1 - distance / 400));
      }

      scale.set(targetScale);
    };

    const unsubscribeX = mouseX.on("change", updateScale);
    const unsubscribeY = mouseY.on("change", updateScale);

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, scale]);

  const isOther = !planet.model.toLowerCase().includes("blackhole");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0 }}
      animate={startAnimation ? {
        opacity: isBlackholeHovered && isOther ? 0 : 1,
        scale: isBlackholeHovered && isOther ? 0 : 1,
        left: isBlackholeHovered && isOther ? "-5vw" : planet.x,
        top: isBlackholeHovered && isOther ? "-10vh" : planet.y,
      } : { opacity: 0, scale: 0 }}
      transition={isInitial.current ? {
        delay: 0.5 + i * 0.1,
        duration: 0.8
      } : {
        type: "spring",
        stiffness: 70,
        damping: 15
      }}
      className="absolute"
      style={{
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }}
    >
      <motion.div
        style={{ scale, width: planet.size, height: planet.size }}
        className="relative pointer-events-none flex flex-col items-center justify-center rounded-full overflow-hidden"
      >
        <div
          className="w-full h-full relative rounded-full overflow-hidden"
          style={{ pointerEvents: (isBlackholeHovered && isOther) ? 'none' : 'auto' }}
          onClick={() => {
            if (isHovered) {
              document.querySelector(planet.href)?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <PlanetModel
            modelPath={planet.model}
            onHoverChange={(hovered) => {
              setIsHovered(hovered);
              if (onHoverChange) {
                const rect = ref.current ? ref.current.getBoundingClientRect() : null;
                onHoverChange(hovered, rect);
              }
            }}
            baseScale={planet.baseScale}
            hoverRadius={planet.hoverRadius}
            isInteractive={isInteractive}
          />
        </div>
      </motion.div>
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none z-30 bg-black/60 backdrop-blur-md border border-cyan-500/25 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      >
        <span className="text-sm md:text-base font-orbitron text-cyan-400 uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] font-bold">
          {planet.name}
        </span>
      </div>
    </motion.div>
  );
};

const MovingSatellite = ({ onClick }: { onClick: () => void }) => {
  const [isBlinking, setIsBlinking] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    setIsBlinking(false);
    onClick();
  };

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
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={
            isHovered
              ? {
                scale: 1.25,
                opacity: 1,
                filter: "brightness(1.25) drop-shadow(0 0 15px rgba(34,211,238,0.8))"
              }
              : isBlinking
                ? {
                  scale: 1,
                  opacity: [0.4, 1, 0.4],
                  filter: "brightness(1) drop-shadow(0 0 5px rgba(34,211,238,0.2))"
                }
                : {
                  scale: 1,
                  opacity: 1,
                  filter: "brightness(1) drop-shadow(0 0 10px rgba(34,211,238,0.3))"
                }
          }
          transition={
            isHovered
              ? { type: "spring", stiffness: 300, damping: 15 }
              : isBlinking
                ? {
                  opacity: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  scale: { duration: 0.3 }
                }
                : { duration: 0.3 }
          }
        >
          <Image
            src="/Satellite/uydu.png"
            alt="Satellite"
            fill
            className="object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

const BobbingShip = ({ onClick }: { onClick: () => void }) => {
  const [randomLeft, setRandomLeft] = React.useState("50%");
  const [flipScaleX, setFlipScaleX] = React.useState(1);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    const randomPercent = Math.floor(Math.random() * 70) + 15;
    setRandomLeft(`${randomPercent}%`);

    const shouldFlip = Math.random() < 0.5;
    setFlipScaleX(shouldFlip ? -1 : 1);
  }, []);

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
            y: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            },
            scale: {
              type: "spring",
              stiffness: 300,
              damping: 20
            },
            filter: {
              duration: 0.3
            }
          }}
        >
          <img
            src="/gallery/car game/gemi.png"
            alt="Gemi"
            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]"
            style={{ transform: `scaleX(${flipScaleX})` }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default function Home() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isBlackholeHovered, setIsBlackholeHovered] = React.useState(false);
  const [isSatelliteModalOpen, setIsSatelliteModalOpen] = React.useState(false);
  const [enlargedImageSrc, setEnlargedImageSrc] = React.useState<string | null>(null);
  const [enlargedImageAspect, setEnlargedImageAspect] = React.useState<string>("aspect-[3/4]");
  const [isShipModalOpen, setIsShipModalOpen] = React.useState(false);
  const [enlargedShipImageSrc, setEnlargedShipImageSrc] = React.useState<string | null>(null);
  const [blackholePos, setBlackholePos] = React.useState<{ x: number; y: number } | null>(null);
  const [activeSoftwareProject, setActiveSoftwareProject] = React.useState<number | null>(null);
  const [showSoftwareScreenshots, setShowSoftwareScreenshots] = React.useState<boolean>(false);
  const [enlargedSoftwareImageSrc, setEnlargedSoftwareImageSrc] = React.useState<string | null>(null);
  const [activeCertificate, setActiveCertificate] = React.useState<number | null>(null);
  const [activeEducation, setActiveEducation] = React.useState<number | null>(null);
  const [isMobileDevice, setIsMobileDevice] = React.useState(false);
  const [openProjectModals, setOpenProjectModals] = React.useState<Record<string, boolean>>({});
  const [isVideoIntroActive, setIsVideoIntroActive] = React.useState(true);
  const [isInteractive, setIsInteractive] = React.useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = React.useState(true);

  const { t, language } = useLanguage();

  const inhaledPastImages = getInhaledPastImages();
  const carGameImages = getCarGameImages();
  const backgroundPlanets = getBackgroundPlanets();

  const menuPlanets = getMenuPlanets(t);
  const gameProjects = getGameProjects(t);
  const softwareProjects = getSoftwareProjects(t, language);
  const certificates = getCertificates(t, language);
  const educations = getEducations(t, language);

  const handleProjectModalToggle = React.useCallback((projectId: string, isOpen: boolean) => {
    setOpenProjectModals((prev) => {
      if (prev[projectId] === isOpen) return prev;
      return {
        ...prev,
        [projectId]: isOpen,
      };
    });
  }, []);

  // Listen for back button on mobile when modals are open
  React.useEffect(() => {
    const isAnyModalOpen =
      activeSoftwareProject !== null ||
      activeCertificate !== null ||
      activeEducation !== null ||
      enlargedImageSrc !== null ||
      enlargedShipImageSrc !== null ||
      enlargedSoftwareImageSrc !== null ||
      isSatelliteModalOpen ||
      isShipModalOpen ||
      Object.values(openProjectModals).some(Boolean);

    const handlePopState = () => {
      if (isAnyModalOpen) {
        setActiveSoftwareProject(null);
        setActiveCertificate(null);
        setActiveEducation(null);
        setEnlargedImageSrc(null);
        setEnlargedShipImageSrc(null);
        setEnlargedSoftwareImageSrc(null);
        setIsSatelliteModalOpen(false);
        setIsShipModalOpen(false);
        window.dispatchEvent(new Event("close-local-modals"));
      }
    };

    window.addEventListener("popstate", handlePopState);

    if (isAnyModalOpen) {
      if (window.history.state?.modalOpen !== true) {
        window.history.pushState({ modalOpen: true }, "", window.location.href);
      }
    } else {
      if (window.history.state?.modalOpen === true) {
        window.history.back();
      }
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    activeSoftwareProject,
    activeCertificate,
    activeEducation,
    enlargedImageSrc,
    enlargedShipImageSrc,
    enlargedSoftwareImageSrc,
    isSatelliteModalOpen,
    isShipModalOpen,
    openProjectModals
  ]);

  const isInitial = React.useRef(true);

  // Gamified Contact Form State
  const [contactForm, setContactForm] = React.useState({
    ad: "",
    eposta: "",
    telefon: "",
    mesaj: ""
  });
  const [isContactSubmitted, setIsContactSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isVideoIntroActive || isSatelliteModalOpen || enlargedImageSrc !== null || isShipModalOpen || enlargedShipImageSrc !== null || enlargedSoftwareImageSrc !== null || activeSoftwareProject !== null || activeCertificate !== null || activeEducation !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVideoIntroActive, isSatelliteModalOpen, enlargedImageSrc, isShipModalOpen, enlargedShipImageSrc, enlargedSoftwareImageSrc, activeSoftwareProject, activeCertificate, activeEducation]);

  React.useEffect(() => {
    const isMobileSize = window.innerWidth < 768;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobileDevice(isMobileSize || isMobileUA);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (enlargedImageSrc === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEnlargedImageSrc(null);
      } else if (e.key === "ArrowRight") {
        const currentIdx = inhaledPastImages.indexOf(enlargedImageSrc);
        if (currentIdx !== -1) {
          const nextIdx = (currentIdx + 1) % inhaledPastImages.length;
          setEnlargedImageSrc(inhaledPastImages[nextIdx]);
        }
      } else if (e.key === "ArrowLeft") {
        const currentIdx = inhaledPastImages.indexOf(enlargedImageSrc);
        if (currentIdx !== -1) {
          const prevIdx = (currentIdx - 1 + inhaledPastImages.length) % inhaledPastImages.length;
          setEnlargedImageSrc(inhaledPastImages[prevIdx]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enlargedImageSrc, inhaledPastImages]);

  React.useEffect(() => {
    if (enlargedShipImageSrc === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEnlargedShipImageSrc(null);
      } else if (e.key === "ArrowRight") {
        const currentIdx = carGameImages.indexOf(enlargedShipImageSrc);
        if (currentIdx !== -1) {
          const nextIdx = (currentIdx + 1) % carGameImages.length;
          setEnlargedShipImageSrc(carGameImages[nextIdx]);
        }
      } else if (e.key === "ArrowLeft") {
        const currentIdx = carGameImages.indexOf(enlargedShipImageSrc);
        if (currentIdx !== -1) {
          const prevIdx = (currentIdx - 1 + carGameImages.length) % carGameImages.length;
          setEnlargedShipImageSrc(carGameImages[prevIdx]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enlargedShipImageSrc, carGameImages]);

  React.useEffect(() => {
    if (enlargedSoftwareImageSrc === null || activeSoftwareProject === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEnlargedSoftwareImageSrc(null);
      } else if (e.key === "ArrowRight") {
        const gallery = softwareProjects[activeSoftwareProject].gallery;
        const currentIdx = gallery.indexOf(enlargedSoftwareImageSrc);
        if (currentIdx !== -1) {
          const nextIdx = (currentIdx + 1) % gallery.length;
          setEnlargedSoftwareImageSrc(gallery[nextIdx]);
        }
      } else if (e.key === "ArrowLeft") {
        const gallery = softwareProjects[activeSoftwareProject].gallery;
        const currentIdx = gallery.indexOf(enlargedSoftwareImageSrc);
        if (currentIdx !== -1) {
          const prevIdx = (currentIdx - 1 + gallery.length) % gallery.length;
          setEnlargedSoftwareImageSrc(gallery[prevIdx]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enlargedSoftwareImageSrc, activeSoftwareProject, softwareProjects]);

  React.useEffect(() => {
    if (activeCertificate === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCertificate(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCertificate]);

  React.useEffect(() => {
    if (activeEducation === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveEducation(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeEducation]);

  React.useEffect(() => {
    if (!isVideoIntroActive) {
      const timer = setTimeout(() => {
        isInitial.current = false;
      }, 3000);
      const interactiveTimer = setTimeout(() => {
        setIsInteractive(true);
      }, 3000);
      return () => {
        clearTimeout(timer);
        clearTimeout(interactiveTimer);
      };
    }
  }, [isVideoIntroActive]);

  React.useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 1024);

    if (isMobile) {
      // Orbiting planets are hidden on mobile devices, so orientation tracking is disabled to save CPU and battery
      return;
    } else {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const isAdValid = contactForm.ad.trim().length > 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.eposta.trim());
  const isMesajValid = contactForm.mesaj.trim().length >= 50;
  const signalStrength = (isAdValid ? 25 : 0) + (isEmailValid ? 25 : 0) + (isMesajValid ? 50 : 0);

  const isAnyModalOpen = !!(
    isVideoIntroActive ||
    isSatelliteModalOpen ||
    enlargedImageSrc !== null ||
    isShipModalOpen ||
    enlargedShipImageSrc !== null ||
    enlargedSoftwareImageSrc !== null ||
    activeSoftwareProject !== null ||
    activeCertificate !== null ||
    activeEducation !== null ||
    Object.values(openProjectModals).some(Boolean)
  );

  return (
    <main className="relative min-h-screen bg-transparent text-white selection:bg-cyan-500/30">
      {isVideoIntroActive && (
        <IntroVideoLoader onComplete={() => setIsVideoIntroActive(false)} />
      )}
      <ThreeStarfield isBlackholeHovered={isBlackholeHovered} blackholePos={blackholePos} />
      <Navbar isHidden={isAnyModalOpen} />

      {/* Floating sci-fi themed language toggle */}
      <LanguageToggle />

      {/* Hero Section (Starmap Navigation) */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center px-6 text-center" id="hero">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={!isVideoIntroActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="z-20 pointer-events-none"
        >
          <h1 className="text-5xl md:text-8xl font-bold mb-4 tracking-tighter font-orbitron bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            {t("hero_title")}
          </h1>
          <h2 className="text-lg md:text-2xl font-light text-cyan-400 font-rajdhani uppercase tracking-[0.4em]">
            {t("hero_subtitle")}
          </h2>
        </motion.div>

        {/* Background Decorative Planets */}
        {!isMobileDevice && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none hidden md:block">
            {backgroundPlanets.map((bp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.2 }}
                animate={!isVideoIntroActive ? {
                  opacity: isBlackholeHovered ? 0 : bp.opacity,
                  scale: isBlackholeHovered ? 0 : 1,
                  left: isBlackholeHovered ? "-5vw" : bp.x,
                  top: isBlackholeHovered ? "-10vh" : bp.y,
                } : { opacity: 0, scale: 0.8 }}
                transition={isVideoIntroActive ? { duration: 0 } : (isInitial.current ? {
                  delay: 1 + i * 0.1,
                  duration: 1
                } : {
                  type: "spring",
                  stiffness: 60,
                  damping: 18
                })}
                className="absolute"
                style={{
                  width: bp.size,
                  height: bp.size,
                  transform: 'translate(-25%, -25%)',
                }}
              >
                <div className={`w-full h-full relative animate-slow-spin-${(i % 5) + 1}`}>
                  <Image
                    src={bp.src}
                    alt="Decorative Planet"
                    fill
                    sizes="12vw"
                    className="object-contain filter blur-[2px] brightness-75"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Orbiting Planets */}
        {!isMobileDevice && (
          <div
            className="absolute inset-0 z-10 hidden md:block"
            style={{ pointerEvents: isInteractive ? 'auto' : 'none' }}
          >
            {menuPlanets.map((planet, i) => (
              <PlanetWrapper
                key={planet.href}
                planet={planet}
                mouseX={mouseX}
                mouseY={mouseY}
                i={i}
                isBlackholeHovered={isBlackholeHovered}
                startAnimation={!isVideoIntroActive}
                isInteractive={isInteractive}
                onHoverChange={(isHovered, rect) => {
                  if (planet.model.toLowerCase().includes("blackhole")) {
                    setIsBlackholeHovered(isHovered);
                    if (isHovered && rect) {
                      setBlackholePos({
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2
                      });
                    } else {
                      setBlackholePos(null);
                    }
                  }
                }}
              />
            ))}
          </div>
        )}


        {/* Animated Scroll Indicator */}
        <AnimatePresence>
          {showScrollIndicator && !isVideoIntroActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-28 md:bottom-10 z-20 flex flex-col items-center cursor-pointer left-1/2 -translate-x-1/2 md:left-auto md:right-12 md:translate-x-0 pointer-events-auto gap-2 group"
              onClick={() => {
                document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {/* Text above the arrows */}
              <span className="text-[10px] md:text-xs font-orbitron text-cyan-400/80 tracking-[0.25em] uppercase select-none font-bold group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                {t("hero_scroll_down")}
              </span>

              {/* Nested Chevrons container */}
              <div className="flex flex-col items-center -space-y-2.5">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    animate={{
                      opacity: [0.15, 1, 0.15],
                      y: [0, 4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.15,
                      ease: "easeInOut",
                    }}
                    className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.9)] flex items-center justify-center group-hover:text-cyan-300 transition-colors"
                  >
                    <svg
                      width="40"
                      height="20"
                      viewBox="0 0 40 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 2L20 18L38 2"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* About Section */}
      <section className="relative py-32 px-6" id="about">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-[#0B0C10]/60 backdrop-blur-md border border-white/10 p-8 md:p-12 max-w-5xl mx-auto rounded-3xl relative overflow-hidden shadow-2xl shadow-cyan-500/5"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles size={120} className="text-cyan-500" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-cyan-400 font-orbitron">{t("about_title")}</h2>

            {/* Section 1: Bio & Core Tech */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              {/* Left Side: Bio text */}
              <div className="lg:col-span-3">
                <p className="text-lg md:text-xl leading-relaxed font-rajdhani text-gray-200">
                  {t("about_bio")}
                </p>
              </div>

              {/* Right Side: Core Skills */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Unity', icon: SiUnity, color: 'text-emerald-400' },
                    { label: 'C#', icon: TbBrandCSharp, color: 'text-purple-400' },
                    { label: 'C++', icon: SiCplusplus, color: 'text-blue-400' },
                    { label: 'GDD', subLabel: language === "tr" ? "Oyun Tasarım Dok." : "Game Design Doc.", icon: FileText, color: 'text-cyan-400' },
                  ].map((tech, i) => {
                    const IconComponent = tech.icon;
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all cursor-default"
                      >
                        <div className="w-12 h-12 flex items-center justify-center text-3xl mb-2">
                          <IconComponent className={`${tech.color} transition-transform duration-300 group-hover:scale-110`} />
                        </div>
                        <span className="text-xs font-orbitron uppercase tracking-widest text-white/60 group-hover:text-cyan-400 transition-colors text-center">{tech.label}</span>
                        {tech.subLabel && (
                          <span className="text-[9px] font-rajdhani text-white/40 group-hover:text-cyan-300/50 transition-colors text-center mt-1">{tech.subLabel}</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Glowing Divider 1 */}
            <div className="border-b border-cyan-500/20 my-8 shadow-[0_1px_10px_rgba(6,182,212,0.15)]" />

            {/* Section 2: Ekstra Beceriler */}
            <div>
              <h3 className="text-xs font-bold font-orbitron tracking-widest text-gray-400/80 mb-4 uppercase">
                {t("about_extra_skills")}
              </h3>
              <div className="flex flex-wrap gap-4">
                {[
                  {
                    title: t("about_video_editing"),
                    detail: "Premiere Pro",
                    icons: [TbBrandAdobePremier],
                    colors: ["text-[#9999FF]"]
                  },
                  {
                    title: t("about_graphic_design"),
                    detail: "Photoshop, Canva",
                    icons: [TbBrandAdobePhotoshop, SiCanva],
                    colors: ["text-[#00C8FF]", "text-[#00C4CC]"]
                  },
                  {
                    title: t("about_data_presentation"),
                    detail: "Excel, PowerPoint, Word",
                    icons: [PiMicrosoftExcelLogo, PiMicrosoftPowerpointLogo, PiMicrosoftWordLogo],
                    colors: ["text-[#107C41]", "text-[#C43E1C]", "text-[#185ABD]"]
                  }
                ].map((skill, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all cursor-default"
                  >
                    <div className="flex items-center gap-2">
                      {skill.icons.map((Icon, idx) => (
                        <Icon key={idx} className={`${skill.colors[idx] || 'text-white'} text-lg`} />
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-sm font-semibold font-rajdhani text-white">{skill.title}</span>
                      <span className="text-xs font-rajdhani text-gray-400 sm:before:content-['•'] sm:before:mr-2 sm:before:text-gray-600">{skill.detail}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Glowing Divider 2 */}
            <div className="border-b border-cyan-500/20 my-8 shadow-[0_1px_10px_rgba(6,182,212,0.15)]" />

            {/* Section 3: İlgi Alanları & Hobiler */}
            <div>
              <h3 className="text-xs font-bold font-orbitron tracking-widest text-gray-400/80 mb-6 uppercase">
                {t("about_interests")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1: Favori Oyunlar */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Gamepad2 className="text-cyan-400 w-5 h-5" />
                    <h4 className="text-base font-bold font-orbitron text-white">{t("about_fav_games")}</h4>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: "The Last of Us Part 2", desc: t("about_mechanics"), img: "/gallery/oyunfimmuzik/The_Last_of_Us_Part_II_cover_art.png" },
                      { name: "Hollow Knight", desc: t("about_atmosphere"), img: "/gallery/oyunfimmuzik/Hollow_Knight_kapak.jpg" }
                    ].map((game, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all cursor-default"
                      >
                        <div className="w-12 h-12 rounded-lg relative overflow-hidden flex-shrink-0 border border-white/10">
                          <Image
                            src={game.img}
                            alt={game.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold font-rajdhani text-white leading-tight">{game.name}</span>
                          <span className="text-xs font-rajdhani text-gray-400 mt-0.5">{game.desc}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Müzik Dünyam */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Music className="text-cyan-400 w-5 h-5" />
                    <h4 className="text-base font-bold font-orbitron text-white">{t("about_fav_music")}</h4>
                  </div>
                  <div className="space-y-4">
                    {[
                      { track: "Şehinşah", details: "Karma", img: "/gallery/oyunfimmuzik/karma.jpg" },
                      { track: "Sezen Aksu", details: "Biliyorsun", img: "/gallery/oyunfimmuzik/sezen aksu.jpg" }
                    ].map((music, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all cursor-default"
                      >
                        <div className="w-12 h-12 rounded-lg relative overflow-hidden flex-shrink-0 border border-white/10">
                          <Image
                            src={music.img}
                            alt={`${music.track} - ${music.details}`}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold font-rajdhani text-white leading-tight">{music.track}</span>
                          <span className="text-xs font-rajdhani text-gray-400 mt-0.5">{music.details}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Dizi & Film */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Film className="text-cyan-400 w-5 h-5" />
                    <h4 className="text-base font-bold font-orbitron text-white">{t("about_fav_media")}</h4>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: "Requiem For a Dream", category: t("about_movie"), img: "/gallery/oyunfimmuzik/Requiem_For_A_Dream.jpg" },
                      { title: "Breaking Bad", category: t("about_series"), img: "/gallery/oyunfimmuzik/Breaking_Bad.jpg" }
                    ].map((media, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all cursor-default"
                      >
                        <div className="w-12 h-12 rounded-lg relative overflow-hidden flex-shrink-0 border border-white/10">
                          <Image
                            src={media.img}
                            alt={media.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold font-rajdhani text-white leading-tight">{media.title}</span>
                          <span className="text-xs font-rajdhani text-gray-400 mt-0.5">{media.category}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Games Section */}
      <div id="games" className="overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="pt-20 px-6 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold font-orbitron text-white">{t("games_title")}</h2>
          <div className="w-24 h-1 bg-cyan-500 mx-auto mt-4" />
        </motion.div>
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
      </div>

      {/* Software Projects Section */}
      <section className="min-h-screen pt-20 pb-40 px-6 relative overflow-hidden" id="software">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold font-orbitron text-white">{t("software_title")}</h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto mt-4" />
          </motion.div>

          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10" style={{ perspective: 1000 }}>
            {softwareProjects.map((project, i) => {
              const isSelected = activeSoftwareProject === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50, rotateX: 10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                >
                  <motion.div
                    id={project.title.includes("REST") ? "rest-api" : project.title.includes("Engine") || project.title.includes("Motoru") ? "oyun-motoru" : undefined}
                    onClick={() => setActiveSoftwareProject(i)}
                    animate={{
                      opacity: activeSoftwareProject !== null && isSelected ? 0 : 1,
                      scale: activeSoftwareProject !== null && isSelected ? 0.95 : 1
                    }}
                    transition={{ duration: 0.2 }}
                    className="glass p-10 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-colors group relative overflow-hidden cursor-pointer flex flex-col justify-between h-full min-h-[380px]"
                    whileHover={activeSoftwareProject === null ? {
                      y: -8,
                      boxShadow: "0 20px 40px -15px rgba(34,211,238,0.15)",
                      transition: { type: "spring", stiffness: 300, damping: 20, delay: 0 }
                    } : undefined}
                  >
                    <div className="flex flex-col flex-grow">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {React.cloneElement(project.icon as React.ReactElement<any>, { size: 120 })}
                      </div>
                      <div className="text-cyan-500 mb-6 group-hover:scale-110 transition-transform origin-left w-12 h-12 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center justify-center">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {React.cloneElement(project.icon as React.ReactElement<any>, { size: 24 })}
                      </div>
                      <h3 className="text-2xl font-orbitron mb-4 text-white group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-lg font-rajdhani text-gray-400 leading-relaxed mb-6 flex-grow">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.techStack.map((tech, idx) => (
                          <span key={idx} className="text-xs font-orbitron px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400/80">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 group-hover:bg-cyan-500/10 border border-white/10 group-hover:border-cyan-500/30 rounded-xl text-white font-orbitron text-xs tracking-wider transition-all">
                        {t("cert_detay_gor")}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Certificates Sub-section */}
          <motion.div
            id="sertifikalar"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-32 mb-16 relative z-10"
          >
            <h3 className="text-4xl md:text-5xl font-bold font-orbitron text-white">{t("cert_title")}</h3>
            <div className="w-16 h-1 bg-purple-500 mx-auto mt-4" />
          </motion.div>

          {/* Certificates Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {certificates.map((cert, i) => (
              <motion.div
                key={i}
                onClick={() => setActiveCertificate(i)}
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05, type: "spring", stiffness: 100, damping: 15 }}
                viewport={{ once: true, amount: 0.1 }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 15px 30px -10px rgba(6,182,212,0.15)",
                  transition: { type: "spring", stiffness: 300, damping: 20, delay: 0 }
                }}
                className="glass p-8 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors group relative overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="text-cyan-500 mb-6 group-hover:scale-110 transition-transform origin-left w-12 h-12 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center justify-center">
                    <Award size={24} />
                  </div>
                  <h4 className="text-xl font-orbitron mb-2 text-white group-hover:text-cyan-400 transition-colors">
                    {cert.title}
                  </h4>
                  <p className="text-base font-rajdhani text-cyan-400/80 font-semibold mb-1">
                    {cert.issuer}
                  </p>
                  <p className="text-sm font-rajdhani text-gray-500 mb-4">
                    {cert.date}
                  </p>
                  <p className="text-sm font-rajdhani text-gray-400 leading-relaxed mb-6">
                    {cert.description}
                  </p>
                </div>

                <div>
                  <div className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 group-hover:bg-cyan-500/10 border border-white/10 group-hover:border-cyan-500/30 rounded-xl text-white font-orbitron text-xs tracking-wider transition-all">
                    {t("cert_detay_gor")}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Education Sub-section */}
          <motion.div
            id="egitim"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-32 mb-16 relative z-10"
          >
            <h3 className="text-4xl md:text-5xl font-bold font-orbitron text-white">{t("edu_title")}</h3>
            <div className="w-16 h-1 bg-purple-500 mx-auto mt-4" />
          </motion.div>

          {/* Education Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
            {educations.map((edu, i) => (
              <motion.div
                key={i}
                onClick={() => setActiveEducation(i)}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                viewport={{ once: true, amount: 0.1 }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 15px 30px -10px rgba(6,182,212,0.15)",
                  transition: { type: "spring", stiffness: 300, damping: 20, delay: 0 }
                }}
                className="glass p-8 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors group relative overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="text-cyan-500 mb-6 group-hover:scale-110 transition-transform origin-left w-12 h-12 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center justify-center">
                    {edu.title.includes("English") || edu.title.includes("İngilizce") ? <Languages size={24} /> : <GraduationCap size={24} />}
                  </div>
                  <h4 className="text-xl font-orbitron mb-2 text-white group-hover:text-cyan-400 transition-colors">
                    {edu.title}
                  </h4>
                  <p className="text-base font-rajdhani text-cyan-400/80 font-semibold mb-1">
                    {edu.issuer}
                  </p>
                  <p className="text-sm font-rajdhani text-gray-500 mb-4">
                    {edu.date}
                  </p>
                  <p className="text-sm font-rajdhani text-gray-400 leading-relaxed mb-6">
                    {edu.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {edu.skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] font-orbitron px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-cyan-400/80">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 group-hover:bg-cyan-500/10 border border-white/10 group-hover:border-cyan-500/30 rounded-xl text-white font-orbitron text-xs tracking-wider transition-all">
                    {t("edu_detay_gor")}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Modal Overlay for Detailed View */}
          <AnimatePresence>
            {activeSoftwareProject !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[110] flex items-center justify-center bg-gradient-to-br from-purple-950/30 via-indigo-950/20 to-black/60 backdrop-blur-md p-4 md:p-10"
                onClick={() => {
                  setActiveSoftwareProject(null);
                  setShowSoftwareScreenshots(false);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="glass pt-6 md:pt-8 pb-8 md:pb-12 px-8 md:px-16 rounded-3xl border border-cyan-500/20 relative overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.15)] max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Back Button */}
                  <button
                    onClick={() => {
                      if (showSoftwareScreenshots) {
                        setShowSoftwareScreenshots(false);
                      } else {
                        setActiveSoftwareProject(null);
                      }
                    }}
                    className="mb-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all font-orbitron text-sm uppercase tracking-wider group cursor-pointer z-50 relative"
                  >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    {language === "tr" ? "Geri Dön" : "Go Back"}
                  </button>

                  <AnimatePresence mode="wait">
                    {!showSoftwareScreenshots ? (
                      <motion.div
                        key="details-text"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        {/* Header */}
                        <div className="flex items-center gap-6 mb-4">
                          <div className="text-cyan-400 p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {React.cloneElement(softwareProjects[activeSoftwareProject].icon as React.ReactElement<any>, { size: 40 })}
                          </div>
                          <div>
                            <h3 className="text-3xl md:text-4xl font-orbitron text-white">
                              {softwareProjects[activeSoftwareProject].title}
                            </h3>
                            {softwareProjects[activeSoftwareProject].role && (
                              <span className="text-xs font-orbitron text-cyan-400/80 uppercase tracking-widest block mt-1">
                                {softwareProjects[activeSoftwareProject].role}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2.5 mb-5">
                          {softwareProjects[activeSoftwareProject].techStack.map((tech, idx) => (
                            <span key={idx} className="text-xs font-orbitron px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Detailed Description */}
                        <div className="space-y-6 text-lg font-rajdhani text-gray-300 leading-relaxed mb-8 border-t border-white/5 pt-6">
                          {softwareProjects[activeSoftwareProject].detailedDescription.split('\n\n').map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                          ))}
                        </div>

                        {/* Actions / GitHub Link and Screenshots Button */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/5 pt-8">
                          <a
                            href={softwareProjects[activeSoftwareProject].githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-2xl text-white font-orbitron tracking-wider transition-all group shadow-[0_4px_20px_rgba(0,0,0,0.3)] cursor-pointer"
                          >
                            <Github size={20} className="group-hover:scale-110 transition-transform" />
                            {language === "tr" ? "GitHub Deposu" : "GitHub Repository"}
                            <ExternalLink size={16} className="text-white/50 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                          </a>

                          {softwareProjects[activeSoftwareProject].gallery && softwareProjects[activeSoftwareProject].gallery.length > 0 && (
                            <button
                              onClick={() => setShowSoftwareScreenshots(true)}
                              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 rounded-2xl text-cyan-400 font-orbitron tracking-wider transition-all group shadow-[0_4px_20px_rgba(34,211,238,0.15)] cursor-pointer"
                            >
                              <Images size={20} className="group-hover:scale-110 transition-transform" />
                              {t("modal_screenshots")}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="screenshots-grid"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                        className="w-full flex flex-col gap-4 pt-0"
                      >
                        <div className="text-center">
                          <h3 className="text-base md:text-lg font-bold font-orbitron text-cyan-400/90 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] uppercase tracking-widest">
                            {t("modal_screenshots")}
                          </h3>
                          <div className="w-16 h-[2px] bg-cyan-500/60 mx-auto mt-2" />
                        </div>

                        {/* Screenshots Grid (as many as fit, no limit) */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
                          {softwareProjects[activeSoftwareProject].gallery.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.4)] cursor-pointer group/screen"
                              onClick={() => setEnlargedSoftwareImageSrc(img)}
                            >
                              <img
                                src={img}
                                alt={`${softwareProjects[activeSoftwareProject].title} Screen ${idx + 1}`}
                                className="w-full h-full object-cover group-hover/screen:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover/screen:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="font-orbitron text-[10px] text-cyan-400 bg-black/60 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                                  {t("row_buyut")}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Certificate Modal Overlay */}
          <AnimatePresence>
            {activeCertificate !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[110] flex items-center justify-center bg-gradient-to-br from-purple-950/30 via-indigo-950/20 to-black/60 backdrop-blur-md p-4 md:p-10"
                onClick={() => setActiveCertificate(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="glass pt-6 md:pt-8 pb-8 md:pb-12 px-8 md:px-16 rounded-3xl border border-cyan-500/20 relative overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.15)] max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Back Button */}
                  <button
                    onClick={() => setActiveCertificate(null)}
                    className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all font-orbitron text-sm uppercase tracking-wider group cursor-pointer z-50 relative"
                  >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    {language === "tr" ? "Geri Dön" : "Go Back"}
                  </button>

                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-center gap-6 mb-6">
                      <div className="text-cyan-400 p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                        <Award size={40} />
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-orbitron text-white">
                          {certificates[activeCertificate].title}
                        </h3>
                        <span className="text-xs font-orbitron text-cyan-400/80 uppercase tracking-widest block mt-1">
                          {certificates[activeCertificate].issuer} &bull; {certificates[activeCertificate].date}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Description */}
                    <div className="space-y-6 text-lg font-rajdhani text-gray-300 leading-relaxed mb-8 border-t border-white/5 pt-6">
                      <p>{certificates[activeCertificate].detailedDescription}</p>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col sm:flex-row justify-end items-center gap-6 border-t border-white/5 pt-8">
                      <a
                        href={certificates[activeCertificate].credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 rounded-2xl text-cyan-400 font-orbitron tracking-wider transition-all group shadow-[0_4px_20px_rgba(34,211,238,0.15)] cursor-pointer"
                      >
                        {language === "tr" ? "Sertifikayı Doğrula" : "Verify Certificate"}
                        <ExternalLink size={16} className="text-white/50 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Education Modal Overlay */}
          <AnimatePresence>
            {activeEducation !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[110] flex items-center justify-center bg-gradient-to-br from-purple-950/30 via-indigo-950/20 to-black/60 backdrop-blur-md p-4 md:p-10"
                onClick={() => setActiveEducation(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="glass pt-6 md:pt-8 pb-8 md:pb-12 px-8 md:px-16 rounded-3xl border border-cyan-500/20 relative overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.15)] max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Back Button */}
                  <button
                    onClick={() => setActiveEducation(null)}
                    className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all font-orbitron text-sm uppercase tracking-wider group cursor-pointer z-50 relative"
                  >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    {language === "tr" ? "Geri Dön" : "Go Back"}
                  </button>

                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-center gap-6 mb-6">
                      <div className="text-cyan-400 p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                        {educations[activeEducation].title.includes("English") || educations[activeEducation].title.includes("İngilizce") ? <Languages size={40} /> : <GraduationCap size={40} />}
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-orbitron text-white">
                          {educations[activeEducation].title}
                        </h3>
                        <span className="text-xs font-orbitron text-cyan-400/80 uppercase tracking-widest block mt-1">
                          {educations[activeEducation].issuer} &bull; {educations[activeEducation].date}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Description */}
                    <div className="space-y-6 text-lg font-rajdhani text-gray-300 leading-relaxed mb-8 border-t border-white/5 pt-6 whitespace-pre-line">
                      <p>{educations[activeEducation].detailedDescription}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Work With Me Section */}
      <section className="min-h-screen flex items-center justify-center py-20 px-6 relative overflow-hidden" id="work-with-me">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b20a_1px,transparent_1px),linear-gradient(to_bottom,#0891b20a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Terminal / Control Panel Layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full glass border border-cyan-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col"
          >
            {/* Terminal Header Bar */}
            <div className="bg-black/60 border-b border-cyan-500/20 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 font-orbitron text-[10px] sm:text-xs text-cyan-500/80 tracking-widest uppercase">
                  CONSOLE://HASAN_PARLATIR.SYS
                </span>
              </div>
              <div className="flex items-center gap-3 font-orbitron text-[10px] text-cyan-500/40">
                <span className="hidden sm:inline">LOC: EARTH // REMOTE</span>
                <span className="hidden sm:inline">|</span>
                <span>SEC: FREELANCE_COLLAB</span>
              </div>
            </div>

            {/* Terminal Body Content */}
            <div className="p-10 md:p-14 bg-gradient-to-b from-black/20 to-black/60 backdrop-blur-md flex flex-col gap-12">
              {/* Header / Status Display INSIDE Terminal */}
              <div className="text-center space-y-6 max-w-4xl mx-auto w-full border-b border-cyan-500/10 pb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] mb-2 relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 absolute" />
                  <span className="font-orbitron text-[10px] tracking-[0.2em] text-cyan-400 font-bold uppercase ml-3">
                    {t("work_status")}
                  </span>
                </div>

                <motion.h2
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(34,211,238,0.6), 0 0 20px rgba(34,211,238,0.3)",
                      "0 0 20px rgba(34,211,238,0.8), 0 0 40px rgba(34,211,238,0.5)",
                      "0 0 10px rgba(34,211,238,0.6), 0 0 20px rgba(34,211,238,0.3)"
                    ],
                    scale: [1, 1.01, 0.99, 1.01, 1],
                    skewX: [0, 0.5, -0.5, 0.5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.4, 0.6, 1]
                  }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black font-orbitron text-cyan-400 tracking-wider text-center uppercase"
                >
                  {t("work_title")}
                </motion.h2>
              </div>

              {/* Grid content split */}
              <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-stretch">
                {/* Left Column: Operator Profile Module */}
                <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-6 border border-cyan-500/10 bg-black/40 rounded-2xl relative overflow-hidden group/photo">
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-500/40" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-500/40" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-500/40" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-500/40" />

                  {/* Profile Image */}
                  <div className="relative aspect-square w-72 h-72 rounded-full overflow-hidden mb-6 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center justify-center bg-cyan-950/20">
                    <Image
                      src="/gallery/bne.png"
                      alt="Work With Me"
                      fill
                      sizes="288px"
                      className="object-cover relative z-10 transition-transform duration-700 group-hover/photo:scale-105"
                    />
                    <motion.div
                      animate={{ y: ["0%", "100%", "0%"] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-0 right-0 h-0.5 bg-cyan-400/60 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20 pointer-events-none"
                      style={{ top: 0 }}
                    />
                    <div className="absolute w-64 h-64 border border-cyan-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
                    <div className="absolute w-56 h-56 border border-purple-500/15 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
                  </div>

                  {/* Profile diagnostic module */}
                  <div className="w-full space-y-2.5 font-orbitron text-[10px] text-cyan-400/80 border-t border-cyan-500/10 pt-5">
                    <div className="flex justify-between border-b border-cyan-500/5 pb-1">
                      <span>{t("work_diag_op")}</span>
                      <span className="text-white font-semibold">HASAN PARLATIR</span>
                    </div>
                    <div className="flex justify-between border-b border-cyan-500/5 pb-1">
                      <span>{t("work_diag_sec")}</span>
                      <span className="text-white font-semibold">GAME / APP DEV</span>
                    </div>
                    <div className="flex justify-between border-b border-cyan-500/5 pb-1">
                      <span>{t("work_diag_int")}</span>
                      <span className="text-white font-semibold">TERMINAL V4.2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("work_diag_sync")}</span>
                      <span className="text-green-400 font-bold animate-pulse">{t("work_diag_sync_val")}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Services Grid */}
                <div className="w-full lg:w-2/3 flex flex-col justify-between gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: t("work_service_game_title"),
                        desc: t("work_service_game_desc"),
                        icon: <Gamepad2 size={24} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                      },
                      {
                        title: t("work_service_soft_title"),
                        desc: t("work_service_soft_desc"),
                        icon: <Cpu size={24} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                      },
                      {
                        title: t("work_service_debug_title"),
                        desc: t("work_service_debug_desc"),
                        icon: <Wrench size={24} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                      },
                      {
                        title: t("work_service_media_title"),
                        desc: t("work_service_media_desc"),
                        icon: <Film size={24} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                      }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02, y: -4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="glass bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-[border-color,box-shadow] duration-300 group flex flex-col gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/25 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-all duration-300">
                            {item.icon}
                          </div>
                          <h3 className="font-orbitron text-sm font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-xs md:text-sm font-rajdhani text-gray-300 leading-relaxed">
                          {item.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="w-full flex justify-center pt-6 lg:pt-0">
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(6,182,212,0.5)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full py-5 bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-purple-500/15 hover:from-cyan-500/30 hover:via-blue-500/30 hover:to-purple-500/30 border border-cyan-500/40 hover:border-cyan-400 rounded-2xl font-orbitron text-sm md:text-base uppercase tracking-[0.2em] text-white shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all cursor-pointer font-bold flex items-center justify-center gap-3"
                    >
                      <Rocket size={18} className="animate-bounce" />
                      {t("work_btn_pitch")}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Socials Section */}
      <SocialSection />

      {/* Contact Section */}
      <section className="py-32 px-6" id="contact">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80, damping: 15 }}
            className="glass neon-border p-12 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

            <h2 className="text-3xl md:text-4xl font-orbitron mb-12 flex items-center gap-4">
              <span className="w-3 h-10 bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              {t("contact_title")}
            </h2>

            <AnimatePresence mode="wait">
              {!isContactSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (signalStrength === 100 && !isSubmitting) {
                      setIsSubmitting(true);
                      setSubmitError(null);
                      try {
                        const response = await fetch("https://api.web3forms.com/submit", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                          },
                          body: JSON.stringify({
                            access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "",
                            name: contactForm.ad,
                            email: contactForm.eposta,
                            phone: contactForm.telefon || "Belirtilmedi",
                            message: contactForm.mesaj,
                            subject: "Hasan Parlatır - Yeni İletişim Terminali Sinyali"
                          })
                        });
                        const result = await response.json();
                        if (result.success) {
                          setIsContactSubmitted(true);
                        } else {
                          setSubmitError(result.message || (language === "tr" ? "Sinyal iletilemedi. Lütfen Access Key'inizi kontrol edin." : "Signal could not be transmitted. Please check your Access Key."));
                        }
                      } catch (error) {
                        setSubmitError(language === "tr" ? "Bağlantı hatası oluştu. Lütfen internetinizi kontrol edip tekrar deneyin." : "Connection error occurred. Please check your internet connection and try again.");
                      } finally {
                        setIsSubmitting(false);
                      }
                    }
                  }}
                  className="space-y-8"
                >
                  {/* Signal Strength Progress Bar */}
                  <div className="space-y-3 bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                    <div className="flex justify-between items-center text-xs font-orbitron">
                      <span className="text-gray-400 tracking-wider flex items-center gap-2">
                        <Radio size={14} className="text-cyan-400 animate-pulse" />
                        {t("contact_signal_strength")}
                      </span>
                      <span className={`${signalStrength === 100 ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "text-cyan-400"} font-bold tracking-widest`}>
                        %{signalStrength}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
                      <motion.div
                        className={`h-full ${signalStrength === 100
                          ? "bg-gradient-to-r from-cyan-500 to-emerald-500"
                          : "bg-cyan-500"
                          } shadow-[0_0_15px_rgba(6,182,212,0.8)]`}
                        initial={{ width: 0 }}
                        animate={{ width: `${signalStrength}%` }}
                        transition={{ type: "spring", stiffness: 80, damping: 15 }}
                      />
                    </div>
                    {signalStrength < 100 && (
                      <p className="text-[10px] font-rajdhani text-white/40 tracking-wider">
                        {t("contact_signal_warning")}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* İsim Girişi */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-orbitron uppercase text-cyan-400/60 tracking-widest">
                          {t("contact_label_sender")}
                        </label>
                        {isAdValid && (
                          <span className="text-[9px] font-orbitron text-emerald-400 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{t("contact_status_active")} (+%25)</span>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        value={contactForm.ad}
                        onChange={(e) => setContactForm({ ...contactForm, ad: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 p-4 rounded-lg font-rajdhani focus:outline-none transition-all duration-300 placeholder-white/20 text-white"
                        placeholder={t("contact_placeholder_name")}
                      />
                    </div>

                    {/* E-posta Girişi */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-orbitron uppercase text-cyan-400/60 tracking-widest">
                          {t("contact_label_coordinates")}
                        </label>
                        {isEmailValid && (
                          <span className="text-[9px] font-orbitron text-emerald-400 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{t("contact_status_active")} (+%25)</span>
                        )}
                      </div>
                      <input
                        type="email"
                        required
                        value={contactForm.eposta}
                        onChange={(e) => setContactForm({ ...contactForm, eposta: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 p-4 rounded-lg font-rajdhani focus:outline-none transition-all duration-300 placeholder-white/20 text-white"
                        placeholder={t("contact_placeholder_email")}
                      />
                    </div>
                  </div>

                  {/* Telefon Girişi */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-orbitron uppercase text-cyan-400/60 tracking-widest">
                        {t("contact_label_backup")}
                      </label>
                      {contactForm.telefon.trim().length > 0 && (
                        <span className="text-[9px] font-orbitron text-cyan-400 tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 animate-pulse">
                          {t("contact_extra_freq")}
                        </span>
                      )}
                    </div>
                    <input
                      type="tel"
                      value={contactForm.telefon}
                      onChange={(e) => setContactForm({ ...contactForm, telefon: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 p-4 rounded-lg font-rajdhani focus:outline-none transition-all duration-300 placeholder-white/20 text-white"
                      placeholder={t("contact_placeholder_phone")}
                    />
                  </div>

                  {/* Metin Alanı */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-orbitron uppercase text-cyan-400/60 tracking-widest">
                        {t("contact_label_details")}
                      </label>
                      {isMesajValid && (
                        <span className="text-[9px] font-orbitron text-emerald-400 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{t("contact_status_active")} (+%50)</span>
                      )}
                    </div>
                    <textarea
                      rows={5}
                      required
                      value={contactForm.mesaj}
                      onChange={(e) => setContactForm({ ...contactForm, mesaj: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 p-4 rounded-lg font-rajdhani focus:outline-none transition-all duration-300 resize-none placeholder-white/20 text-white"
                      placeholder={t("contact_placeholder_message")}
                    />
                  </div>

                  {/* Submit Button */}
                  {submitError && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-rajdhani p-4 rounded-lg text-center shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                      {(language === "tr" ? "⚠️ HATA: " : "⚠️ ERROR: ")}{submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={signalStrength < 100 || isSubmitting}
                    className={`w-full py-6 font-orbitron text-lg uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-4 group cursor-pointer ${isSubmitting
                      ? "bg-cyan-600/20 border border-cyan-500/50 text-cyan-300 cursor-wait shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      : signalStrength === 100
                        ? "bg-gradient-to-r from-cyan-600/30 to-emerald-600/30 hover:from-cyan-500/40 hover:to-emerald-500/40 border border-emerald-500/80 text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.4)]"
                        : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        {t("contact_btn_transmitting")}
                      </>
                    ) : signalStrength === 100 ? (
                      <>
                        <Unlock size={20} className="text-emerald-400 animate-bounce" />
                        {t("contact_btn_transmit")}
                      </>
                    ) : (
                      <>
                        <Lock size={20} className="text-white/40" />
                        {t("contact_btn_transmit")}
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="py-16 text-center space-y-8"
                >
                  <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_35px_rgba(52,211,153,0.3)] relative">
                    <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-ping opacity-75" />
                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-orbitron font-bold text-emerald-400 uppercase tracking-widest drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">
                      {t("contact_success_title")}
                    </h3>
                    <p className="font-rajdhani text-xl text-gray-300 max-w-lg mx-auto leading-relaxed font-semibold">
                      {t("contact_success_body")}
                    </p>
                  </div>
                  <div className="pt-6">
                    <button
                      onClick={() => {
                        setContactForm({ ad: "", eposta: "", telefon: "", mesaj: "" });
                        setIsContactSubmitted(false);
                      }}
                      className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 rounded-xl text-sm font-orbitron uppercase text-cyan-400 tracking-[0.2em] transition-all cursor-pointer font-bold"
                    >
                      {t("contact_success_new")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap justify-center gap-12">
              <a href="mailto:hparlatir05@gmail.com" className="flex items-center gap-3 text-white/50 hover:text-cyan-400 transition-colors font-rajdhani">
                <Mail size={18} /> hparlatir05@gmail.com
              </a>
              <a href="https://discord.com/users/423413637353308161" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/50 hover:text-cyan-400 transition-colors font-rajdhani">
                <MessageSquare size={18} /> Discord: hsnprltr
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-[10px] font-orbitron text-white/20 uppercase tracking-[0.5em]">
        {language === "tr" ? "© 2026 Hasan Parlatır. Tüm hakları saklıdır." : "© 2026 Hasan Parlatır. All rights reserved."}
      </footer>

      {/* Moving Satellite Modal */}
      <AnimatePresence>
        {isSatelliteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-xl"
            onClick={() => setIsSatelliteModalOpen(false)}
          >
            <div
              className="glass border border-cyan-500/25 p-6 md:p-10 rounded-3xl max-w-6xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col items-center gap-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title & Subtitle */}
              <div className="text-center space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold font-orbitron text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] uppercase tracking-wider">
                  {t("modal_horror_title")}
                </h3>
                <h4 className="text-sm md:text-base font-rajdhani text-gray-300 font-medium tracking-widest uppercase">
                  {t("modal_horror_sub")}
                </h4>
              </div>
              <div className="w-24 h-1 bg-cyan-500 mb-2" />

              {/* Screenshots Grid */}
              <div className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                  {inhaledPastImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[210/297] w-full rounded-lg overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.4)] cursor-pointer group/screen"
                      onClick={() => {
                        setEnlargedImageSrc(img);
                        setEnlargedImageAspect("aspect-[210/297]");
                      }}
                    >
                      <img
                        src={img}
                        alt={`Inhaled Past Screen ${idx + 1}`}
                        className="w-full h-full object-cover group-hover/screen:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover/screen:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="font-orbitron text-[10px] text-cyan-400 bg-black/60 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                          {t("row_buyut")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF Document Link */}
              <a
                href="https://drive.google.com/file/d/1he4meeQ4ZD0Ef7Sz3PlQQ2nYC3Dn0apz/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex flex-col items-center justify-center group/btn gap-1 text-center"
              >
                <span className="font-orbitron text-lg text-cyan-400 group-hover:text-cyan-300 transition-colors uppercase tracking-[0.2em] font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                  {t("modal_horror_report_btn")}
                </span>
                <span className="text-xs font-rajdhani text-white/40 group-hover:text-white/60 transition-colors">
                  {t("row_pdf_yeni_sekme")}
                </span>
                <div className="w-0 group-hover/btn:w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent transition-all duration-500 mt-1" />
              </a>
            </div>

            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 z-[130]"
              onClick={() => setIsSatelliteModalOpen(false)}
            >
              <X size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Poster Lightbox Overlay */}
      <AnimatePresence>
        {enlargedImageSrc !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none"
            onClick={() => setEnlargedImageSrc(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 z-50"
              onClick={() => setEnlargedImageSrc(null)}
            >
              <X size={28} />
            </button>

            {/* Left Control Arrow */}
            <button
              className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all p-4 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/60 z-50 shadow-[0_0_20px_rgba(6,182,212,0.35)] rounded-full hidden md:block cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const currentIdx = inhaledPastImages.indexOf(enlargedImageSrc || "");
                if (currentIdx !== -1) {
                  const prevIdx = (currentIdx - 1 + inhaledPastImages.length) % inhaledPastImages.length;
                  setEnlargedImageSrc(inhaledPastImages[prevIdx]);
                }
              }}
            >
              <ChevronLeft size={32} />
            </button>

            {/* Poster Image Container */}
            <motion.div
              key={enlargedImageSrc}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(e, info) => {
                const currentIdx = inhaledPastImages.indexOf(enlargedImageSrc || "");
                if (currentIdx !== -1) {
                  if (info.offset.x < -50) {
                    const nextIdx = (currentIdx + 1) % inhaledPastImages.length;
                    setEnlargedImageSrc(inhaledPastImages[nextIdx]);
                  } else if (info.offset.x > 50) {
                    const prevIdx = (currentIdx - 1 + inhaledPastImages.length) % inhaledPastImages.length;
                    setEnlargedImageSrc(inhaledPastImages[prevIdx]);
                  }
                }
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`relative w-full max-w-[95vw] h-[96vh] flex items-center justify-center p-6 cursor-grab active:cursor-grabbing ${enlargedImageAspect}`}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={enlargedImageSrc || undefined}
                alt="Inhaled Past Enlarged Screenshot"
                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(6,182,212,0.15)] pointer-events-none select-none"
              />
            </motion.div>

            {/* Right Control Arrow */}
            <button
              className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all p-4 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/60 z-50 shadow-[0_0_20px_rgba(6,182,212,0.35)] rounded-full hidden md:block cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const currentIdx = inhaledPastImages.indexOf(enlargedImageSrc || "");
                if (currentIdx !== -1) {
                  const nextIdx = (currentIdx + 1) % inhaledPastImages.length;
                  setEnlargedImageSrc(inhaledPastImages[nextIdx]);
                }
              }}
            >
              <ChevronRight size={32} />
            </button>

            {/* Image Indicator / Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-orbitron text-xs tracking-widest text-white/40 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              {(enlargedImageSrc ? inhaledPastImages.indexOf(enlargedImageSrc) : 0) + 1} / {inhaledPastImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ship Modal */}
      <AnimatePresence>
        {isShipModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-xl"
            onClick={() => setIsShipModalOpen(false)}
          >
            <div
              className="glass border border-cyan-500/25 p-6 md:p-10 rounded-3xl max-w-6xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col gap-6 md:gap-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <div className="text-center space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold font-orbitron text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] uppercase tracking-wider">
                  {t("modal_car_title")}
                </h3>
              </div>
              <div className="w-24 h-1 bg-cyan-500 mx-auto -mt-2 mb-2" />

              {/* Two Column Content */}
              <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
                {/* Left Side: Game Description */}
                <div className="flex-1 space-y-4 text-gray-300 font-rajdhani text-base md:text-lg leading-relaxed">
                  <p>{t("modal_car_p1")}</p>
                  <p>{t("modal_car_p2")}</p>
                  <p>{t("modal_car_p3")}</p>
                </div>

                {/* Right Side: Photos Grid */}
                <div className="flex-1 w-full flex flex-col gap-4">
                  <h4 className="text-lg font-orbitron text-cyan-400/90 font-bold uppercase tracking-wider border-b border-cyan-500/25 pb-2">
                    {t("modal_screenshots")}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {carGameImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.4)] cursor-pointer group/screen"
                        onClick={() => setEnlargedShipImageSrc(img)}
                      >
                        <img
                          src={img}
                          alt={`Car Game Screen ${idx + 1}`}
                          className="w-full h-full object-cover group-hover/screen:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover/screen:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="font-orbitron text-[10px] text-cyan-400 bg-black/60 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                            {t("row_buyut")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 z-[130]"
              onClick={() => setIsShipModalOpen(false)}
            >
              <X size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ship Lightbox Overlay */}
      <AnimatePresence>
        {enlargedShipImageSrc !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none"
            onClick={() => setEnlargedShipImageSrc(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 z-50"
              onClick={() => setEnlargedShipImageSrc(null)}
            >
              <X size={28} />
            </button>

            {/* Left Control Arrow */}
            <button
              className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all p-4 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/60 z-50 shadow-[0_0_20px_rgba(6,182,212,0.35)] rounded-full hidden md:block cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const currentIdx = carGameImages.indexOf(enlargedShipImageSrc || "");
                if (currentIdx !== -1) {
                  const prevIdx = (currentIdx - 1 + carGameImages.length) % carGameImages.length;
                  setEnlargedShipImageSrc(carGameImages[prevIdx]);
                }
              }}
            >
              <ChevronLeft size={32} />
            </button>

            {/* Main Image Container */}
            <motion.div
              key={enlargedShipImageSrc}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(e, info) => {
                const currentIdx = carGameImages.indexOf(enlargedShipImageSrc || "");
                if (currentIdx !== -1) {
                  if (info.offset.x < -50) {
                    const nextIdx = (currentIdx + 1) % carGameImages.length;
                    setEnlargedShipImageSrc(carGameImages[nextIdx]);
                  } else if (info.offset.x > 50) {
                    const prevIdx = (currentIdx - 1 + carGameImages.length) % carGameImages.length;
                    setEnlargedShipImageSrc(carGameImages[prevIdx]);
                  }
                }
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[95vw] h-[96vh] flex items-center justify-center p-2 cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={enlargedShipImageSrc || undefined}
                alt="Car Game Enlarged Screenshot"
                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(6,182,212,0.15)] pointer-events-none select-none"
              />
            </motion.div>

            {/* Right Control Arrow */}
            <button
              className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all p-4 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/60 z-50 shadow-[0_0_20px_rgba(6,182,212,0.35)] rounded-full hidden md:block cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const currentIdx = carGameImages.indexOf(enlargedShipImageSrc || "");
                if (currentIdx !== -1) {
                  const nextIdx = (currentIdx + 1) % carGameImages.length;
                  setEnlargedShipImageSrc(carGameImages[nextIdx]);
                }
              }}
            >
              <ChevronRight size={32} />
            </button>

            {/* Image Indicator / Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-orbitron text-xs tracking-widest text-white/40 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              {(enlargedShipImageSrc ? carGameImages.indexOf(enlargedShipImageSrc) : 0) + 1} / {carGameImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Software Lightbox Overlay */}
      <AnimatePresence>
        {enlargedSoftwareImageSrc !== null && activeSoftwareProject !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[140] flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none"
            onClick={() => setEnlargedSoftwareImageSrc(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 z-50 cursor-pointer"
              onClick={() => setEnlargedSoftwareImageSrc(null)}
            >
              <X size={28} />
            </button>

            {/* Left Control Arrow */}
            <button
              className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all p-4 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/60 z-50 shadow-[0_0_20px_rgba(6,182,212,0.35)] rounded-full hidden md:block cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const gallery = softwareProjects[activeSoftwareProject].gallery;
                const currentIdx = gallery.indexOf(enlargedSoftwareImageSrc || "");
                if (currentIdx !== -1) {
                  const prevIdx = (currentIdx - 1 + gallery.length) % gallery.length;
                  setEnlargedSoftwareImageSrc(gallery[prevIdx]);
                }
              }}
            >
              <ChevronLeft size={32} />
            </button>

            {/* Main Image Container */}
            <motion.div
              key={enlargedSoftwareImageSrc}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(e, info) => {
                const gallery = softwareProjects[activeSoftwareProject].gallery;
                const currentIdx = gallery.indexOf(enlargedSoftwareImageSrc || "");
                if (currentIdx !== -1) {
                  if (info.offset.x < -50) {
                    const nextIdx = (currentIdx + 1) % gallery.length;
                    setEnlargedSoftwareImageSrc(gallery[nextIdx]);
                  } else if (info.offset.x > 50) {
                    const prevIdx = (currentIdx - 1 + gallery.length) % gallery.length;
                    setEnlargedSoftwareImageSrc(gallery[prevIdx]);
                  }
                }
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[95vw] h-[96vh] flex items-center justify-center p-2 cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={enlargedSoftwareImageSrc || undefined}
                alt="Software Project Enlarged Screenshot"
                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(6,182,212,0.15)] pointer-events-none select-none"
              />
            </motion.div>

            {/* Right Control Arrow */}
            <button
              className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all p-4 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/60 z-50 shadow-[0_0_20px_rgba(6,182,212,0.35)] rounded-full hidden md:block cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const gallery = softwareProjects[activeSoftwareProject].gallery;
                const currentIdx = gallery.indexOf(enlargedSoftwareImageSrc || "");
                if (currentIdx !== -1) {
                  const nextIdx = (currentIdx + 1) % gallery.length;
                  setEnlargedSoftwareImageSrc(gallery[nextIdx]);
                }
              }}
            >
              <ChevronRight size={32} />
            </button>

            {/* Image Indicator / Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-orbitron text-xs tracking-widest text-white/40 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              {(enlargedSoftwareImageSrc ? softwareProjects[activeSoftwareProject].gallery.indexOf(enlargedSoftwareImageSrc) : 0) + 1} / {softwareProjects[activeSoftwareProject].gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
