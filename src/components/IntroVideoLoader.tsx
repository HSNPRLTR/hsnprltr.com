"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Terminal, Radio } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface IntroVideoLoaderProps {
  onComplete: () => void;
}

export default function IntroVideoLoader({ onComplete }: IntroVideoLoaderProps) {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isWindowLoaded, setIsWindowLoaded] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);
  const [minimumTimeMet, setMinimumTimeMet] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [statusText, setStatusText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isVideoFaded, setIsVideoFaded] = useState(false);

  // Monitor document/window loading state
  useEffect(() => {
    if (document.readyState === "complete") {
      setIsWindowLoaded(true);
    } else {
      const handleLoad = () => {
        setIsWindowLoaded(true);
      };
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // 5-second countdown timer progress (maps to 90% of the bar)
  useEffect(() => {
    const duration = 5000; // 5 seconds
    const intervalTime = 40; // ~25 fps
    const increment = (intervalTime / duration) * 90;

    const timer = setInterval(() => {
      setTimerProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          setMinimumTimeMet(true);
          return 90;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Handle final 10% progress once both timer (5s) and page loading are done
  useEffect(() => {
    if (minimumTimeMet && isWindowLoaded) {
      let currentProgress = 90;
      const interval = setInterval(() => {
        currentProgress += 2;
        setTimerProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          setIsDone(true);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [minimumTimeMet, isWindowLoaded]);

  // Handle transition status text
  useEffect(() => {
    if (isDone) {
      setStatusText(t("loader_loaded"));
    } else if (timerProgress >= 90 && !isWindowLoaded) {
      setStatusText(t("loader_initializing"));
    } else {
      setStatusText(t("loader_loading"));
    }
  }, [timerProgress, isWindowLoaded, isDone, t]);

  // Attempt to autoplay again if browser initially blocked it
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay was prevented by browser policies:", err);
      });
    }
  }, []);

  // Handle video element timeupdate to fade out video near the end if load is incomplete
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      if (duration && currentTime >= duration - 1.5 && !isWindowLoaded) {
        setIsVideoFaded(true);
      }
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const targetMute = !videoRef.current.muted;
      videoRef.current.muted = targetMute;
      setIsMuted(targetMute);

      // Explicitly try playing after interaction to resolve audio blocking
      videoRef.current.play().catch((err) => {
        console.warn("Failed to play on volume toggle:", err);
      });
    }
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#020205] flex flex-col justify-between p-6 md:p-10 select-none overflow-hidden"
        >
          {/* Scanline CRT simulation overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_100%)] pointer-events-none z-20" />
          <div
            className="absolute inset-0 pointer-events-none z-20 opacity-15"
            style={{
              backgroundImage: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))`,
              backgroundSize: "100% 4px, 6px 100%"
            }}
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none z-10 opacity-80" />

          {/* Video Element */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              ref={videoRef}
              src="/gallery/bigbang.mp4"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className={`w-full h-full object-cover scale-105 transition-opacity duration-[1500ms] ease-in-out ${
                isVideoFaded ? "opacity-0" : "opacity-60"
              }`}
            />
          </div>

          {/* Top HUD Row */}
          <div className="z-30 w-full flex justify-between items-start font-rajdhani">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-cyan-500/20 px-4 py-2 rounded-xl text-cyan-400/90 text-xs md:text-sm tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.05)]">
              <Cpu size={16} className="animate-pulse text-cyan-400" />
              <div>
                <div className="font-bold font-orbitron">HASAN_OS v2.6.8</div>
                <div className="text-[10px] text-cyan-500/60 font-mono">SECTOR_COORD: 41.0082.28.9784</div>
              </div>
            </div>
          </div>

          {/* Decorative Corner Lines */}
          <div className="absolute top-24 left-10 w-24 h-[1px] bg-cyan-500/10 pointer-events-none z-20" />
          <div className="absolute top-24 left-10 w-[1px] h-24 bg-cyan-500/10 pointer-events-none z-20" />
          <div className="absolute bottom-40 right-10 w-24 h-[1px] bg-cyan-500/10 pointer-events-none z-20" />
          <div className="absolute bottom-40 right-10 w-[1px] h-24 bg-cyan-500/10 pointer-events-none z-20" />

          {/* Bottom HUD / Progress Bar Container */}
          <div className="z-30 w-full max-w-4xl mx-auto flex flex-col items-center gap-4">
            {/* Status / Telemetry Stream */}
            <div className="w-full flex justify-between text-[10px] md:text-xs font-mono text-cyan-400/50 uppercase tracking-widest px-2">
              <span className="flex items-center gap-1.5">
                <Terminal size={12} />
                DEVICES_LOADED: [OK]
              </span>
              <span className="flex items-center gap-1.5">
                <Radio size={12} className="animate-pulse" />
                FREQUENCY: 2.44GHZ_UP
              </span>
            </div>

            {/* Main Progress Bar Wrapper */}
            <div className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-full p-1.5 overflow-hidden shadow-2xl relative shadow-cyan-950/20">
              {/* Progress Bar Track */}
              <div className="h-2 md:h-3 rounded-full bg-cyan-950/30 overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-white rounded-full shadow-[0_0_15px_rgba(34,211,238,0.7)]"
                  style={{ width: `${timerProgress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
            </div>

            {/* Bottom Row text info */}
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-2 px-2 font-rajdhani">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-cyan-400 font-orbitron font-semibold tracking-wider text-xs md:text-sm uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                  {statusText}
                </span>
                <span className="text-[10px] md:text-xs text-white/40">
                  ({Math.round(timerProgress)}%)
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
