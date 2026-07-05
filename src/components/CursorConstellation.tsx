"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

interface CursorConstellationProps {
  className?: string;
  maxDistance?: number;
  hueSpeed?: number;
  particleSizeMax?: number;
  decaySpeed?: number;
  particlesPerMove?: number;
}

export default function CursorConstellation({
  className = "",
  maxDistance = 75,
  hueSpeed = 0.5,
  particleSizeMax = 10,
  decaySpeed = 0.08,
  particlesPerMove = 6,
}: CursorConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    let particles: Particle[] = [];
    let hue = 0;
    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.x = x;
      mouse.y = y;

      for (let i = 0; i < particlesPerMove; i++) {
        // Parlaklığı %15 (Koyu Kırmızı) ile %35 (Açık/Pembe Kırmızı) arasında rastgele seçiyoruz
        const lightness = Math.floor(Math.random() * 20) + 15;

        // İstersen kırmızıya çok hafif ateş/turuncu efekti katmak için hue'yu 0-15 arası rastgele yapabilirsin:
        // const fireHue = Math.floor(Math.random() * 15); 

        particles.push({
          x,
          y,
          size: Math.random() * particleSizeMax + 1,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
          // Rengi 0 (Kırmızı), %60 canlılık ve kısık parlaklık olarak ayarlıyoruz
          color: `hsl(0, 60%, ${lightness}%)`,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      mouse.x = x;
      mouse.y = y;

      const mobileParticlesCount = Math.max(2, Math.floor(particlesPerMove / 2));
      for (let i = 0; i < mobileParticlesCount; i++) {
        const lightness = Math.floor(Math.random() * 20) + 15;
        particles.push({
          x,
          y,
          size: Math.random() * (particleSizeMax * 0.75) + 1,
          speedX: Math.random() * 1.6 - 0.8,
          speedY: Math.random() * 1.6 - 0.8,
          // Dokunma hareketliliği rengini de aynı şekilde kısık kırmızı yapıyoruz
          color: `hsl(0, 60%, ${lightness}%)`,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    let animationFrameId: number;

    const animate = () => {
      // Pause drawing and clear canvas if the planet overlay is active
      if (document.body.classList.contains("nav-overlay-open")) {
        ctx.clearRect(0, 0, width, height);
        particles = []; // Clear particles to avoid sudden jumps when overlay closes
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.size > 0.2) {
          p.size -= decaySpeed;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 0.3 * (1 - distance / maxDistance);
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        if (p.size <= 0.3) {
          particles.splice(i, 1);
          i--;
        }
      }

      hue = (hue + hueSpeed) % 360;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [maxDistance, hueSpeed, particleSizeMax, decaySpeed, particlesPerMove]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
}
