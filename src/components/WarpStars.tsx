"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
}

const NUM_STARS = 300;
const SPEED = 6;

export default function WarpStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    /* ── Initialise stars in 3D space ── */
    const stars: Star[] = Array.from({ length: NUM_STARS }, () => ({
      x: Math.random() * w * 2 - w,
      y: Math.random() * h * 2 - h,
      z: Math.random() * w,
      px: 0,
      py: 0,
    }));

    const putStar = (s: Star) => {
      s.px = s.x / s.z;
      s.py = s.y / s.z;
    };
    stars.forEach(putStar);

    const draw = () => {
      /* Dark trail — semi-transparent black wipe */
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      for (const s of stars) {
        /* Move star towards camera */
        s.z -= SPEED;
        if (s.z <= 0) {
          /* Reset to far away at a random position */
          s.x = Math.random() * w * 2 - w;
          s.y = Math.random() * h * 2 - h;
          s.z = w;
          s.px = s.x / s.z;
          s.py = s.y / s.z;
        }

        /* Project 3D → 2D */
        const sx = (s.x / s.z) * w + cx;
        const sy = (s.y / s.z) * h + cy;

        /* Brightness / size based on proximity */
        const size = Math.max(0.1, (1 - s.z / w) * 2.5);
        const alpha = Math.min(1, (1 - s.z / w) * 1.4);

        /* Previous projected position */
        const opx = s.px * w + cx;
        const opy = s.py * h + cy;

        /* Update stored prev position */
        s.px = s.x / s.z;
        s.py = s.y / s.z;

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(opx, opy);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    /* Resize handler */
    const onResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: "70px",
        bottom: "40px",
        left: "90px",
        right: "90px",
        width: "calc(100% - 180px)",
        height: "calc(100% - 140px)",
        zIndex: -3,
        pointerEvents: "none",
        background: "transparent",
      }}
    />
  );
}
