"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  opacityDir: number;
  pulse: number;
  pulseSpeed: number;
}

// Amber / gold color palette matching the theme
const BASE_COLOR = "251,191,36"; // amber-400

export default function GoldenParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const isMobile = W <= 768;
    // Dense particle count similar to particles.js default
    const COUNT = isMobile ? 50 : 100;
    const MAX_DIST = isMobile ? 100 : 140;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    resize();

    const make = (): Particle => ({
      x: Math.random() * W,
      y: Math.random() * H,
      // Slow, even drift in any direction — matches particles.js feel
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,       // 1–3 px dot
      opacity: Math.random() * 0.5 + 0.3,  // 0.3–0.8
      opacityDir: Math.random() > 0.5 ? 1 : -1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.015 + 0.004,
    });

    const particles: Particle[] = Array.from({ length: COUNT }, make);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // ── draw connection lines first (behind dots)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const lineAlpha = (1 - dist / MAX_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${BASE_COLOR},${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // ── draw dots with glow
      for (const p of particles) {
        // pulsate opacity slightly
        p.opacity += p.opacityDir * 0.004;
        if (p.opacity > 0.85 || p.opacity < 0.15) p.opacityDir *= -1;
        p.pulse += p.pulseSpeed;

        const r = Math.max(0.5, p.radius + Math.sin(p.pulse) * 0.4);

        // solid core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${BASE_COLOR},${Math.min(p.opacity * 1.4, 1)})`;
        ctx.fill();

        // ── move
        p.x += p.vx;
        p.y += p.vy;

        // wrap edges (particles.js style)
        if (p.x < -10) p.x = W + 10;
        else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        else if (p.y > H + 10) p.y = -10;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
