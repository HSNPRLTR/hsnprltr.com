"use client";
import React, { useState, useEffect, useRef } from "react";
interface TerminalLine {
  text: string;
  done: boolean;
}
const BOOT_SEQUENCE = [
  "LOADING OS_V1.0...",
  "ESTABLISHING SECURE CONNECTION...",
  "SYSTEM BOOT COMPLETE.",
];
const SOCIAL_LINKS = [
  { label: "EXECUTE: GITHUB.EXE", url: "https://github.com/HSNPRLTR" },
  { label: "EXECUTE: LINKEDIN.EXE", url: "https://www.linkedin.com/in/hasan-parlat%C4%B1r-38a251265/" },
  { label: "EXECUTE: INSTAGRAM.EXE", url: "https://www.instagram.com/playboihaso/" },
  { label: "EXECUTE: TWITTER-X.EXE", url: "https://x.com/HasanParlatir" },
  { label: "DIR /SOCIAL/SPOTIFY", url: "https://open.spotify.com/intl-tr/artist/0EtJtiKuWQJpcU4rpn0cL2" },
  { label: "DIR /SOCIAL/ITCH-IO", url: "https://hsnprltr.itch.io" },
  { label: "DIR /SOCIAL/YOUTUBE", url: "https://www.youtube.com/@HasanParlatir" },
];
const TYPING_SPEED = 38; // ms per character
const LINE_DELAY = 420; // ms pause between lines
export default function RetroTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showLinks, setShowLinks] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  /* ── Cursor blink ─────────────────────────────────── */
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);
  /* ── Typing engine ────────────────────────────────── */
  useEffect(() => {
    if (currentLineIndex >= BOOT_SEQUENCE.length) {
      const t = setTimeout(() => setShowLinks(true), 650);
      return () => clearTimeout(t);
    }
    const target = BOOT_SEQUENCE[currentLineIndex];
    if (currentCharIndex === 0) {
      setLines((prev) => [...prev, { text: "", done: false }]);
    }
    if (currentCharIndex < target.length) {
      const t = setTimeout(() => {
        setLines((prev) => {
          const updated = [...prev];
          updated[currentLineIndex] = { text: target.slice(0, currentCharIndex + 1), done: false };
          return updated;
        });
        setCurrentCharIndex((i) => i + 1);
      }, TYPING_SPEED);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLines((prev) => {
          const updated = [...prev];
          updated[currentLineIndex] = { text: target, done: true };
          return updated;
        });
        setCurrentLineIndex((i) => i + 1);
        setCurrentCharIndex(0);
      }, LINE_DELAY);
      return () => clearTimeout(t);
    }
  }, [currentLineIndex, currentCharIndex]);
  /* ── Auto-scroll ──────────────────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, showLinks]);
  const isBootDone = currentLineIndex >= BOOT_SEQUENCE.length;
  return (
    <>
      <style>{`
        @keyframes crtFlicker {
          0%,91%,95%,100% { opacity: 1; }
          92%              { opacity: 0.82; }
          93%              { opacity: 1; }
          94%              { opacity: 0.88; }
        }
        .rt-wrap { animation: crtFlicker 5s infinite; }
        .rt-link {
          display: block;
          color: #33ff00;
          text-decoration: none;
          font-family: 'Courier New', Courier, monospace;
          font-size: inherit;
          padding: 2px 5px;
          border: 1px solid transparent;
          letter-spacing: 0.05em;
          text-shadow: 0 0 5px #33ff00;
          transition: background 0.07s, color 0.07s, border-color 0.07s, text-shadow 0.07s;
          white-space: nowrap;
        }
        .rt-link:hover {
          background: #33ff00;
          color: #000;
          text-shadow: none;
          border-color: #33ff00;
          cursor: pointer;
        }
      `}</style>
      <div
        className="rt-wrap"
        style={{
          width: "100%",
          height: "100%",
          background: "#020a00",
          /* CRT phosphor scanlines */
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.20) 0px, rgba(0,0,0,0.20) 1px, transparent 1px, transparent 4px)",
          color: "#33ff00",
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "clamp(8px, 1.15vw, 12px)",
          lineHeight: 1.6,
          padding: "8px 10px",
          boxSizing: "border-box",
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
        }}
      >
        {/* ── Boot sequence lines ── */}
        {lines.map((line, i) => (
          <div
            key={i}
            style={{ textShadow: "0 0 5px #33ff00", letterSpacing: "0.04em" }}
          >
            <span style={{ color: "#1a8a00" }}>C:\&gt;&nbsp;</span>
            {line.text}
            {/* Blinking cursor on the active line */}
            {i === currentLineIndex && !isBootDone && (
              <span
                style={{
                  display: "inline-block",
                  width: "7px",
                  height: "0.85em",
                  background: "#33ff00",
                  verticalAlign: "text-bottom",
                  boxShadow: "0 0 5px #33ff00",
                  opacity: cursorVisible ? 1 : 0,
                }}
              />
            )}
          </div>
        ))}
        {/* ── Separator / ls command ── */}
        {isBootDone && (
          <>
            <div style={{ margin: "6px 0 2px", borderTop: "1px solid #1a4a00" }} />
            <div style={{ textShadow: "0 0 5px #33ff00", letterSpacing: "0.04em" }}>
              <span style={{ color: "#1a8a00" }}>C:\&gt;&nbsp;</span>
              <span>ls /SOCIAL --all</span>
            </div>
          </>
        )}
        {/* ── Social links ── */}
        {showLinks && (
          <div style={{ marginTop: "4px" }}>
            {SOCIAL_LINKS.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rt-link"
              >
                {`> [ ${link.label} ]`}
              </a>
            ))}
            {/* Idle prompt */}
            <div style={{ marginTop: "6px", textShadow: "0 0 5px #33ff00" }}>
              <span style={{ color: "#1a8a00" }}>C:\&gt;&nbsp;</span>
              <span
                style={{
                  display: "inline-block",
                  width: "7px",
                  height: "0.85em",
                  background: "#33ff00",
                  verticalAlign: "text-bottom",
                  boxShadow: "0 0 5px #33ff00",
                  opacity: cursorVisible ? 1 : 0,
                }}
              />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </>
  );
}
