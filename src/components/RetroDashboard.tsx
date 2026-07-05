"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RetroSnake from "@/components/RetroSnake";
import { useLanguage } from "@/context/LanguageContext";
import { useTransition } from "@/context/TransitionContext";

/* ── Social links data ───────────────────────────── */
const LINKS = [
  { label: "GITHUB",    url: "https://github.com/HSNPRLTR" },
  { label: "LINKEDIN",  url: "https://www.linkedin.com/in/hasan-parlat%C4%B1r-38a251265/" },
  { label: "INSTAGRAM", url: "https://www.instagram.com/playboihaso/" },
  { label: "X / TWITTER", url: "https://x.com/HasanParlatir" },
  { label: "SPOTIFY",   url: "https://open.spotify.com/intl-tr/artist/0EtJtiKuWQJpcU4rpn0cL2" },
  { label: "ITCH.IO",   url: "https://hsnprltr.itch.io" },
  { label: "YOUTUBE",   url: "https://www.youtube.com/@HSNPRLTR" },
];

/* ── Diagnostic data feed ────────────────────────── */
const DIAG_LINES = [
  "SYS.MEM.....: 2048KB [OK]",
  "CPU.LOAD....: 3%",
  "NET.SIGNAL..: STRONG",
  "UPLINK......: ACTIVE",
  "ENCRYPTION..: AES-256",
  "SECTOR......: ZETA-9",
];

/* ── A retro link button ─────────────────────────── */
function LinkBtn({ label, url, isMobile = false }: { label: string; url: string; isMobile?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:        "block",
        fontFamily:     "'Courier New', Courier, monospace",
        fontSize:       isMobile ? "11px" : "clamp(7px, 0.9vw, 10px)",
        color:          hov ? "#000" : "#33ff00",
        background:     hov ? "#33ff00" : "transparent",
        border:         "1px solid #33ff00",
        padding:        isMobile ? "7px 9px" : "3px 5px",
        textDecoration: "none",
        textAlign:      "center",
        letterSpacing:  "0.06em",
        textShadow:     hov ? "none" : "0 0 4px #33ff00",
        transition:     "background 0.08s, color 0.08s",
        cursor:         "pointer",
        marginBottom:   isMobile ? "6px" : "3px",
        whiteSpace:     "nowrap",
        overflow:       "hidden",
        textOverflow:   "ellipsis",
      }}
    >
      {`> ${label}`}
    </a>
  );
}

/* ── Blinking Contact button ─────────────────────── */
function ContactBtn({ onHoverChange, isMobile = false }: { onHoverChange?: (hovered: boolean) => void; isMobile?: boolean }) {
  const [hov, setHov]   = useState(false);
  const [vis, setVis]   = useState(true);
  const { t } = useLanguage();
  const { navigateWithHyperspace } = useTransition();

  useEffect(() => {
    const id = setInterval(() => setVis(v => !v), 800);
    return () => clearInterval(id);
  }, []);

  return (
    <button
      onMouseEnter={() => {
        setHov(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setHov(false);
        onHoverChange?.(false);
      }}
      onClick={() => navigateWithHyperspace("/Contact")}
      style={{
        width:        "100%",
        background:   hov ? "#33ff00" : "transparent",
        border:       "2px solid #33ff00",
        color:        hov ? "#000" : "#33ff00",
        fontFamily:   "'Courier New', Courier, monospace",
        fontSize:     isMobile ? "12px" : "clamp(7px, 0.9vw, 10px)",
        padding:      isMobile ? "10px 8px" : "6px 4px",
        cursor:       "pointer",
        textShadow:   hov ? "none" : "0 0 6px #33ff00",
        boxShadow:    hov ? "0 0 12px #33ff00" : "0 0 6px rgba(51,255,0,0.3)",
        transition:   "all 0.1s",
        letterSpacing:"0.04em",
        lineHeight:   1.3,
        textAlign:    "center",
        opacity:      vis ? 1 : 0.55,
        whiteSpace:   "pre-line",
      }}
    >
      {t("dash_initiate_comm")}
    </button>
  );
}

/* ── CRT scanlines style string ─────────────────── */
const SCANLINES_STYLE = `
  .retro-dash-wrap {
    background-image: repeating-linear-gradient(
      0deg,
      rgba(0,0,0,0.18) 0px,
      rgba(0,0,0,0.18) 1px,
      transparent 1px,
      transparent 4px
    );
  }
  @keyframes dashFlicker {
    0%,90%,95%,100% { opacity:1; }
    91%             { opacity:0.84; }
    93%             { opacity:0.92; }
  }
  .retro-dash-wrap { animation: dashFlicker 6s infinite; }

  .col-title {
    font-family: 'Courier New', Courier, monospace;
    font-size: clamp(7px, 0.85vw, 10px);
    color: #33ff00;
    text-shadow: 0 0 5px #33ff00;
    letter-spacing: 0.1em;
    border-bottom: 1px solid rgba(51,255,0,0.4);
    padding-bottom: 3px;
    margin-bottom: 5px;
  }
`;

/* ── Main dashboard ──────────────────────────────── */
export default function RetroDashboard({ onContactHoverChange, isMobile = false }: { onContactHoverChange?: (hovered: boolean) => void; isMobile?: boolean }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [copyHov, setCopyHov] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hparlatir05@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const titleStyles = isMobile 
    ? { fontSize: "12px", paddingBottom: "6px", marginBottom: "10px" } 
    : undefined;

  return (
    <>
      <style>{SCANLINES_STYLE}</style>
      <div
        className="retro-dash-wrap"
        style={{
          width:       "100%",
          height:      isMobile ? "auto" : "100%",
          background:  isMobile ? "transparent" : "#010800",
          color:       "#33ff00",
          fontFamily:  "'Courier New', Courier, monospace",
          fontSize:    isMobile ? "11px" : "clamp(7px, 0.9vw, 10px)",
          display:     isMobile ? "flex" : "grid",
          flexDirection: isMobile ? "column" : undefined,
          gridTemplateColumns: isMobile ? undefined : "1fr 2fr 1fr",
          gap:         isMobile ? "24px" : "6px",
          padding:     isMobile ? "12px 4px" : "8px",
          boxSizing:   "border-box",
          overflow:    isMobile ? "visible" : "hidden",
        }}
      >
        {/* ══ COLUMN 1: COMM LINKS ══════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", overflow: isMobile ? "visible" : "hidden" }}>
          <div className="col-title" style={titleStyles}>{t("dash_comm_links")}</div>
          <div style={{ flex: 1, overflowY: isMobile ? "visible" : "auto", overflowX: "hidden" }}>
            {LINKS.map(l => <LinkBtn key={l.label} {...l} isMobile={isMobile} />)}
          </div>
        </div>

        {/* ══ COLUMN 2: MEDIA FEED ══════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", overflow: isMobile ? "visible" : "hidden", gap: isMobile ? "10px" : "5px" }}>
          <div className="col-title" style={titleStyles}>{t("dash_media_feed")}</div>

          {/* YouTube embed — monochrome filter */}
          <div style={{
            flex:        "0 0 auto",
            aspectRatio: "16/9",
            position:    "relative",
            border:      "1px solid rgba(51,255,0,0.5)",
            boxShadow:   "0 0 10px rgba(51,255,0,0.25)",
            overflow:    "hidden",
            width:       isMobile ? "100%" : undefined,
            maxWidth:    isMobile ? "400px" : undefined,
            margin:      isMobile ? "0 auto" : undefined,
          }}>
            <iframe
              src="https://www.youtube.com/embed/GN6LFL6A1i8?autoplay=0&mute=1"
              title="Media Feed"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                width:   "100%",
                height:  "100%",
                border:  "none",
                filter:  "sepia(100%) hue-rotate(80deg) saturate(500%) contrast(1.8) brightness(0.8)",
                display: "block",
              }}
            />
          </div>

          {/* Diagnostic data stream */}
          <div style={{
            flex:       isMobile ? "0 0 auto" : "110vh",
            overflowY:  isMobile ? "visible" : "auto",
            borderTop:  "1px solid rgba(51,255,0,0.2)",
            paddingTop: "4px",
            opacity:    0.8,
          }}>
            <div style={{ marginBottom: "3px", color: "#1a8a00" }}>SYS_DIAG v1.0 --verbose</div>
            {DIAG_LINES.map((line, i) => (
              <div key={i} style={{
                fontSize:    isMobile ? "9px" : "clamp(6px, 0.75vw, 9px)",
                marginBottom:"2px",
                textShadow:  "0 0 3px #33ff00",
                letterSpacing: "0.04em",
              }}>
                {line}
              </div>
            ))}
          </div>

          {/* Email Copy section */}
          <div style={{
            flex: "0 0 auto",
            borderTop: "1px solid rgba(51,255,0,0.3)",
            paddingTop: "6px",
            marginTop: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "6px",
          }}>
            <span style={{ fontSize: isMobile ? "11px" : "clamp(7px, 0.85vw, 10px)", color: "#33ff00", letterSpacing: "0.05em", textShadow: "0 0 3px #33ff00" }}>
              hparlatir05@gmail.com
            </span>
            <button
              onClick={handleCopyEmail}
              onMouseEnter={() => setCopyHov(true)}
              onMouseLeave={() => setCopyHov(false)}
              style={{
                background: copyHov ? "#33ff00" : "transparent",
                border: "1px solid #33ff00",
                color: copyHov ? "#000" : "#33ff00",
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: isMobile ? "10px" : "clamp(6px, 0.75vw, 9px)",
                padding: isMobile ? "4px 8px" : "2px 6px",
                cursor: "pointer",
                transition: "all 0.1s",
                textShadow: copyHov ? "none" : "0 0 3px #33ff00",
              }}
            >
              {copied ? `[ ${t("dash_copied")} ]` : `[ ${t("dash_copy")} ]`}
            </button>
          </div>
        </div>

        {/* ══ COLUMN 3: SYSTEM CONTROLS ═════════════ */}
        <div style={{ display: "flex", flexDirection: "column", overflow: isMobile ? "visible" : "hidden", gap: "5px" }}>
          <div className="col-title" style={titleStyles}>{t("dash_sys_ctrl")}</div>

          {/* Contact button — top half */}
          <div style={{ flex: "0 0 auto" }}>
            <ContactBtn onHoverChange={onContactHoverChange} isMobile={isMobile} />
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px dashed rgba(51,255,0,0.3)", margin: "2px 0" }} />
          <div style={{ fontSize: isMobile ? "10px" : "clamp(6px, 0.7vw, 8px)", color: "#1a8a00", marginBottom: "2px" }}>
            {t("dash_subsystem_snake")}
          </div>

          {/* Snake game — bottom half */}
          <div style={{ flex: "1 1 auto", minHeight: isMobile ? "240px" : 0 }}>
            <RetroSnake />
          </div>
        </div>
      </div>
    </>
  );
}
