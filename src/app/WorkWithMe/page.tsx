"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import {
  Gamepad2, Cpu, Wrench, Film, Zap, Star, Trophy,
  Target, Shield, ChevronRight, X, Send, CheckCircle
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import SubPageLayout from "@/components/SubPageLayout";
import ParticleTextHero from "@/components/ParticleTextHero";
import GoldenParticles from "@/components/GoldenParticles";

// ─── Session key: animation plays once per browser session ───────────────────
const SESSION_ANIM_KEY = "wwm_panel_booted";

// ─── Terminal boot overlay ───────────────────────────────────────────────────
const BOOT_LINES = [
  "INITIALIZING HASAN_PARLATIR.SYS...",
  "LOADING SKILL_MODULES................. OK",
  "MOUNTING EXPERIENCE_DRIVE............. OK",
  "CALIBRATING CREATIVE_ENGINE........... OK",
  "ESTABLISHING SECURE_CHANNEL........... OK",
  "VERIFYING AVAILABILITY_STATUS......... 100%",
  "CONSOLE READY. WELCOME, OPERATOR.",
];

function TerminalBootOverlay({ onDone }: { onDone: () => void }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [sweeping, setSweeping] = useState(false);

  useEffect(() => {
    if (lineIdx < BOOT_LINES.length) {
      const t = setTimeout(() => setLineIdx(i => i + 1), lineIdx === BOOT_LINES.length - 1 ? 600 : 180);
      return () => clearTimeout(t);
    } else {
      // all lines printed — start sweep
      const t = setTimeout(() => setSweeping(true), 200);
      return () => clearTimeout(t);
    }
  }, [lineIdx]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={sweeping ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeIn", delay: sweeping ? 0.7 : 0 }}
      onAnimationComplete={() => { if (sweeping) onDone(); }}
      className="absolute inset-0 z-30 rounded-3xl bg-black flex flex-col justify-center px-8 md:px-16 overflow-hidden"
    >
      {/* Amber corner accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/60" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/60" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/60" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/60" />

      {/* Subtle scanline texture */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(251,191,36,0.015)_2px,rgba(251,191,36,0.015)_4px)] pointer-events-none" />

      <div className="space-y-1.5 max-w-xl">
        {BOOT_LINES.slice(0, lineIdx).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i === lineIdx - 1 ? 1 : 0.45, x: 0 }}
            transition={{ duration: 0.15 }}
            className={`font-orbitron text-[11px] tracking-widest ${i === BOOT_LINES.length - 1
                ? "text-amber-300 font-bold"
                : "text-green-400/80"
              }`}
          >
            <span className="text-amber-600/60 mr-2">&gt;</span>{line}
          </motion.div>
        ))}
        {/* Blinking cursor */}
        {lineIdx < BOOT_LINES.length && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="inline-block w-2 h-3.5 bg-amber-400 ml-4 align-middle"
          />
        )}
      </div>

      {/* Sweep reveal bar that runs top-to-bottom when sweeping */}
      {sweeping && (
        <motion.div
          initial={{ top: 0, opacity: 0.8 }}
          animate={{ top: "100%", opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeIn" }}
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_rgba(251,191,36,0.9)] pointer-events-none"
          style={{ position: "absolute" }}
        />
      )}
    </motion.div>
  );
}


// ─── localStorage key ───────────────────────────────────────────────────────
const LS_KEY = "wwm_trophies_v1";
type TrophyId = "game" | "software" | "debug" | "media" | "mission";

const TROPHY_META: Record<TrophyId, { label: string; cup: string; xp: number }> = {
  game: { label: "GAME_MASTER", cup: "/gallery/Cups/game cup.png", xp: 2500 },
  software: { label: "ARCHITECT", cup: "/gallery/Cups/software cup.png", xp: 1800 },
  debug: { label: "DEBUGGER", cup: "/gallery/Cups/debug cup.png", xp: 1200 },
  media: { label: "CREATOR", cup: "/gallery/Cups/desing cup.png", xp: 1500 },
  mission: { label: "FIRST_CONTACT", cup: "/gallery/Cups/main quest cup.png", xp: 3000 },
};

// ─── Scroll-triggered Skill bar ──────────────────────────────────────────────
function SkillBar({ label, value }: { label: string; value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between font-orbitron text-[9px] text-amber-400/80 uppercase tracking-widest">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${value}%` : 0 }}
          transition={{ duration: 1.3, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}

// ─── Scroll-triggered XP bar ─────────────────────────────────────────────────
function XPBar({ xp, maxXp, level, levelLabel }: { xp: number; maxXp: number; level: number; levelLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
            <span className="font-orbitron text-[10px] font-bold text-amber-400">{level}</span>
          </div>
          <span className="font-orbitron text-[9px] text-amber-400/70 tracking-widest uppercase">{levelLabel}</span>
        </div>
        <span className="font-orbitron text-[9px] text-amber-300/60">{xp.toLocaleString()} / {maxXp.toLocaleString()} XP</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/5 border border-amber-500/10 overflow-hidden relative">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-200 shadow-[0_0_12px_rgba(251,191,36,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${(xp / maxXp) * 100}%` : 0 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(255,255,255,0.03)_20px,rgba(255,255,255,0.03)_21px)]" />
      </div>
    </div>
  );
}

// ─── Scroll-triggered counter stat card ──────────────────────────────────────
function StatCard({ icon, value, label, sub, isNumber }: {
  icon: React.ReactNode; value: string; label: string; sub: string; isNumber?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [displayed, setDisplayed] = useState(isNumber ? "0" : value);

  useEffect(() => {
    if (!inView || !isNumber) return;
    const target = parseInt(value.replace(/\D/g, ""), 10);
    const suffix = value.replace(/[\d,]/g, "");
    if (isNaN(target)) return;
    let start = 0;
    const duration = 1400;
    const step = 16;
    const steps = Math.ceil(duration / step);
    let cur = 0;
    const id = setInterval(() => {
      cur++;
      const progress = cur / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setDisplayed(start.toLocaleString() + suffix);
      if (cur >= steps) { setDisplayed(value); clearInterval(id); }
    }, step);
    return () => clearInterval(id);
  }, [inView, isNumber, value]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.03, y: -3 }}
      transition={{ type: "spring", stiffness: 350 }}
      className="flex flex-col items-center text-center gap-2 p-5 rounded-2xl border border-amber-500/15 bg-black/40 backdrop-blur-sm hover:border-amber-400/35 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)] transition-all duration-200"
    >
      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">{icon}</div>
      <div className="font-orbitron text-2xl font-black text-amber-400 leading-none">{displayed}</div>
      <div className="font-orbitron text-[9px] text-white/80 tracking-wider uppercase leading-tight">{label}</div>
      <div className="font-rajdhani text-[10px] text-gray-500">{sub}</div>
    </motion.div>
  );
}

// ─── Quest modal ─────────────────────────────────────────────────────────────
interface QuestModalProps {
  open: boolean; onClose: () => void; onComplete: () => void;
  title: string; question: string; trophyId: TrophyId; alreadyEarned: boolean;
  labels: { activated: string; briefing: string; placeholder: string; submit: string; logged: string; reward: string; alreadyMsg: string; };
}
function QuestModal({ open, onClose, onComplete, title, question, trophyId, alreadyEarned, labels }: QuestModalProps) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim() || sending) return;
    setSending(true);
    try {
      await fetch("https://formspree.io/f/mjgqajrr", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          quest: title,
          question,
          answer,
          trophy: TROPHY_META[trophyId].label,
        }),
      });
    } catch {
      // Network errors shouldn't block the user from earning their trophy
    } finally {
      setSending(false);
      setSubmitted(true);
      setTimeout(() => {
        onComplete();
        setAnswer("");
        setSubmitted(false);
      }, 900);
    }
  };

  const meta = TROPHY_META[trophyId];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-sm" onClick={onClose} />
          <motion.div key="panel"
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="fixed inset-0 z-[310] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md bg-[#0a0700] border border-amber-500/40 rounded-2xl shadow-[0_0_60px_rgba(251,191,36,0.25)] overflow-hidden">
              {/* Header */}
              <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-orbitron text-[9px] tracking-[0.25em] text-amber-400/60 uppercase mb-0.5">{labels.activated}</div>
                  <div className="font-orbitron text-sm font-bold text-amber-300">{title}</div>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-amber-500/10 transition-colors cursor-pointer">
                  <X size={16} className="text-amber-400/60" />
                </button>
              </div>

              {submitted ? (
                <div className="p-8 flex flex-col items-center gap-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                    <CheckCircle size={48} className="text-amber-400" />
                  </motion.div>
                  <div className="font-orbitron text-sm text-amber-300 font-bold text-center">{labels.logged}</div>
                  {!alreadyEarned && (
                    <div className="font-orbitron text-[10px] text-green-400 tracking-widest">
                      +{meta.xp.toLocaleString()} XP · {meta.label}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-5 space-y-4">
                  {/* Trophy preview */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image src={meta.cup} alt={meta.label} fill className={`object-contain ${alreadyEarned ? "" : "opacity-30 grayscale"}`} />
                    </div>
                    <div>
                      <div className="font-orbitron text-[9px] text-amber-400/60 uppercase tracking-widest mb-0.5">{labels.reward}</div>
                      <div className="font-orbitron text-xs text-amber-300 font-bold">{meta.label}</div>
                      <div className="font-rajdhani text-[11px] text-gray-400">
                        {alreadyEarned ? labels.alreadyMsg : `+${meta.xp.toLocaleString()} XP`}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="font-orbitron text-[9px] text-amber-400/70 tracking-widest uppercase block mb-2">
                      {labels.briefing}
                    </label>
                    <p className="font-rajdhani text-sm text-gray-300 leading-relaxed mb-3">{question}</p>
                    <textarea
                      value={answer}
                      onChange={e => setAnswer(e.target.value)}
                      placeholder={labels.placeholder}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 focus:border-amber-400/50 focus:outline-none font-rajdhani text-sm text-gray-200 placeholder-gray-600 resize-none transition-colors"
                    />
                  </div>

                  {/* Submit — disabled & blocked if already earned */}
                  {alreadyEarned ? (
                    <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-amber-500/30 bg-amber-500/5 font-orbitron text-[10px] text-amber-400/60 tracking-widest uppercase">
                      <CheckCircle size={13} />
                      <span>{labels.alreadyMsg}</span>
                    </div>
                  ) : (
                    <motion.button
                      onClick={handleSubmit}
                      disabled={!answer.trim() || sending}
                      whileHover={answer.trim() && !sending ? { scale: 1.02 } : {}}
                      whileTap={answer.trim() && !sending ? { scale: 0.97 } : {}}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-400 text-black font-orbitron text-xs font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-opacity"
                    >
                      {sending ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            className="inline-block w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full"
                          />
                          <span>TRANSMITTING...</span>
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          <span>{labels.submit}</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Quest card ──────────────────────────────────────────────────────────────
interface QuestCardProps {
  icon: React.ReactNode; title: string; desc: string; reward: string;
  difficulty: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  earned: boolean; onClick: () => void; rewardLabel: string;
}
function QuestCard({ icon, title, desc, reward, difficulty, earned, onClick, rewardLabel }: QuestCardProps) {
  const diffColor = {
    COMMON: "text-gray-400 border-gray-500/30 bg-gray-500/10",
    RARE: "text-blue-400 border-blue-400/30 bg-blue-500/10",
    EPIC: "text-purple-400 border-purple-400/30 bg-purple-500/10",
    LEGENDARY: "text-amber-400 border-amber-400/40 bg-amber-500/15",
  }[difficulty];

  return (
    <motion.div
      whileHover={{ scale: 1.025, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      onClick={onClick}
      className={`relative group p-6 rounded-2xl border flex flex-col gap-4 overflow-hidden cursor-pointer select-none
        ${earned
          ? "border-amber-400/50 bg-amber-500/[0.08] shadow-[0_0_20px_rgba(251,191,36,0.12)]"
          : "border-amber-500/20 bg-black/45 hover:border-amber-400/45 hover:shadow-[0_0_28px_rgba(251,191,36,0.15)]"
        } transition-[border-color,box-shadow] duration-200`}
    >
      {earned && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />}
      <div className="absolute top-0 right-0 w-14 h-14 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-0 h-0 border-l-[56px] border-l-transparent border-t-[56px] transition-colors duration-200 ${earned ? "border-t-amber-500/25" : "border-t-amber-500/[0.08] group-hover:border-t-amber-500/20"}`} />
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl border transition-all duration-200 ${earned ? "bg-amber-500/20 border-amber-400/50" : "bg-amber-500/10 border-amber-500/25 group-hover:bg-amber-500/[0.18] group-hover:border-amber-400/45"}`}>
            {icon}
          </div>
          <div>
            <h3 className={`font-orbitron text-sm font-bold leading-tight transition-colors duration-200 ${earned ? "text-amber-300" : "text-white group-hover:text-amber-300"}`}>{title}</h3>
            <span className={`text-[8px] font-orbitron tracking-widest uppercase px-1.5 py-0.5 rounded border mt-1 inline-block ${diffColor}`}>{difficulty}</span>
          </div>
        </div>
        {earned
          ? <CheckCircle size={16} className="mt-1 flex-shrink-0 text-amber-400" />
          : <ChevronRight size={16} className="mt-1 flex-shrink-0 text-amber-500/40 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all duration-200" />
        }
      </div>

      <p className="text-xs text-gray-400 leading-relaxed font-rajdhani flex-1">{desc}</p>

      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex items-center gap-1.5">
          <Star size={10} className="text-amber-400" />
          <span className="font-orbitron text-[9px] text-amber-400/70 uppercase tracking-wider">{rewardLabel}</span>
          <span className="font-orbitron text-[9px] text-amber-300">{reward}</span>
        </div>
        <div className={`w-1.5 h-1.5 rounded-full ${earned ? "bg-amber-400" : "bg-green-400 animate-pulse"}`} />
      </div>
    </motion.div>
  );
}

// ─── Trophy showcase ─────────────────────────────────────────────────────────
function TrophyShowcase({ earned, title, unlockedWord, hint }: {
  earned: Set<TrophyId>; title: string; unlockedWord: string; hint: string;
}) {
  const entries = Object.entries(TROPHY_META) as [TrophyId, typeof TROPHY_META[TrophyId]][];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full border border-amber-500/20 rounded-3xl bg-black/50 backdrop-blur-md overflow-hidden shadow-[0_0_50px_rgba(251,191,36,0.07)]"
    >
      <div className="bg-amber-500/[0.08] border-b border-amber-500/15 px-6 py-4 flex items-center gap-3">
        <Trophy size={16} className="text-amber-400" />
        <span className="font-orbitron text-xs tracking-[0.2em] text-amber-400 uppercase">{title}</span>
        <div className="ml-auto font-orbitron text-[10px] text-amber-400/50">
          {earned.size} / {entries.length} {unlockedWord}
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
        {entries.map(([id, meta]) => {
          const isEarned = earned.has(id);
          return (
            <motion.div key={id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="flex flex-col items-center gap-2"
            >
              <div className={`relative w-20 h-20 rounded-2xl border flex items-center justify-center transition-all duration-300 ${isEarned ? "border-amber-400/50 bg-amber-500/10 shadow-[0_0_20px_rgba(251,191,36,0.2)]" : "border-white/[0.08] bg-white/[0.03]"
                }`}>
                {isEarned && (
                  <motion.div animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl bg-amber-400/10" />
                )}
                <div className="relative w-14 h-14">
                  <Image src={meta.cup} alt={meta.label} fill className={`object-contain transition-all duration-300 ${isEarned ? "" : "grayscale opacity-20"}`} />
                </div>
                {isEarned && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 border border-black flex items-center justify-center">
                    <CheckCircle size={9} className="text-black" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className={`font-orbitron text-[8px] tracking-widest uppercase ${isEarned ? "text-amber-400" : "text-gray-600"}`}>{meta.label}</div>
                {isEarned && <div className="font-rajdhani text-[10px] text-green-400">+{meta.xp.toLocaleString()} XP</div>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {earned.size === 0 && (
        <div className="px-6 pb-6 text-center font-rajdhani text-xs text-gray-600">{hint}</div>
      )}
    </motion.div>
  );
}

// ─── Achievement toast ────────────────────────────────────────────────────────
function AchievementToast({ id, onDone, achievementTitle, xpLabel }: {
  id: TrophyId; onDone: () => void; achievementTitle: string; xpLabel: string;
}) {
  const meta = TROPHY_META[id];
  useEffect(() => { const t = setTimeout(onDone, 3800); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 0, x: 120 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 120 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="fixed top-20 right-5 z-[400] flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0a0700] border border-amber-400/60 backdrop-blur-md shadow-[0_0_40px_rgba(251,191,36,0.35)]"
    >
      <div className="relative w-11 h-11 flex-shrink-0">
        <Image src={meta.cup} alt={meta.label} fill className="object-contain" />
      </div>
      <div>
        <div className="font-orbitron text-[9px] text-amber-400/60 tracking-widest uppercase">{achievementTitle}</div>
        <div className="font-orbitron text-xs text-amber-300 font-bold">{meta.label}</div>
        <div className="font-rajdhani text-[10px] text-green-400">+{meta.xp.toLocaleString()} {xpLabel}</div>
      </div>
    </motion.div>
  );
}

// ─── QUEST CONFIG ─────────────────────────────────────────────────────────────
interface QuestConfig {
  id: TrophyId;
  difficulty: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  reward: string;
  question: string;
  title: string;
  icon: React.ReactNode;
  desc: string;
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function WorkWithMePage() {
  const { t } = useLanguage();

  const [isMobileDevice, setIsMobileDevice] = React.useState(false);
  React.useEffect(() => {
    const isMobileSize = window.innerWidth < 768;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobileDevice(isMobileSize || isMobileUA);
  }, []);

  const [earned, setEarned] = useState<Set<TrophyId>>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return new Set(JSON.parse(raw) as TrophyId[]);
    } catch { /* ignore */ }
    return new Set();
  });
  const [toast, setToast] = useState<TrophyId | null>(null);
  const [modal, setModal] = useState<QuestConfig | null>(null);
  const [missionAccepted, setMissionAccepted] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem("wwm_mission") !== null : false;
  });
  // Boot animation: plays once per session
  const [bootDone, setBootDone] = useState(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_ANIM_KEY) !== null : false;
  });
  const [skipBoot] = useState(false);

  const handleBootDone = useCallback(() => {
    setBootDone(true);
    sessionStorage.setItem(SESSION_ANIM_KEY, "1");
  }, []);


  const earnTrophy = useCallback((id: TrophyId) => {
    setEarned(prev => {
      if (prev.has(id)) return prev; // already earned — no duplicate
      const next = new Set(prev);
      next.add(id);
      try { localStorage.setItem(LS_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
      setToast(id);
      return next;
    });
  }, []);

  const handleAcceptMission = () => {
    setMissionAccepted(true);
    try { localStorage.setItem("wwm_mission", "1"); } catch { /* ignore */ }
    earnTrophy("mission");
    setTimeout(() => { window.location.href = "mailto:hparlatir05@gmail.com"; }, 600);
  };

  const quests: QuestConfig[] = [
    { id: "game", title: t("work_service_game_title"), desc: t("work_service_game_desc"), icon: <Gamepad2 size={22} className="text-amber-400" />, difficulty: "LEGENDARY", reward: t("work_r_game"), question: t("work_q_game") },
    { id: "software", title: t("work_service_soft_title"), desc: t("work_service_soft_desc"), icon: <Cpu size={22} className="text-amber-400" />, difficulty: "EPIC", reward: t("work_r_software"), question: t("work_q_software") },
    { id: "debug", title: t("work_service_debug_title"), desc: t("work_service_debug_desc"), icon: <Wrench size={22} className="text-amber-400" />, difficulty: "RARE", reward: t("work_r_debug"), question: t("work_q_debug") },
    { id: "media", title: t("work_service_media_title"), desc: t("work_service_media_desc"), icon: <Film size={22} className="text-amber-400" />, difficulty: "EPIC", reward: t("work_r_media"), question: t("work_q_media") },
  ];

  const modalLabels = {
    activated: t("work_modal_quest_activated"),
    briefing: t("work_modal_mission_briefing"),
    placeholder: t("work_modal_answer_placeholder"),
    submit: t("work_modal_submit"),
    logged: t("work_modal_logged"),
    reward: t("work_modal_reward"),
    alreadyMsg: t("work_modal_already_earned"),
  };

  // Replace {level} placeholder in lvl_label
  const lvlLabel = t("work_lvl_label").replace("{level}", "87");

  return (
    <SubPageLayout
      gradientClass={isMobileDevice 
        ? "bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.25),transparent_70%),linear-gradient(to_bottom,#151000,#080500)]" 
        : "bg-[radial-gradient(ellipse_at_50%_0%,rgba(251,191,36,0.08),transparent_55%),radial-gradient(ellipse_at_80%_100%,rgba(245,158,11,0.06),transparent_50%),radial-gradient(ellipse_at_20%_50%,rgba(253,230,138,0.04),transparent_40%)]"
      }
      skyboxPath="/Skybox/workwhitme.png"
      autoRotateSkybox={true}
    >
      <GoldenParticles />
      {!isMobileDevice && (
        <ParticleTextHero text={t("work_title") || "Work With Me"} color="#f59e0b" />
      )}

      {/* Achievement toast */}
      <AnimatePresence>
        {toast && (
          <AchievementToast
            key={toast + "-toast"}
            id={toast}
            onDone={() => setToast(null)}
            achievementTitle={t("work_achievement_title")}
            xpLabel={t("work_achievement_xp")}
          />
        )}
      </AnimatePresence>

      {/* Quest modal */}
      {modal && (
        <QuestModal
          open={!!modal}
          onClose={() => setModal(null)}
          onComplete={() => { earnTrophy(modal.id); setModal(null); }}
          title={modal.title}
          question={modal.question}
          trophyId={modal.id}
          alreadyEarned={earned.has(modal.id)}
          labels={modalLabels}
        />
      )}

      <section className="pb-20 px-6 relative overflow-hidden" id="work-with-me">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(251,191,36,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,191,36,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-yellow-400/5 blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10 space-y-8">

          {/* ═══ MAIN TERMINAL CARD ═══ */}
          <motion.div
            initial={skipBoot ? false : { opacity: 0, y: 50, scale: 0.97 }}
            animate={bootDone ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="w-full glass border border-amber-500/20 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(251,191,36,0.12),0_0_160px_rgba(251,191,36,0.05)] flex flex-col relative"
          >
            {/* Boot overlay — only shown on first visit this session */}
            {!skipBoot && !bootDone && (
              <TerminalBootOverlay onDone={handleBootDone} />
            )}

            {/* Amber glow pulse that fires once boot completes */}
            <AnimatePresence>
              {bootDone && !skipBoot && (
                <motion.div
                  key="glow-pulse"
                  initial={{ opacity: 0.7, scale: 0.95 }}
                  animate={{ opacity: 0, scale: 1.04 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                  className="absolute -inset-2 rounded-3xl bg-amber-400/10 blur-xl pointer-events-none z-10"
                />
              )}
            </AnimatePresence>

            {/* Header bar */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="bg-black/70 border-b border-amber-500/20 px-6 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 font-orbitron text-[10px] sm:text-xs text-amber-500/80 tracking-widest uppercase">CONSOLE://HASAN_PARLATIR.SYS</span>
              </div>
              <div className="flex items-center gap-3 font-orbitron text-[10px] text-amber-500/40">
                <span className="hidden sm:inline">LOC: EARTH // REMOTE</span>
                <span className="hidden sm:inline">|</span>
                <span>SEC: FREELANCE_COLLAB</span>
              </div>
            </motion.div>

            {/* Body */}
            <div className="p-8 md:p-12 bg-gradient-to-b from-black/20 to-black/70 backdrop-blur-md flex flex-col gap-10">

              {/* Title section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="text-center space-y-5 max-w-4xl mx-auto w-full border-b border-amber-500/10 pb-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.15)] mb-2 relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 absolute" />
                  <span className="font-orbitron text-[10px] tracking-[0.2em] text-amber-400 font-bold uppercase ml-3">{t("work_status")}</span>
                </div>
                <motion.h1
                  animate={{ textShadow: ["0 0 15px rgba(251,191,36,0.7), 0 0 30px rgba(251,191,36,0.3)", "0 0 25px rgba(251,191,36,0.95), 0 0 55px rgba(251,191,36,0.5)", "0 0 15px rgba(251,191,36,0.7), 0 0 30px rgba(251,191,36,0.3)"] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black font-orbitron text-amber-400 tracking-wider text-center uppercase"
                >{t("work_title")}</motion.h1>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  {[
                    { icon: <Zap size={11} />, key: "work_badge_exp" },
                    { icon: <Target size={11} />, key: "work_badge_projects" },
                    { icon: <Shield size={11} />, key: "work_badge_available" },
                    { icon: <Trophy size={11} />, key: "work_badge_domain" },
                  ].map((badge, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.08, type: "spring", stiffness: 300 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25"
                    >
                      <span className="text-amber-400">{badge.icon}</span>
                      <span className="font-orbitron text-[9px] tracking-widest text-amber-300/80 uppercase">{t(badge.key as any)}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Profile + Quest grid */}
              <div className="flex flex-col lg:flex-row gap-10 items-start">

                {/* Left: Profile + Skill bars */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.6 }}
                  className="w-full lg:w-[310px] flex-shrink-0 flex flex-col gap-5"
                >
                  <div className="flex flex-col items-center p-6 border border-amber-500/15 bg-black/40 rounded-2xl relative overflow-hidden group/photo">
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-500/40" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500/40" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500/40" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-500/40" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
                    <div className="relative w-48 h-48 rounded-full overflow-hidden mb-5 border-2 border-amber-500/40 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
                      <Image src="/gallery/bne.png" alt="Hasan Parlatır" fill sizes="192px" className="object-cover z-10 transition-transform duration-700 group-hover/photo:scale-105" />
                      <motion.div animate={{ y: ["0%", "100%", "0%"] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-0.5 bg-amber-400/70 shadow-[0_0_15px_rgba(251,191,36,1)] z-20 pointer-events-none" style={{ top: 0 }} />
                      <div className="absolute w-44 h-44 border border-amber-500/25 rounded-full animate-[spin_18s_linear_infinite]" />
                      <div className="absolute w-36 h-36 border border-yellow-500/15 rounded-full animate-[spin_28s_linear_infinite_reverse]" />
                    </div>
                    <div className="w-full space-y-2 font-orbitron text-[10px] text-amber-400/80 border-t border-amber-500/10 pt-4">
                      {[
                        { label: t("work_diag_op"), value: "HASAN PARLATIR" },
                        { label: t("work_diag_sec"), value: "GAME / APP DEV" },
                        { label: t("work_diag_int"), value: "TERMINAL V4.2" },
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between border-b border-amber-500/5 pb-1.5">
                          <span>{row.label}</span><span className="text-white font-semibold">{row.value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-0.5">
                        <span>{t("work_diag_sync")}</span>
                        <span className="text-green-400 font-bold animate-pulse">{t("work_diag_sync_val")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skill bars — scroll triggered */}
                  <div className="p-5 border border-amber-500/15 bg-black/40 rounded-2xl space-y-4">
                    <div className="font-orbitron text-[9px] tracking-widest text-amber-400/60 uppercase border-b border-amber-500/10 pb-2">{t("work_char_stats")}</div>
                    <XPBar xp={8750} maxXp={10000} level={87} levelLabel={lvlLabel} />
                    <div className="space-y-3 pt-1">
                      <SkillBar label="Game Dev" value={92} />
                      <SkillBar label="Web / API" value={88} />
                      <SkillBar label="C++ / C#" value={85} />
                      <SkillBar label="UI Design" value={78} />
                      <SkillBar label="Creative Media" value={82} />
                    </div>
                  </div>
                </motion.div>

                {/* Right: Quests */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex-1 flex flex-col gap-5"
                >
                  <div className="font-orbitron text-[9px] tracking-[0.25em] text-amber-400/50 uppercase flex items-center gap-2">
                    <div className="h-px flex-1 bg-amber-500/10" />
                    <span>{t("work_quests_title")}</span>
                    <div className="h-px flex-1 bg-amber-500/10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {quests.map(q => (
                      <QuestCard
                        key={q.id}
                        icon={q.icon} title={q.title} desc={q.desc}
                        reward={q.reward} difficulty={q.difficulty}
                        earned={earned.has(q.id)}
                        rewardLabel={t("work_reward_label")}
                        onClick={() => setModal(q)}
                      />
                    ))}
                  </div>

                  <div className="mt-4" />

                  {/* Mission CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                    className="p-6 rounded-2xl border border-amber-500/25 bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-amber-950/40 relative overflow-hidden"
                  >
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 2.5 }}
                      className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-amber-400/[0.06] to-transparent pointer-events-none"
                    />
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
                      <div className="space-y-1.5">
                        <div className="font-orbitron text-[9px] tracking-[0.3em] text-amber-400/60 uppercase">{t("work_main_quest_label")}</div>
                        <h3 className="font-orbitron text-lg font-bold text-white">
                          {t("work_main_quest_title")} <span className="text-amber-400">{t("work_main_quest_highlight")}</span>
                        </h3>
                        <p className="text-xs text-gray-400 font-rajdhani max-w-xs">{t("work_main_quest_desc")}</p>
                      </div>
                      <motion.button
                        id="accept-mission-btn"
                        onClick={handleAcceptMission}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                        animate={missionAccepted ? {} : { boxShadow: ["0 0 15px rgba(251,191,36,0.3)", "0 0 35px rgba(251,191,36,0.65)", "0 0 15px rgba(251,191,36,0.3)"] }}
                        transition={missionAccepted ? {} : { duration: 2, repeat: Infinity }}
                        className="flex-shrink-0 flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-400 text-black font-orbitron text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.75)] transition-shadow duration-300 cursor-pointer"
                      >
                        {missionAccepted
                          ? <><Trophy size={15} /><span>{t("work_mission_active")}</span></>
                          : <><Zap size={15} /><span>{t("work_accept_mission")}</span></>
                        }
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ═══ BOTTOM STATS ROW (scroll-triggered counters) ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <StatCard icon={<Trophy size={18} className="text-amber-400" />} value="5" label={t("work_stat_dev_level")} sub={t("work_stat_dev_level_sub")} isNumber />
            <StatCard icon={<Target size={18} className="text-amber-400" />} value="20+" label={t("work_stat_quests")} sub={t("work_stat_quests_sub")} isNumber />
            <StatCard icon={<Zap size={18} className="text-amber-400" />} value="8,750" label={t("work_stat_xp")} sub={t("work_stat_xp_sub")} isNumber />
            <StatCard icon={<Star size={18} className="text-amber-400" />} value="∞" label={t("work_stat_ideas")} sub={t("work_stat_ideas_sub")} />
          </motion.div>

          {/* ═══ TROPHY SHOWCASE (below stat cards) ═══ */}
          <TrophyShowcase
            earned={earned}
            title={t("work_trophy_title")}
            unlockedWord={t("work_trophy_unlocked")}
            hint={t("work_trophy_hint")}
          />

        </div>
      </section>
    </SubPageLayout>
  );
}
