"use client";

import React from "react";
import ThreeStarfield from "@/components/ThreeStarfield";
import PlanetModel from "@/components/PlanetModel";
import Navbar from "@/components/Navbar";
import { motion, useSpring, useMotionValue, AnimatePresence, useAnimationFrame, MotionValue } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import IntroVideoLoader from "@/components/IntroVideoLoader";
import { getBackgroundPlanets, getMenuPlanets } from "@/data/portfolioData";
import { useTransition } from "@/context/TransitionContext";

// ── Helpers ────────────────────────────────────────────────────────────────────
const parseValAndUnit = (str: string) => {
  const match = str.match(/^(-?\d+(?:\.\d+)?)(vw|vh|px|%|em|rem)?$/);
  if (!match) return { val: 0, unit: "px" };
  return { val: parseFloat(match[1]), unit: match[2] || "px" };
};

// ── BackgroundPlanetWrapper ───────────────────────────────────────────────────
interface BackgroundPlanetWrapperProps {
  bp: { src: string; x: string; y: string; size: string; opacity: number };
  i: number;
  isBlackholeHovered: boolean;
  isVideoIntroActive: boolean;
  isInitial: React.RefObject<boolean>;
  bhX: string;
  bhY: string;
}

const BackgroundPlanetWrapper = ({ bp, i, isBlackholeHovered, isVideoIntroActive, isInitial, bhX, bhY }: BackgroundPlanetWrapperProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef(0);
  const hoverStartTimeRef = React.useRef<number | null>(null);
  const lastTimeRef = React.useRef<number | null>(null);

  const parsedPlanetX = React.useMemo(() => parseValAndUnit(bp.x), [bp.x]);
  const parsedPlanetY = React.useMemo(() => parseValAndUnit(bp.y), [bp.y]);
  const parsedBhX = React.useMemo(() => parseValAndUnit(bhX), [bhX]);
  const parsedBhY = React.useMemo(() => parseValAndUnit(bhY), [bhY]);

  const { r0, theta0 } = React.useMemo(() => {
    const dx = parsedPlanetX.val - parsedBhX.val;
    const dy = parsedPlanetY.val - parsedBhY.val;
    return { r0: Math.sqrt(dx * dx + dy * dy), theta0: Math.atan2(dy, dx) };
  }, [parsedPlanetX, parsedPlanetY, parsedBhX, parsedBhY]);

  useAnimationFrame((time) => {
    if (isInitial.current || !ref.current) return;
    if (lastTimeRef.current === null) { lastTimeRef.current = time; return; }
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    let target = 0;
    const speed = 0.0006 * delta;
    if (isBlackholeHovered) {
      if (hoverStartTimeRef.current === null) hoverStartTimeRef.current = time;
      if (time - hoverStartTimeRef.current >= (i + 1) * 150) target = 1;
    } else {
      hoverStartTimeRef.current = null;
    }

    let nextProgress = progressRef.current;
    if (progressRef.current < target) nextProgress = Math.min(progressRef.current + speed, target);
    else if (progressRef.current > target) nextProgress = Math.max(progressRef.current - speed, target);
    progressRef.current = nextProgress;

    if (progressRef.current > 0) {
      const v = progressRef.current;
      const rOrbit = Math.min(18, r0 * 0.7);
      let r, theta, scaleVal, opacityVal;
      if (v <= 0.45) {
        const t = v / 0.45;
        const easeT = 1 - Math.pow(1 - t, 2);
        r = r0 + (rOrbit - r0) * easeT; theta = theta0 + 0.8 * Math.PI * easeT;
        scaleVal = 1 - 0.3 * t; opacityVal = bp.opacity;
      } else {
        const t = (v - 0.45) / 0.55;
        const easeT2 = t * t;
        r = rOrbit * (1 - easeT2); theta = theta0 + 0.8 * Math.PI + 3.5 * Math.PI * t;
        scaleVal = 0.7 * (1 - t); opacityVal = bp.opacity * (1 - t);
      }
      ref.current.style.left = `${parsedBhX.val + r * Math.cos(theta)}${parsedPlanetX.unit}`;
      ref.current.style.top = `${parsedBhY.val + r * Math.sin(theta)}${parsedPlanetY.unit}`;
      ref.current.style.opacity = `${opacityVal}`;
      ref.current.style.transform = `translate(-25%, -25%) scale(${scaleVal})`;
    } else {
      ref.current.style.left = bp.x; ref.current.style.top = bp.y;
      ref.current.style.opacity = `${bp.opacity}`;
      ref.current.style.transform = "translate(-25%, -25%)";
    }
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.2, x: "-25%", y: "-25%" }}
      animate={!isVideoIntroActive ? { opacity: bp.opacity, scale: 1, x: "-25%", y: "-25%" } : { opacity: 0, scale: 0.8, x: "-25%", y: "-25%" }}
      transition={isVideoIntroActive ? { duration: 0 } : (isInitial.current ? { delay: 1 + i * 0.1, duration: 1 } : { type: "spring", stiffness: 60, damping: 18 })}
      className="absolute"
      style={{ width: bp.size, height: bp.size, left: bp.x, top: bp.y }}
    >
      <div className={`w-full h-full relative animate-slow-spin-${(i % 5) + 1}`}>
        <Image src={bp.src} alt="Decorative Planet" fill sizes="12vw" className="object-contain filter blur-[2px] brightness-75" />
      </div>
    </motion.div>
  );
};

// ── PlanetWrapper (with zoom-navigate) ────────────────────────────────────────
interface PlanetWrapperProps {
  planet: {
    name: string;
    href: string;
    route: string;
    model: string;
    x: string;
    y: string;
    size: string;
    labelOffset?: string;
    baseScale: number;
    hoverRadius?: number;
    autoRotate?: boolean;
    initialRotation?: { x: number; y: number; z: number };
    spiralTarget?: { x: string; y: string };
  };
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  i: number;
  onHoverChange?: (isHovered: boolean, rect: DOMRect | null) => void;
  isBlackholeHovered: boolean;
  startAnimation: boolean;
  isInteractive: boolean;
  bhX: string;
  bhY: string;
  onZoomStart: () => void;
}

const PlanetWrapper = ({ planet, mouseX, mouseY, i, onHoverChange, isBlackholeHovered, startAnimation, isInteractive, bhX, bhY, onZoomStart }: PlanetWrapperProps) => {
  const { navigateWithHyperspace } = useTransition();
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isZooming, setIsZooming] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const isInitial = React.useRef(true);

  React.useEffect(() => {
    if (startAnimation) {
      const timer = setTimeout(() => { isInitial.current = false; }, 2000);
      return () => clearTimeout(timer);
    }
  }, [startAnimation]);

  const scale = useSpring(1, { damping: 20, stiffness: 150 });

  const isOther = !planet.model.toLowerCase().includes("blackhole");

  React.useEffect(() => {
    const updateScale = () => {
      if (!ref.current || !isOther) return;
      const rect = ref.current.getBoundingClientRect();
      const planetCenterX = rect.left + rect.width / 2;
      const planetCenterY = rect.top + rect.height / 2;
      const distance = Math.sqrt(Math.pow(mouseX.get() - planetCenterX, 2) + Math.pow(mouseY.get() - planetCenterY, 2));
      scale.set(distance < 400 ? 1 + 0.4 * (1 - distance / 400) : 1);
    };
    const unsubX = mouseX.on("change", updateScale);
    const unsubY = mouseY.on("change", updateScale);
    return () => { unsubX(); unsubY(); };
  }, [mouseX, mouseY, scale, isOther]);

  React.useEffect(() => {
    if (!isOther) {
      if (isHovered) {
        scale.set(2); // significantly scale up blackhole on hover
      } else {
        scale.set(1.0);
      }
    }
  }, [isHovered, isOther, scale]);

  const parsedPlanetX = React.useMemo(() => parseValAndUnit(planet.x), [planet.x]);
  const parsedPlanetY = React.useMemo(() => parseValAndUnit(planet.y), [planet.y]);
  const parsedBhX = React.useMemo(() => parseValAndUnit(bhX), [bhX]);
  const parsedBhY = React.useMemo(() => parseValAndUnit(bhY), [bhY]);

  const { r0, theta0 } = React.useMemo(() => {
    const dx = parsedPlanetX.val - parsedBhX.val;
    const dy = parsedPlanetY.val - parsedBhY.val;
    return { r0: Math.sqrt(dx * dx + dy * dy), theta0: Math.atan2(dy, dx) };
  }, [parsedPlanetX, parsedPlanetY, parsedBhX, parsedBhY]);

  const progressRef = React.useRef(0);
  const hoverStartTimeRef = React.useRef<number | null>(null);
  const lastTimeRef = React.useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (isInitial.current || !ref.current || !isOther) return;
    if (lastTimeRef.current === null) { lastTimeRef.current = time; return; }
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    let target = 0;
    const speed = 0.0006 * delta;
    if (isBlackholeHovered) {
      if (hoverStartTimeRef.current === null) hoverStartTimeRef.current = time;
      if (time - hoverStartTimeRef.current >= i * 200) target = 1;
    } else {
      hoverStartTimeRef.current = null;
    }

    let nextProgress = progressRef.current;
    if (progressRef.current < target) nextProgress = Math.min(progressRef.current + speed, target);
    else if (progressRef.current > target) nextProgress = Math.max(progressRef.current - speed, target);
    progressRef.current = nextProgress;

    if (progressRef.current > 0) {
      const v = progressRef.current;
      const rOrbit = Math.min(18, r0 * 0.7);
      let r, theta, scaleVal, opacityVal;
      if (v <= 0.45) {
        const t = v / 0.45;
        const easeT = 1 - Math.pow(1 - t, 2);
        r = r0 + (rOrbit - r0) * easeT; theta = theta0 + 0.8 * Math.PI * easeT;
        scaleVal = 1 - 0.3 * t; opacityVal = 1;
      } else {
        const t = (v - 0.45) / 0.55;
        const easeT2 = t * t;
        r = rOrbit * (1 - easeT2); theta = theta0 + 0.8 * Math.PI + 3.5 * Math.PI * t;
        scaleVal = 0.7 * (1 - t); opacityVal = 1 - t;
      }
      ref.current.style.left = `${parsedBhX.val + r * Math.cos(theta)}${parsedPlanetX.unit}`;
      ref.current.style.top = `${parsedBhY.val + r * Math.sin(theta)}${parsedPlanetY.unit}`;
      ref.current.style.opacity = `${opacityVal}`;
      ref.current.style.transform = `translate(-50%, -50%) scale(${scaleVal})`;
    } else {
      ref.current.style.left = planet.x; ref.current.style.top = planet.y;
      ref.current.style.opacity = "1";
      ref.current.style.transform = "translate(-50%, -50%)";
    }
  });

  const handleClick = () => {
    if (!isHovered || isZooming) return;
    setIsZooming(true);
    onZoomStart();
    // Navigate after the zoom overlay animation completes
    setTimeout(() => {
      navigateWithHyperspace(planet.route);
    }, 1000);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
      animate={startAnimation ? { opacity: 1, scale: 1, x: "-50%", y: "-50%" } : { opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
      // eslint-disable-next-line react-hooks/refs
      transition={isInitial.current ? { delay: 0.5 + i * 0.1, duration: 0.8 } : { type: "spring", stiffness: 70, damping: 15 }}
      className="absolute"
      style={{ pointerEvents: 'none', left: planet.x, top: planet.y }}
    >
      <motion.div
        style={{ scale, width: planet.size, height: planet.size }}
        className="relative pointer-events-none flex flex-col items-center justify-center rounded-full overflow-hidden"
      >
        <div
          className="w-full h-full relative rounded-full overflow-hidden"
          style={{ pointerEvents: (isBlackholeHovered && isOther) ? 'none' : 'auto' }}
          onClick={handleClick}
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
            autoRotate={planet.autoRotate}
            initialRotation={planet.initialRotation}
          />
        </div>
      </motion.div>
      {/* Planet label */}
      <div
        className={`absolute left-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none z-30 bg-black/60 backdrop-blur-md border border-cyan-500/25 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] ${isHovered && !isZooming ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        style={{ top: `calc(50% + ${!isOther ? '-8vw' : (planet.labelOffset || '0px')})`, transform: 'translate(-50%, -50%)' }}
      >
        <span className="text-sm md:text-base font-orbitron text-cyan-400 uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] font-bold">
          {!isOther ? t("planet_click_to_know_me") : planet.name}
        </span>
      </div>
    </motion.div>
  );
};

// ── MovingSatellite Easter Egg (home page) ────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MovingSatellite = ({ onClick }: { onClick: () => void }) => {
  const [isBlinking, setIsBlinking] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20">
      <motion.div
        className="absolute w-24 h-24 top-[15%] pointer-events-none"
        animate={{ x: ["-15vw", "110vw", "110vw", "-15vw", "-15vw"], scaleX: [1, 1, -1, -1, 1] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear", times: [0, 0.49, 0.50, 0.99, 1.0] }}
      >
        <motion.div
          className="w-full h-full cursor-pointer pointer-events-auto"
          onClick={() => { setIsBlinking(false); onClick(); }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={isHovered ? { scale: 1.25, opacity: 1, filter: "brightness(1.25) drop-shadow(0 0 15px rgba(34,211,238,0.8))" } : isBlinking ? { scale: 1, opacity: [0.4, 1, 0.4], filter: "brightness(1) drop-shadow(0 0 5px rgba(34,211,238,0.2))" } : { scale: 1, opacity: 1, filter: "brightness(1) drop-shadow(0 0 10px rgba(34,211,238,0.3))" }}
          transition={isHovered ? { type: "spring", stiffness: 300, damping: 15 } : isBlinking ? { opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0.3 } } : { duration: 0.3 }}
        >
          <Image src="/Satellite/uydu.png" alt="Satellite" fill className="object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" />
        </motion.div>
      </motion.div>
    </div>
  );
};

// ── Main Home Page ─────────────────────────────────────────────────────────────
export default function Home() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isBlackholeHovered, setIsBlackholeHovered] = React.useState(false);
  const [blackholePos, setBlackholePos] = React.useState<{ x: number; y: number } | null>(null);
  const [isMobileDevice, setIsMobileDevice] = React.useState(false);
  const [isVideoIntroActive, setIsVideoIntroActive] = React.useState(true);
  const [isInteractive, setIsInteractive] = React.useState(false);
  const [isZoomingOut, setIsZoomingOut] = React.useState(false);

  const { t } = useLanguage();

  const backgroundPlanets = getBackgroundPlanets();
  const menuPlanets = getMenuPlanets(t);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const blackholePlanet = menuPlanets.find((p) => p.model.toLowerCase().includes("blackhole"));

  const bhX = "50vw";
  const bhY = "50vh";

  const isInitial = React.useRef(true);

  React.useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro) {
      setIsVideoIntroActive(false);
    }
  }, []);

  React.useEffect(() => {
    const isMobileSize = window.innerWidth < 768;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileDevice(isMobileSize || isMobileUA);
  }, []);

  React.useEffect(() => {
    if (!isVideoIntroActive) {
      const timer = setTimeout(() => { isInitial.current = false; }, 3000);
      const interactiveTimer = setTimeout(() => { setIsInteractive(true); }, 3000);
      return () => { clearTimeout(timer); clearTimeout(interactiveTimer); };
    }
  }, [isVideoIntroActive]);

  React.useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 1024;
    if (!isMobile) {
      const handleMouseMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [mouseX, mouseY]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-transparent text-white selection:bg-cyan-500/30">
      {isVideoIntroActive && (
        <IntroVideoLoader onComplete={() => {
          setIsVideoIntroActive(false);
          sessionStorage.setItem("hasSeenIntro", "true");
        }} />
      )}
      <ThreeStarfield isBlackholeHovered={isBlackholeHovered} blackholePos={blackholePos} />
      <Navbar isHidden={isVideoIntroActive} />
      <LanguageToggle />

      {/* ── Hero title ───────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 hidden md:flex items-center justify-center z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            isVideoIntroActive
              ? { opacity: 0, scale: 0.9 }
              : isBlackholeHovered
                ? { opacity: 0, scale: 0 }
                : { opacity: 1, scale: 1 }
          }
          transition={{ 
            duration: isBlackholeHovered ? 15 : 1.5,
            ease: isBlackholeHovered ? "linear" : "easeOut"
          }}
          className="text-center pointer-events-none"
        >
          <h1 className="text-5xl md:text-8xl font-bold mb-4 tracking-tighter font-orbitron bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
            {t("hero_title")}
          </h1>
          <h2 className="text-lg md:text-2xl font-light text-cyan-400 font-rajdhani uppercase tracking-[0.4em]">
            {t("hero_subtitle")}
          </h2>

        </motion.div>
      </div>

      {/* ── Background Decorative Planets ───────────────────────────────────── */}
      {!isMobileDevice && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none hidden md:block">
          {backgroundPlanets.map((bp, i) => (
            <BackgroundPlanetWrapper
              key={i}
              bp={bp}
              i={i}
              isBlackholeHovered={isBlackholeHovered}
              isVideoIntroActive={isVideoIntroActive}
              isInitial={isInitial}
              bhX={bhX}
              bhY={bhY}
            />
          ))}
        </div>
      )}

      {/* ── Menu Planets ─────────────────────────────────────────────────────── */}
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
              bhX={bhX}
              bhY={bhY}
              onZoomStart={() => setIsZoomingOut(true)}
              onHoverChange={(isHovered, rect) => {
                if (planet.model.toLowerCase().includes("blackhole")) {
                  setIsBlackholeHovered(isHovered);
                  if (isHovered && rect) {
                    setBlackholePos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
                  } else {
                    setBlackholePos(null);
                  }
                }
              }}
            />
          ))}
        </div>
      )}

      {/* ── Mobile Planet Menu ───────────────────────────────────────────────── */}
      {isMobileDevice && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 overflow-hidden">
          {/* Hero title for Mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 0 }}
            animate={isVideoIntroActive 
              ? { opacity: 0 } 
              : { 
                  opacity: 1, 
                  scale: 1, 
                  y: ["0vh", "0vh", "-25vh"]
                }
            }
            transition={{
              duration: 2.2,
              times: [0, 0.45, 1],
              ease: "easeInOut"
            }}
            className="text-center absolute select-none pointer-events-none z-20"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-2 tracking-tighter font-orbitron bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
              {t("hero_title")}
            </h1>
            <h2 className="text-xs sm:text-sm font-light text-cyan-400 font-rajdhani uppercase tracking-[0.3em]">
              {t("hero_subtitle")}
            </h2>
          </motion.div>

          {/* Mobile Menu Options Container */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={!isVideoIntroActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: 2.0, duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-xs flex flex-col gap-4 absolute top-[48%] bottom-10 overflow-y-auto scrollbar-none pb-4 pt-2 pointer-events-auto z-10"
          >
            {menuPlanets.map((planet, i) => (
              <motion.a
                key={planet.route}
                href={planet.route}
                initial={{ opacity: 0, y: 15 }}
                animate={!isVideoIntroActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ delay: 2.1 + i * 0.1, duration: 0.4 }}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 active:bg-cyan-500/10 transition-all group"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:animate-ping" />
                <span className="font-orbitron text-sm uppercase tracking-widest text-white group-hover:text-cyan-400 transition-colors">
                  {planet.name}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      )}

      {/* ── Zoom-out transition overlay (full screen fade-to-black on click) ── */}
      <AnimatePresence>
        {isZoomingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeIn" }}
            className="fixed inset-0 z-[200] bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>
      {/* ── Footer / Copyright ── */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none select-none">
        <p className="font-rajdhani text-xs md:text-sm text-white/40 tracking-[0.15em] uppercase">
          {t("footer_copy")}
        </p>
      </div>
    </main>
  );
}
