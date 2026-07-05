"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";
import { useLanguage } from "@/context/LanguageContext";
import PlanetModel from "@/components/PlanetModel";
import RetroDashboard from "@/components/RetroDashboard";
import WarpStars from "@/components/WarpStars";
import LanguageToggle from "@/components/LanguageToggle";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type Stage = "error" | "loading" | "main";

// Preload the Contact planet GLB model
useGLTF.preload("/3dplanets/purple_planet.glb");

function IsolatedContactModel({ glb, scale }: { glb: string; scale: number }) {
  const { scene } = useGLTF(glb);
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);
  const ref = React.useRef<THREE.Group>(null);

  // Rotation animation
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
      ref.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <group ref={ref} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

const GLOBAL_STYLES = `
  @keyframes alarmPulse {
    0%, 100% { opacity: 0.3; transform: scale(0.9); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  .alarm-pulse {
    animation: alarmPulse 1.2s ease-in-out infinite;
  }

  @keyframes errorBlinkRed {
    0%, 49% { color: #ff3333; text-shadow: 0 0 20px rgba(255,0,0,0.8); }
    50%, 100% { color: #550000; text-shadow: none; }
  }
  .error-blink-red {
    animation: errorBlinkRed 0.6s step-end infinite;
  }

  @keyframes errorBlinkGreen {
    0%, 49% { color: #33ff33; text-shadow: 0 0 20px rgba(0,255,0,0.8); }
    50%, 100% { color: #004400; text-shadow: none; }
  }
  .error-blink-green {
    animation: errorBlinkGreen 0.6s step-end infinite;
  }

  @keyframes cursorBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  .loading-cursor {
    animation: cursorBlink 0.8s step-end infinite;
  }
`;

interface RetroBootScreenProps {
  onComplete: () => void;
}

function RetroBootScreen({ onComplete }: RetroBootScreenProps) {
  const { t } = useLanguage();
  const lines = [
    t("load_booting"),
    t("load_os"),
    t("load_version"),
    t("load_launching")
  ];

  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      const t = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(t);
    }

    const fullText = lines[currentLineIndex];
    let charIndex = 0;
    setCurrentText("");

    const interval = setInterval(() => {
      setCurrentText((prev) => prev + fullText.charAt(charIndex));
      charIndex++;

      if (charIndex >= fullText.length) {
        clearInterval(interval);
        setVisibleLines((prev) => [...prev, fullText]);
        setCurrentLineIndex((prev) => prev + 1);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [currentLineIndex, onComplete]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "clamp(24px, 10vw, 150px)",
        fontFamily: "'Courier New', Courier, monospace",
        color: "#33ff00",
        fontSize: "clamp(12px, 2.2vw, 22px)",
        lineHeight: 1.8,
        textShadow: "0 0 5px #33ff00",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {visibleLines.map((line, idx) => (
          <div key={idx}>&gt; {line}</div>
        ))}
        {currentLineIndex < lines.length && (
          <div>
            &gt; {currentText}
            <span className="loading-cursor" style={{ marginLeft: "4px" }}>_</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SocialPage() {
  const [stage, setStage] = useState<Stage>("error");
  const [step, setStep] = useState(0);
  const [isContactHovered, setIsContactHovered] = useState(false);
  const { navigateWithHyperspace } = useTransition();
  const { t } = useLanguage();

  const [isMobileDevice, setIsMobileDevice] = useState(false);
  useEffect(() => {
    const isMobileSize = window.innerWidth < 768;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobileDevice(isMobileSize || isMobileUA);
  }, []);

  useEffect(() => {
    if (stage !== "error") return;

    const t1 = setTimeout(() => setStep(1), 2000);
    const t2 = setTimeout(() => setStep(2), 4000);
    const tLoading = setTimeout(() => setStage("loading"), 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(tLoading);
    };
  }, [stage]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white select-none">
      <style>{GLOBAL_STYLES}</style>

      {/* Return to orbit button */}
      <motion.button
        id="return-to-orbit-btn"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        onClick={() => navigateWithHyperspace("/")}
        className="fixed top-5 left-5 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/70 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400/70 hover:bg-cyan-950/60 transition-all duration-300 group shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer"
        aria-label="Return to orbit"
      >
        <svg className="w-4 h-4 text-cyan-400 group-hover:rotate-[-20deg] transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="M2 12a10 10 0 0 0 20 0" />
        </svg>
        <span className="font-orbitron text-[10px] uppercase tracking-widest text-cyan-400 group-hover:text-cyan-300 transition-colors hidden sm:inline">
          Yorungeye Don
        </span>
      </motion.button>

      <div className="fixed top-5 right-5 z-[9999]">
        <LanguageToggle />
      </div>

      {/* STAGE 2: Error Screen */}
      <AnimatePresence>
        {stage === "error" && (
          <motion.div
            key="error-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9000,
              background: "#000",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Top Warning Banner in line with site theme */}
            <div className="absolute top-24 sm:top-10 left-0 right-0 text-center z-[9002] font-mono tracking-widest text-[9px] sm:text-xs uppercase px-4 select-none">
              <span className="inline-block max-w-xs sm:max-w-none text-red-500 animate-pulse border border-red-500/30 px-3 py-1 bg-red-950/20 rounded-md leading-relaxed">
                {t("social_warning_banner")}
              </span>
            </div>
            {/* Center Pulsing Alarm Glow (Shifts to Green on Step 2) */}
            <div
              className="alarm-pulse"
              style={{
                position: "absolute",
                width: "min(80vw, 600px)",
                height: "min(80vw, 600px)",
                borderRadius: "50%",
                background: step === 2
                  ? "radial-gradient(circle, rgba(0, 255, 0, 0.4) 0%, rgba(0, 255, 0, 0) 70%)"
                  : "radial-gradient(circle, rgba(255, 0, 0, 0.4) 0%, rgba(255, 0, 0, 0) 70%)",
                filter: "blur(20px)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />

            {/* Warning Text Container */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "'Courier New', Courier, monospace",
                minHeight: "150px",
                width: "100%",
                padding: "0 24px",
              }}
            >
              {/* 1. HATA */}
              {step === 0 && (
                <div
                  className="error-blink-red"
                  style={{
                    fontSize: "clamp(48px, 12vw, 110px)",
                    fontWeight: 900,
                    letterSpacing: "0.1em",
                    lineHeight: 1.1,
                  }}
                >
                  {t("social_error_title")}
                </div>
              )}

              {/* 2. Atmosfere Giriş Yapılamıyor */}
              {step === 1 && (
                <div
                  className="error-blink-red"
                  style={{
                    fontSize: "clamp(18px, 3.5vw, 36px)",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    lineHeight: 1.2,
                  }}
                >
                  {t("social_error_subtitle")}
                </div>
              )}

              {/* 3. Geri Dönülüyor */}
              {step === 2 && (
                <div
                  className="error-blink-green"
                  style={{
                    fontSize: "clamp(14px, 2.5vw, 24px)",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    lineHeight: 1.2,
                  }}
                >
                  {t("social_error_returning")}
                </div>
              )}
            </div>

            {/* Skip Cutscene Button in Bottom Right */}
            <button
              onClick={() => setStage("main")}
              className="absolute bottom-10 right-10 z-[9005] px-5 py-2.5 border border-red-500/35 hover:border-red-400 bg-black/60 hover:bg-red-950/30 text-red-400 hover:text-red-300 font-mono text-xs tracking-wider uppercase rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] transition-all duration-300 cursor-pointer select-none"
            >
              {t("social_skip_cutscene")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2.5: Loading Boot Screen */}
      <AnimatePresence>
        {stage === "loading" && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9200,
              background: "#000",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <RetroBootScreen onComplete={() => setStage("main")} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 3: Main Scene */}
      <AnimatePresence>
        {stage === "main" && (
          <motion.div
            key="main-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", height: "100vh" }}
          >
            {isMobileDevice ? (
              // Mobile View: Dark Green theme, no computer bezel, centered 3D Tatooine spinning in the background
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden" }}>
                {/* Layer 1: Dark Green Atmosphere Gradient */}
                <div style={{
                  position: "fixed", inset: 0, zIndex: -2,
                  background: "radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, rgba(2, 26, 10, 0.98) 100%)",
                }} />

                {/* Layer 2: 3D background planet */}
                <div style={{
                  position: "fixed", inset: 0, zIndex: -1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0.15, pointerEvents: "none"
                }}>
                  <div style={{ width: "300px", height: "300px" }}>
                    <PlanetModel
                      modelPath="/3dplanets/tatooine.glb"
                      baseScale={6}
                      autoRotate={true}
                      isInteractive={false}
                    />
                  </div>
                </div>

                {/* Layer 3: Scrollable Dashboard */}
                <div className="absolute inset-0 z-10 flex flex-col justify-start px-6 pt-24 pb-12 overflow-y-auto scrollbar-none">
                  <RetroDashboard onContactHoverChange={setIsContactHovered} isMobile={true} />
                </div>
              </div>
            ) : (
              // Desktop View: Original Bezel Layout
              <>
                {/* Layer 1 (z:-2): Background image */}
                <div style={{
                  position: "fixed", inset: 0, zIndex: -2,
                  backgroundImage: "url('/gallery/SocialPlanet/backgroundsocial.png')",
                  backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                }} />

                {/* Layer 2 (z:-1): Dark atmosphere overlay */}
                <div style={{
                  position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none",
                  background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.88) 100%)",
                }} />

                {/* Layer 3 (z:-3): Warp Stars on the right half */}
                <div style={{
                  position: "fixed", top: 0, left: "50%", right: 0, bottom: 0,
                  zIndex: -3, overflow: "hidden", pointerEvents: "none",
                }}>
                  <WarpStars />
                </div>

                {/* LEFT: Computer + Dashboard (50%) */}
                <div style={{
                  width: "50%", height: "120vh",
                  display: "flex", alignItems: "flex-end", justifyContent: "flex-start",
                  paddingLeft: "2vw", paddingBottom: "5vh",
                  position: "relative", zIndex: 10, overflow: "hidden",
                }}>
                  {/* Responsive Computer Bezel container */}
                  <div style={{
                    position: "fixed",
                    width: "100%",
                    maxWidth: "1110px",
                    flexShrink: 0,
                    marginLeft: "0",
                  }}>
                    <img
                      src="/gallery/SocialPlanet/computer.png"
                      alt="Retro Computer"
                      style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1 }}
                      draggable={false}
                    />

                    {/* SCREEN OVERLAY: adjust top/left/width/height to fit the PNG bezel */}
                    <div style={{
                      position: "absolute", zIndex: 2,
                      top: "12%",    /* ADJUST */
                      left: "25%",   /* ADJUST */
                      width: "50%",  /* ADJUST */
                      height: "48%", /* ADJUST */
                      overflow: "hidden", borderRadius: "4px",
                      boxShadow: "inset 0 0 40px rgba(0,0,0,0.8)",
                    }}>
                      <RetroDashboard onContactHoverChange={setIsContactHovered} />
                    </div>
                  </div>
                </div>

                {/* RIGHT: 3D Planet (Absolute 60vw width centered container to prevent clipping) */}
                <motion.div
                  /* Sadece hedef değeri veriyoruz: Küçülerek 0 (yok olma) boyutuna in. 
                     Framer Motion başlangıç değerini otomatik olarak 1 kabul eder. */
                  animate={{ scale: 1 }}
                  /* 120 saniye (2 dakika) sürer. 
                     ease: "linear" sabit bir hızla uzaklaşmasını sağlar. */
                  transition={{ duration: 120, ease: "linear" }}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "90vw",
                    height: "100vh",
                    zIndex: -3,
                    pointerEvents: "none",
                  }}
                >
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "min(55vw, 600px)", height: "min(55vw, 600px)" }}>
                      <PlanetModel
                        modelPath="/3dplanets/tatooine.glb"
                        baseScale={6}
                        autoRotate={true}
                        isInteractive={false}
                      />
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {/* Holographic Glassmorphism Overlay for Contact Planet */}
            <AnimatePresence>
              {isContactHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-3xl bg-black/80 pointer-events-none"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)"
                  }}
                >
                  {/* Top Text (Title) */}
                  <h2
                    className="text-4xl md:text-5xl lg:text-6xl font-thin mb-1 text-center uppercase tracking-[0.3em] font-orbitron drop-shadow-2xl z-10"
                    style={{ color: "#ec4899", textShadow: "0 0 20px #ec489980, 0 0 40px #ec489940" }}
                  >
                    {t("nav_contact_title")}
                  </h2>
                  <div
                    className="text-sm md:text-md uppercase tracking-[0.4em] font-orbitron -mb-6 md:-mb-10 opacity-80 z-10"
                    style={{ color: "#ec4899" }}
                  >
                    [ {t("nav_clickToEnter")} ]
                  </div>

                  {/* Isolated Center 3D Canvas */}
                  <div className="w-[400px] h-[400px] md:w-[50vh] md:h-[50vh] relative flex-shrink-0 z-0 pointer-events-none">
                    <Canvas
                      orthographic
                      camera={{ zoom: 120, position: [0, 0, 100] }}
                      gl={{ alpha: true, antialias: true }}
                    >
                      <ambientLight intensity={1.5} />
                      <directionalLight position={[5, 5, 5]} intensity={2} />
                      <pointLight position={[-5, -5, -5]} intensity={1} color="#ffffff" />
                      <pointLight position={[0, 2, 0]} intensity={8} color="#ec4899" distance={15} />

                      <IsolatedContactModel glb="/3dplanets/purple_planet.glb" scale={1.2} />
                    </Canvas>
                  </div>

                  {/* Bottom Text (Description) */}
                  <p
                    className="text-lg md:text-2xl -mt-6 md:-mt-10 text-center font-light max-w-3xl px-6 tracking-wider leading-relaxed drop-shadow-xl z-10"
                    style={{ color: "#ec4899", textShadow: "0 0 15px #ec489940" }}
                  >
                    {t("nav_contact_desc")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}