"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

interface SmokeWindow extends Window {
  setSmokeColor?: (color: string) => void;
  initSmokeEffect?: () => void;
  destroySmokeEffect?: () => void;
}

export default function SmokeEffect() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isMobileSize = window.innerWidth < 768;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(isMobileSize || isMobileUA);
    
    if (isMobileSize || isMobileUA) return;

    const win = typeof window !== "undefined" ? (window as SmokeWindow) : null;
    
    if (win?.setSmokeColor) {
      win.setSmokeColor("#808080");
    }

    if (win?.initSmokeEffect) {
      win.initSmokeEffect();
    }

    return () => {
      if (win?.destroySmokeEffect) {
        win.destroySmokeEffect();
      }
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      <canvas 
        id="smoke-canvas" 
        className="fixed inset-0 w-full h-full pointer-events-none z-0" 
      />
      {mounted && (
        <Script 
          src="/smoke.js" 
          strategy="afterInteractive" 
          onLoad={() => {
            const win = typeof window !== "undefined" ? (window as SmokeWindow) : null;
            if (win?.initSmokeEffect) {
              win.initSmokeEffect();
            }
          }}
        />
      )}
    </>
  );
}
