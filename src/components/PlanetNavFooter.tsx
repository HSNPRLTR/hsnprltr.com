"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, a } from "@react-spring/three";
import * as THREE from "three";
import { useLanguage } from "@/context/LanguageContext";
import { TranslationKey } from "@/data/translations";
import { useTransition } from "@/context/TransitionContext";

type Destination = {
  id: string;
  path: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  glb: string;
  color: string;
  dockScale: number;
  overlayScale: number;
};

const DESTINATIONS: Destination[] = [
  {
    id: "software",
    path: "/Software",
    titleKey: "nav_software_title",
    descKey: "nav_software_desc",
    glb: "/3dplanets/dathomir.glb",
    color: "#ef4444", // Red
    dockScale: 5,
    overlayScale: 1.2
  },
  {
    id: "workwithme",
    path: "/WorkWithMe",
    titleKey: "nav_workwithme_title",
    descKey: "nav_workwithme_desc",
    glb: "/3dplanets/supernova-remnant-v4-fast-preview.glb",
    color: "#eab308", // Yellow
    dockScale: 2.4,
    overlayScale: 0.7
  },
  {
    id: "social",
    path: "/Social",
    titleKey: "nav_social_title",
    descKey: "nav_social_desc",
    glb: "/3dplanets/tatooine.glb",
    color: "#f97316", // Orange
    dockScale: 5,
    overlayScale: 1.2
  },
  {
    id: "contact",
    path: "/Contact",
    titleKey: "nav_contact_title",
    descKey: "nav_contact_desc",
    glb: "/3dplanets/purple_planet.glb",
    color: "#ec4899", // Pink
    dockScale: 5,
    overlayScale: 1.2
  },
  // mygames is omitted from dock logic as requested
];

// Preload models
DESTINATIONS.forEach(dest => useGLTF.preload(dest.glb));

// --- Overlay 3D Model ---
function IsolatedPlanetModel({ glb, scale }: { glb: string; scale: number }) {
  const { scene } = useGLTF(glb);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const ref = useRef<THREE.Group>(null);

  // Continuous rotation for the cinematic feel
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

// --- Dock 3D Model ---
function DockPlanetItem({
  destination,
  isHovered,
  onHover,
  onLeave,
  onClick
}: {
  destination: Destination,
  isHovered: boolean,
  onHover: () => void,
  onLeave: () => void,
  onClick: () => void
}) {
  const { scene } = useGLTF(destination.glb);
  const clonedScene = useMemo(() => scene.clone(), [scene, destination.glb]);
  const ref = useRef<THREE.Group>(null);
  const scrollScaleRef = useRef<THREE.Group>(null);
  const scrollRef = useRef(0);
  const { viewport } = useThree();

  // --- KULLANICI AYARLARI ---
  // Gezegenin dikey (Y ekseni) konumunu buradan yukarı/aşağı değiştirebilirsiniz.
  // Değer büyüdükçe gezegen yukarı çıkar, küçüldükçe (negatif) aşağı iner.
  const MANUAL_Y_OFFSET = -1;

  // Gezegenin büyüme efektinin sayfanın yüzde kaçında başlayacağını buradan ayarlayabilirsiniz.
  // 0.0 = sayfanın en başından itibaren başlar
  // 0.5 = sayfanın tam yarısına (örneğin Clozapine oyununa) gelince başlar
  // 0.8 = sadece sayfanın en altına yaklaşınca başlar
  const SCALE_START_PERCENT = 0.9;
  // ---------------------------

  // Track scroll position to calculate scale multiplier
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (documentHeight <= windowHeight) {
        scrollRef.current = 1.0;
      } else {
        const maxScroll = documentHeight - windowHeight;
        const currentScrollRatio = Math.min(Math.max(scrollY / maxScroll, 0), 1);

        // Büyüme başlangıç yüzdesine göre hesaplama yap
        if (currentScrollRatio < SCALE_START_PERCENT) {
          scrollRef.current = 0.0;
        } else {
          // Kalan aralığı 0.0 ile 1.0 arasına normalize et
          const range = 1.0 - SCALE_START_PERCENT;
          scrollRef.current = (currentScrollRatio - SCALE_START_PERCENT) / range;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Continuous rotation and scroll-based scaling
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
    if (scrollScaleRef.current) {
      // Scale multiplier ranges from 0.1 (top/middle of page) to 1.0 (bottom of page)
      const targetScrollScale = 0.1 + (scrollRef.current * 0.9);
      const targetVec = new THREE.Vector3(targetScrollScale, targetScrollScale, targetScrollScale);
      scrollScaleRef.current.scale.lerp(targetVec, delta * 5);
    }
  });

  const { dockScale } = destination;
  const BASE_Y = -(viewport.height / 2) + MANUAL_Y_OFFSET;

  // Spring animations for dock effect (hover scaling + rising up slightly)
  const targetScale = isHovered ? dockScale * 1.5 : dockScale;
  const targetY = isHovered ? BASE_Y + 0.5 : BASE_Y;

  const { scale, posY } = useSpring({
    scale: targetScale,
    posY: targetY,
    config: { mass: 1, tension: 170, friction: 26 }
  });

  const sphereRadius = destination.id === "workwithme" ? 0.65 : 0.32;
  const offsetY = destination.id === "workwithme" ? 1.1 : 0.55;

  return (
    <a.group
      position-x={0} // Her zaman tam ortada
      position-y={posY}
      position-z={0}
      scale={scale}
    >
      {/* İkinci bir group ile scroll'a bağlı scale çarpanını uyguluyoruz */}
      <group ref={scrollScaleRef}>
        <group ref={ref}>
          <primitive object={clonedScene} />
        </group>
      </group>

      {/* Invisible hit box mesh for high-performance interaction without 3D GLTF raycasting */}
      <mesh
        onPointerOver={() => {
          onHover();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onLeave();
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        position={[0, offsetY, 0]}
      >
        <sphereGeometry args={[sphereRadius, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Subtle glow on hover for the dock item */}
      {isHovered && (
        <pointLight color={destination.color} intensity={8} distance={15} position={[0, 2, 0]} />
      )}
    </a.group>
  );
}

// Map her sayfanın altındaki tek gezegeni belirliyor
const PAGE_TARGETS: Record<string, string> = {
  "/MyGames": "software",
  "/Software": "workwithme",
  "/WorkWithMe": "social",
  "/Social": "contact"
};

export default function PlanetNavFooter() {
  const pathname = usePathname();
  const { navigateWithHyperspace } = useTransition();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const { t } = useLanguage();

  // Add nav-overlay-open class to body when hovering to pause CPU-intensive background VFX
  useEffect(() => {
    if (hoveredNav) {
      document.body.classList.add("nav-overlay-open");
    } else {
      document.body.classList.remove("nav-overlay-open");
    }
    return () => {
      document.body.classList.remove("nav-overlay-open");
    };
  }, [hoveredNav]);

  const targetDestId = PAGE_TARGETS[pathname];
  const activeData = DESTINATIONS.find(d => d.id === targetDestId);

  // Eğer sayfanın altı için belirlenmiş bir gezegen yoksa footer'ı gösterme
  if (!activeData) return null;

  return (
    <>
      {/* --- 3D Single Planet Dock Trigger --- */}
      <div className="relative w-full h-[200px] mt-20 z-0 bg-transparent pointer-events-auto">
        {/* Mobile Destination Label (Visible only on mobile/tablet screens) */}
        <div className="absolute top-15 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none text-center lg:hidden w-full px-4">
          <div className="bg-black/75 backdrop-blur-md border border-cyan-500/30 px-6 py-2.5 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.25)] flex flex-col items-center">
            <p className="font-rajdhani text-[18px] sm:text-[20px] uppercase tracking-[0.3em] text-cyan-400 animate-pulse font-semibold">
              {t("nav_clickToEnter" as any)}
            </p>
            <h3 className="font-orbitron text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-widest mt-1">
              {t(activeData.titleKey)}
            </h3>
          </div>
        </div>
        <Canvas
          orthographic
          camera={{ zoom: 50, position: [0, 0, 100] }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <pointLight position={[-5, -5, -5]} intensity={1} color="#ffffff" />

          <DockPlanetItem
            destination={activeData}
            isHovered={hoveredNav === activeData.id}
            onHover={() => setHoveredNav(activeData.id)}
            onLeave={() => setHoveredNav(null)}
            onClick={() => navigateWithHyperspace(activeData.path)}
          />
        </Canvas>
      </div>

      {/* --- Holographic Glassmorphism Overlay --- */}
      <AnimatePresence>
        {hoveredNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-3xl bg-black/80 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)"
            }}
          >
            {/* Top Text (Title) */}
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-thin mb-1 text-center uppercase tracking-[0.3em] font-orbitron drop-shadow-2xl z-10"
              style={{ color: activeData.color, textShadow: `0 0 20px ${activeData.color}80, 0 0 40px ${activeData.color}40` }}
            >
              {t(activeData.titleKey)}
            </h2>
            <div
              className="text-sm md:text-md uppercase tracking-[0.4em] font-orbitron -mb-6 md:-mb-10 opacity-80 z-10"
              style={{ color: activeData.color }}
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
                <pointLight position={[0, 2, 0]} intensity={8} color={activeData.color} distance={15} />

                <IsolatedPlanetModel glb={activeData.glb} scale={activeData.overlayScale} />
              </Canvas>
            </div>

            {/* Bottom Text (Description) */}
            <p
              className="text-lg md:text-2xl -mt-6 md:-mt-10 text-center font-light max-w-3xl px-6 tracking-wider leading-relaxed drop-shadow-xl z-10"
              style={{ color: activeData.color, textShadow: `0 0 15px ${activeData.color}40` }}
            >
              {t(activeData.descKey)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
