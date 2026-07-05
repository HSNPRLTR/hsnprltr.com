"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
}

interface Props {
  text: string;
  color?: string;
}

export default function ParticleTextHero({ text, color = "#22d3ee" }: Props) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouse = useRef({ x: -9999, y: -9999, down: false });
  const initializedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (initializedRef.current) return;
    initializedRef.current = true;
  }, []);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const off = document.createElement("canvas");
    canvasRef.current = canvas;
    offscreenRef.current = off;

    const ctx = canvas.getContext("2d");
    const offCtx = off.getContext("2d");
    
    if (!ctx || !offCtx) {
      console.error("Failed to get canvas context");
      return;
    }

    function resize() {
      const container = containerRef.current;
      if (!container || !ctx || !offCtx) return;
      
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const w = Math.max(600, container.clientWidth);
      const h = Math.max(240, Math.round(window.innerHeight * 0.6));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      off.width = canvas.width;
      off.height = canvas.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createTextParticles();
    }

    function createTextParticles() {
      const offCanvas = offscreenRef.current;
      if (!offCanvas) return;
      
      const offCtxLocal = offCanvas.getContext("2d");
      if (!offCtxLocal) return;
      
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const w = offCanvas.width / dpr;
      const h = offCanvas.height / dpr;
      offCtxLocal.clearRect(0, 0, w, h);

      const fontSize = Math.round(Math.min(w / (text.length * 0.8), h * 0.45));
      offCtxLocal.fillStyle = "white";
      offCtxLocal.textAlign = "center";
      offCtxLocal.textBaseline = "middle";
      offCtxLocal.font = `bold ${fontSize}px Orbitron, sans-serif`;
      offCtxLocal.fillText(text.toUpperCase(), w / 2, h / 2);

      const img = offCtxLocal.getImageData(0, 0, w, h).data;
      const gap = 8;
      particlesRef.current = [];
      
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          const idx = (y * w + x) * 4 + 3;
          const alpha = img[idx];
          if (alpha > 128) {
            const px = x + (Math.random() - 0.5) * 2;
            const py = y + (Math.random() - 0.5) * 2;
            particlesRef.current.push({
              x: px,
              y: py,
              baseX: px,
              baseY: py,
              vx: (Math.random() - 0.5) * 0.6,
              vy: (Math.random() - 0.5) * 0.6,
              size: Math.random() * 1.6 + 0.6,
            });
          }
        }
      }
    }

    function step() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctxLocal = canvas.getContext("2d");
      if (!ctxLocal) return;
      
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const particles = particlesRef.current;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctxLocal.clearRect(0, 0, w, h);

      ctxLocal.save();
      ctxLocal.globalCompositeOperation = "lighter";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = p.baseX - p.x;
        const dy = p.baseY - p.y;
        p.vx += dx * 0.01;
        p.vy += dy * 0.01;

        const mx = mouse.current.x;
        const my = mouse.current.y;
        const distX = p.x - mx;
        const distY = p.y - my;
        const dist = Math.sqrt(distX * distX + distY * distY) || 0.0001;
        const maxR = 120;
        if (mx > -900 && dist < maxR) {
          const force = (1 - dist / maxR) * 6;
          p.vx += (distX / dist) * force;
          p.vy += (distY / dist) * force;
        }

        p.vx *= 0.88;
        p.vy *= 0.88;

        p.x += p.vx;
        p.y += p.vy;

        const grd = ctxLocal.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grd.addColorStop(0, color);
        grd.addColorStop(0.3, color + "66");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctxLocal.fillStyle = grd;
        ctxLocal.beginPath();
        ctxLocal.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
        ctxLocal.fill();
      }

      ctxLocal.restore();



      rafRef.current = requestAnimationFrame(step);
    }

    const parent = containerRef.current;
    if (!parent) return;
    
    parent.appendChild(canvas);

    resize();
    const handleResize = resize;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = t.clientX - rect.left;
      mouse.current.y = t.clientY - rect.top;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    rafRef.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try {
        parent.removeChild(canvas);
      } catch {
        // Element may have already been removed
      }
    };
  }, [text, color]);

  return (
    <div ref={containerRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden z-20">
      {/* Canvas is appended by the effect for crisp DPR handling */}
      {/* Fallback title for non-JS or while mounting */}
      {mounted ? null : (
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-orbitron tracking-tighter uppercase" style={{ color }}>
          {text}
        </h1>
      )}
    </div>
  );
}
