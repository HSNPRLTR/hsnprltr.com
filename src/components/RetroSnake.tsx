"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

const CELL = 10;
const TICK = 120; // ms per game tick

type Dir = "U" | "D" | "L" | "R";
type Pt  = { x: number; y: number };

function rand(cols: number, rows: number): Pt {
  return {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows),
  };
}

export default function RetroSnake() {
  const { t } = useLanguage();
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const stateRef   = useRef({
    snake:   [{ x: 5, y: 5 }] as Pt[],
    dir:     "R" as Dir,
    nextDir: "R" as Dir,
    food:    { x: 10, y: 5 } as Pt,
    alive:   false,
    score:   0,
    cols:    20,
    rows:    15,
  });
  const [score,   setScore]   = useState(0);
  const [started, setStarted] = useState(false);
  const [dead,    setDead]    = useState(false);
  const focused = useRef(false);

  /* ── Resize canvas to wrapper and recalc grid ── */
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    canvas.width  = w;
    canvas.height = h;
    stateRef.current.cols = Math.floor(w / CELL);
    stateRef.current.rows = Math.floor(h / CELL);
  }, []);

  /* ── Draw one frame ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { snake, food, cols, rows, score: sc } = stateRef.current;
    const w = canvas.width;
    const h = canvas.height;

    /* Background */
    ctx.fillStyle = "#020a00";
    ctx.fillRect(0, 0, w, h);

    /* Grid lines (subtle) */
    ctx.strokeStyle = "rgba(51,255,0,0.06)";
    ctx.lineWidth   = 0.5;
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, h); ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(w, y * CELL); ctx.stroke();
    }

    /* Food — blinking dot */
    ctx.fillStyle = "#ff4400";
    ctx.shadowColor = "#ff4400";
    ctx.shadowBlur  = 8;
    ctx.fillRect(food.x * CELL + 1, food.y * CELL + 1, CELL - 2, CELL - 2);
    ctx.shadowBlur  = 0;

    /* Snake */
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle   = isHead ? "#33ff00" : "rgba(51,255,0,0.75)";
      ctx.shadowColor = "#33ff00";
      ctx.shadowBlur  = isHead ? 8 : 3;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
    ctx.shadowBlur = 0;

    /* Score */
    ctx.fillStyle    = "#33ff00";
    ctx.font         = `${CELL}px 'Courier New', monospace`;
    ctx.textAlign    = "right";
    ctx.shadowColor  = "#33ff00";
    ctx.shadowBlur   = 4;
    ctx.fillText(`SC:${sc}`, w - 4, CELL);
    ctx.shadowBlur   = 0;
  }, []);

  /* ── Game tick ── */
  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.alive) return;

    s.dir = s.nextDir;
    const head = s.snake[0];
    const next: Pt = {
      x: head.x + (s.dir === "R" ? 1 : s.dir === "L" ? -1 : 0),
      y: head.y + (s.dir === "D" ? 1 : s.dir === "U" ? -1 : 0),
    };

    /* Wall / self collision */
    const hitWall = next.x < 0 || next.y < 0 || next.x >= s.cols || next.y >= s.rows;
    const hitSelf = s.snake.some(seg => seg.x === next.x && seg.y === next.y);
    if (hitWall || hitSelf) {
      s.alive = false;
      setDead(true);
      draw();
      return;
    }

    const ate = next.x === s.food.x && next.y === s.food.y;
    s.snake = [next, ...s.snake];
    if (ate) {
      s.score++;
      setScore(s.score);
      /* Spawn new food not on snake */
      let nf: Pt;
      do { nf = rand(s.cols, s.rows); }
      while (s.snake.some(seg => seg.x === nf.x && seg.y === nf.y));
      s.food = nf;
    } else {
      s.snake.pop();
    }
    draw();
  }, [draw]);

  /* ── Keyboard ── */
  useEffect(() => {
    const OPPOSITE: Record<Dir, Dir> = { U: "D", D: "U", L: "R", R: "L" };
    const handle = (e: KeyboardEvent) => {
      if (!focused.current) return;
      const map: Record<string, Dir> = {
        ArrowUp: "U", ArrowDown: "D", ArrowLeft: "L", ArrowRight: "R",
        w: "U", s: "D", a: "L", d: "R",
      };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      const s = stateRef.current;
      if (d !== OPPOSITE[s.dir]) s.nextDir = d;
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  /* ── Game loop ── */
  useEffect(() => {
    if (!started || dead) return;
    const id = setInterval(tick, TICK);
    return () => clearInterval(id);
  }, [started, dead, tick]);

  /* ── Initial resize + draw ── */
  useEffect(() => {
    resize();
    draw();
    window.addEventListener("resize", () => { resize(); draw(); });
    return () => window.removeEventListener("resize", () => { resize(); draw(); });
  }, [resize, draw]);

  const startGame = () => {
    resize();
    const s    = stateRef.current;
    s.snake    = [{ x: Math.floor(s.cols / 2), y: Math.floor(s.rows / 2) }];
    s.dir      = "R";
    s.nextDir  = "R";
    s.food     = rand(s.cols, s.rows);
    s.score    = 0;
    s.alive    = true;
    setScore(0);
    setDead(false);
    setStarted(true);
    draw();
  };

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    focused.current = true;
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (stateRef.current.alive && e.cancelable) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || e.changedTouches.length === 0) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    const threshold = 25; 
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) < threshold) return;

    const s = stateRef.current;
    const OPPOSITE: Record<Dir, Dir> = { U: "D", D: "U", L: "R", R: "L" };
    let d: Dir | null = null;

    if (absX > absY) {
      d = dx > 0 ? "R" : "L";
    } else {
      d = dy > 0 ? "D" : "U";
    }

    if (d && d !== OPPOSITE[s.dir]) {
      s.nextDir = d;
    }
  };

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      onFocus={() => { focused.current = true; }}
      onBlur={() =>  { focused.current = false; }}
      onClick={() => { wrapRef.current?.focus(); }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        width:    "100%",
        height:   "100%",
        position: "relative",
        outline:  "none",
        cursor:   "crosshair",
        border:   "1px solid rgba(51,255,0,0.3)",
        touchAction: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />

      {/* Overlay: start / game over */}
      {(!started || dead) && (
        <div style={{
          position:       "absolute",
          inset:          0,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          background:     "rgba(2,10,0,0.82)",
          fontFamily:     "'Courier New', monospace",
          color:          "#33ff00",
          textShadow:     "0 0 6px #33ff00",
          gap:            "8px",
          fontSize:       "clamp(8px, 1.2vw, 11px)",
        }}>
          {dead && (
            <div style={{ color: "#ff4400", fontSize: "1.4em", fontWeight: 700 }}>
              {t("dash_game_over")}
            </div>
          )}
          {dead && <div>{t("dash_score")}: {score}</div>}
          <button
            onClick={startGame}
            style={{
              marginTop:    "4px",
              background:   "transparent",
              border:       "1px solid #33ff00",
              color:        "#33ff00",
              fontFamily:   "'Courier New', monospace",
              fontSize:     "inherit",
              padding:      "3px 10px",
              cursor:       "pointer",
              textShadow:   "0 0 5px #33ff00",
              transition:   "background 0.1s, color 0.1s",
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.background = "#33ff00";
              (e.target as HTMLElement).style.color = "#000";
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.background = "transparent";
              (e.target as HTMLElement).style.color = "#33ff00";
            }}
          >
            {dead ? t("dash_restart_snake") : t("dash_play_snake")}
          </button>
          {!dead && (
            <div style={{ opacity: 0.6, fontSize: "0.9em" }}>
              {t("dash_controls")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
