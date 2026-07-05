"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Music, Upload, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { FaSpotify } from "react-icons/fa6";

// Stem themes containing warm palettes for Vocal and cool palettes for Instrumental
const STREAMS_THEMES = {
  dualStems: {
    vocal: ["#FF3B30", "#FF9500", "#FFCC00", "#FF2D55"], // Red/Orange/Yellow
    instrumental: ["#007AFF", "#5856D6", "#00C7BE", "#AF52DE"] // Blue/Teal/Purple
  },
  neonStems: {
    vocal: ["#FF0055", "#FF00AA", "#D400FF", "#9E00FF"], // Neon Pink/Purple
    instrumental: ["#00FFFF", "#00AAFF", "#0055FF", "#00FF88"] // Neon Cyan/Blue
  },
  amberIce: {
    vocal: ["#FFCC00", "#FFAA00", "#FF7700", "#FFDD55"], // Gold/Amber
    instrumental: ["#88DDFF", "#33BBFF", "#0088FF", "#E6F7FF"] // Ice/Blue
  },
  monochrome: {
    vocal: ["#FFFFFF", "#DDDDDD", "#BBBBBB", "#EEEEEE"], // White
    instrumental: ["#888888", "#555555", "#333333", "#666666"] // Grays
  }
};

type ThemeName = keyof typeof STREAMS_THEMES;
const THEME_NAMES: { [key in ThemeName]: string } = {
  dualStems: "Warm Stems & Cool Beats",
  neonStems: "Neon Cyberpunk",
  amberIce: "Amber & Ice",
  monochrome: "Noir Stems"
};

const MODES = ["cubic", "conic"] as const;
type Mode = typeof MODES[number];

// Customizable properties for the interactive light spiral trail
const SPIRAL_CONFIG = {
  trails: 80,       // Number of concurrent spring trails
  size: 45,         // Number of nodes per trail (length of the trail)
  friction: 0.5,    // Friction coefficient (velocity decay)
  dampening: 0.5,  // Dampening transfer from parent node
  tension: 0.98,    // Tension decay factor along the spring chain
  lineWidth: 5,   // Width of the spiral stroke
  hueOffset: 285,   // Base HSL hue value
  hueAmplitude: 85, // Sinusoidal amplitude for color phase cycling
  hueFrequency: 0.01 // Frequency of hue shift per frame
};

interface SpiralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface SpiralTrail {
  spring: number;
  friction: number;
  nodes: SpiralNode[];
}

interface Particle {
  xInit: number;
  yInit: number;
  x: number;
  y: number;
  s: number;
  scale: number;
  mouseRad: number;
  indexBand: number;
  color: string;
}

const TOTAL_BANDS = 256;
const NUM_PARTICLES = 3000; // Performance optimized density

export default function ContactVisualizer() {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customAudioName, setCustomAudioName] = useState<string>("");
  const customAudioUrlRef = useRef<string | null>(null);
  useEffect(() => {
    customAudioUrlRef.current = customAudioUrl;
  }, [customAudioUrl]);
  const [mode, setMode] = useState<Mode>("cubic");
  const [theme, setTheme] = useState<ThemeName>("dualStems");
  const [showOverlay, setShowOverlay] = useState(true);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  useEffect(() => {
    const isMobileSize = window.innerWidth < 768;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobileDevice(isMobileSize || isMobileUA);
  }, []);

  // Audio elements refs
  const audioMasterRef = useRef<HTMLAudioElement | null>(null);
  const audioVocalRef = useRef<HTMLAudioElement | null>(null);
  const audioInstrumentalRef = useRef<HTMLAudioElement | null>(null);

  // Source nodes refs
  const sourceMasterRef = useRef<MediaElementAudioSourceNode | null>(null);
  const sourceVocalRef = useRef<MediaElementAudioSourceNode | null>(null);
  const sourceInstrumentalRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Analyser nodes refs
  const analyserVocalRef = useRef<AnalyserNode | null>(null);
  const analyserInstrumentalRef = useRef<AnalyserNode | null>(null);

  // Frequencies byte array refs
  const dataArrayVocalRef = useRef<Uint8Array | null>(null);
  const dataArrayInstrumentalRef = useRef<Uint8Array | null>(null);

  // Shared AudioContext
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Particle tracking
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1, y: -1, easeX: 0, easeY: 0 });

  // Light spiral tracking
  const trailsRef = useRef<SpiralTrail[]>([]);
  const spiralPhaseRef = useRef<number>(Math.random() * Math.PI * 2);

  // Initialize light spiral trails
  const initSpiral = useCallback((x: number, y: number) => {
    const newTrails: SpiralTrail[] = [];
    for (let t = 0; t < SPIRAL_CONFIG.trails; t++) {
      const spring = 0.45 + 0.025 * (t / SPIRAL_CONFIG.trails);
      const friction = SPIRAL_CONFIG.friction + 0.01 * Math.random() - 0.005;

      const nodes: SpiralNode[] = [];
      for (let i = 0; i < SPIRAL_CONFIG.size; i++) {
        nodes.push({ x, y, vx: 0, vy: 0 });
      }

      newTrails.push({ spring, friction, nodes });
    }
    trailsRef.current = newTrails;
  }, []);
  const centerRef = useRef({ x: 0, y: 0 });
  const canvasDimensions = useRef({ width: 0, height: 0 });
  const animationFrameId = useRef<number | null>(null);

  // Helper to convert hex to rgba string
  const hexToRgba = (hex: string, alpha: number = 0.7) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Helper to generate particle positions and assign groups (Halves)
  const generateParticles = useCallback((
    width: number,
    height: number,
    currentMode: Mode,
    activeTheme: typeof STREAMS_THEMES[ThemeName],
    existingParticles: Particle[]
  ): Particle[] => {
    const cpX = width * 0.5;
    const cpY = height * 0.5;
    const size = 0.45; // Size factor relative to container height
    const sizeW = height * size;
    const sizeH = height * size;

    const result: Particle[] = [];
    const half = NUM_PARTICLES / 2;

    // Group A (Vocal Stems) - First Half
    const vocalColors = activeTheme.vocal;
    const vocalPad = Math.ceil(half / vocalColors.length);
    let vocalIndexColor = 0;

    // Group B (Instrumental Stems) - Second Half
    const instColors = activeTheme.instrumental;
    const instPad = Math.ceil(half / instColors.length);
    let instIndexColor = 0;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const isVocal = i < half;

      let indexBand = 0;
      let s = 0;
      let rawColor = "";

      if (isVocal) {
        // Group A (vocal) mapping
        const groupRatio = (vocalIndexColor * vocalPad) / half;
        indexBand = Math.round(groupRatio * (TOTAL_BANDS - 56)) - 1;
        if (indexBand <= 0) indexBand = 49;

        s = (Math.random() + (vocalColors.length - vocalIndexColor) * 0.2) * 0.08;
        rawColor = vocalColors[vocalIndexColor - 1] || vocalColors[0];

        if (i % vocalPad === 0) {
          vocalIndexColor++;
        }
      } else {
        // Group B (instrumental) mapping
        const groupIndex = i - half;
        const groupRatio = (instIndexColor * instPad) / half;
        indexBand = Math.round(groupRatio * (TOTAL_BANDS - 56)) - 1;
        if (indexBand <= 0) indexBand = 49;

        s = (Math.random() + (instColors.length - instIndexColor) * 0.2) * 0.08;
        rawColor = instColors[instIndexColor - 1] || instColors[0];

        if (groupIndex % instPad === 0) {
          instIndexColor++;
        }
      }

      const color = hexToRgba(rawColor, theme === "monochrome" ? 0.9 : 0.6);

      let xInit = cpX;
      let yInit = cpY;

      if (currentMode === "cubic") {
        xInit = cpX + (Math.random() * sizeW - sizeW / 2);
        yInit = cpY + (Math.random() * sizeH - sizeH / 2);
      } else {
        const angle = Math.random() * Math.PI * 2;
        xInit = cpX + Math.cos(angle) * sizeW;
        yInit = cpY + Math.sin(angle) * sizeH;
      }

      const existing = existingParticles[i];
      result.push({
        xInit,
        yInit,
        x: existing ? existing.x : cpX,
        y: existing ? existing.y : cpY,
        s,
        scale: existing ? existing.scale : s * 0.1,
        mouseRad: existing ? existing.mouseRad : Math.random(),
        indexBand,
        color
      });
    }

    return result;
  }, [theme]);

  // Update particles positions and redraw
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvasDimensions.current;
    const particles = particlesRef.current;

    const audioMaster = audioMasterRef.current;
    const audioVocal = audioVocalRef.current;
    const audioInstrumental = audioInstrumentalRef.current;

    const dataArrayVocal = dataArrayVocalRef.current;
    const dataArrayInstrumental = dataArrayInstrumentalRef.current;
    const analyserVocal = analyserVocalRef.current;
    const analyserInstrumental = analyserInstrumentalRef.current;

    // Get byte frequency data for both stems
    if (isPlaying) {
      if (analyserVocal && dataArrayVocal) {
        analyserVocal.getByteFrequencyData(dataArrayVocal as any);
      }
      if (analyserInstrumental && dataArrayInstrumental) {
        analyserInstrumental.getByteFrequencyData(dataArrayInstrumental as any);
      }

      // Synchronize stem tracks to the master audio to correct latency drifts
      if (audioMaster) {
        const masterTime = audioMaster.currentTime;
        if (audioVocal && Math.abs(audioVocal.currentTime - masterTime) > 0.04) {
          audioVocal.currentTime = masterTime;
        }
        if (audioInstrumental && Math.abs(audioInstrumental.currentTime - masterTime) > 0.04) {
          audioInstrumental.currentTime = masterTime;
        }
      }
    }

    // Ease mouse towards raw target mouse coordinates
    const mouse = mouseRef.current;
    const cp = centerRef.current;
    const t = performance.now() / 60;

    if (mouse.x >= 0 && mouse.y >= 0) {
      mouse.easeX += (mouse.x - mouse.easeX) * 0.03;
      mouse.easeY += (mouse.y - mouse.easeY) * 0.03;
    } else {
      // Idle animation (orbiting target)
      const a = t * 0.04;
      const radiusOrbit = Math.min(width, height) * 0.15;
      mouse.easeX += (cp.x + Math.cos(a) * radiusOrbit - mouse.easeX) * 0.03;
      mouse.easeY += (cp.y + Math.sin(a) * radiusOrbit - mouse.easeY) * 0.03;
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update and draw the interactive spring light spiral trail tracking the cursor
    if (trailsRef.current.length === 0) {
      initSpiral(cp.x, cp.y);
    }

    spiralPhaseRef.current += SPIRAL_CONFIG.hueFrequency;
    const hueVal = SPIRAL_CONFIG.hueOffset + Math.sin(spiralPhaseRef.current) * SPIRAL_CONFIG.hueAmplitude;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = SPIRAL_CONFIG.lineWidth;
    ctx.strokeStyle = `hsla(${Math.round(hueVal)}, 90%, 50%, 0.25)`;

    const trails = trailsRef.current;
    const tx = mouse.easeX;
    const ty = mouse.easeY;

    for (let t = 0; t < trails.length; t++) {
      const trail = trails[t];

      // Update Head Node
      const head = trail.nodes[0];
      head.vx += (tx - head.x) * trail.spring;
      head.vy += (ty - head.y) * trail.spring;

      // Update Child Nodes
      let springFactor = trail.spring;
      for (let i = 0; i < trail.nodes.length; i++) {
        const node = trail.nodes[i];
        if (i > 0) {
          const prev = trail.nodes[i - 1];
          node.vx += (prev.x - node.x) * springFactor;
          node.vy += (prev.y - node.y) * springFactor;
          node.vx += prev.vx * SPIRAL_CONFIG.dampening;
          node.vy += prev.vy * SPIRAL_CONFIG.dampening;
        }

        node.vx *= trail.friction;
        node.vy *= trail.friction;
        node.x += node.vx;
        node.y += node.vy;

        // Decay spring tension along the chain
        springFactor *= SPIRAL_CONFIG.tension;
      }

      // Draw quadratic curve linking nodes of this trail
      const n0 = trail.nodes[0];
      ctx.beginPath();
      ctx.moveTo(n0.x, n0.y);

      let a = 1;
      const endLimit = trail.nodes.length - 2;
      for (; endLimit > a; a++) {
        const curr = trail.nodes[a];
        const next = trail.nodes[a + 1];
        const midX = 0.5 * (curr.x + next.x);
        const midY = 0.5 * (curr.y + next.y);
        ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
      }

      const lastCurr = trail.nodes[a];
      const lastNext = trail.nodes[a + 1];
      ctx.quadraticCurveTo(lastCurr.x, lastCurr.y, lastNext.x, lastNext.y);
      ctx.stroke();
      ctx.closePath();
    }
    ctx.restore();

    // Blending Mode
    ctx.globalCompositeOperation = theme === "monochrome" ? "source-over" : "lighter";

    // Loop through particles
    const half = NUM_PARTICLES / 2;
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const p = particles[i];
      if (!p) continue;

      const isVocal = i < half;
      let audioValue = 0;

      if (isPlaying) {
        if (isVocal && dataArrayVocal) {
          audioValue = dataArrayVocal[p.indexBand] || 0;
        } else if (!isVocal && dataArrayInstrumental) {
          audioValue = dataArrayInstrumental[p.indexBand] || 0;
        }
      }

      // Dynamic reactive scaling
      let scale = p.s * 0.15;
      if (isPlaying) {
        scale = (audioValue / 256) * p.s * 2.5;
      }
      scale *= 2.5; // Scale multiplier
      p.scale += (scale - p.scale) * 0.3;

      // Dynamic physics calculations driven by audio
      const audioFactor = isPlaying ? (audioValue / 256) : 0;
      const distanceRepel = 600;

      // Repulsion radius expands dynamically on beats
      const r = p.mouseRad * distanceRepel * (0.6 + audioFactor * 0.8) + 30;

      const dx = mouse.easeX - p.xInit;
      const dy = mouse.easeY - p.yInit;
      const angle = Math.atan2(dy, dx);
      const xpos = p.xInit - Math.cos(angle) * r;
      const ypos = p.yInit - Math.sin(angle) * r;

      // Easing speed increases dynamically with beat (0.05 when quiet, up to 0.15 on peaks)
      const easeVelocity = 0.05 + audioFactor * 0.1;
      p.x += (xpos - p.x) * easeVelocity;
      p.y += (ypos - p.y) * easeVelocity;

      // Draw particle circle
      const drawRadius = p.scale * 60;
      if (drawRadius > 0.15) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
    }

    animationFrameId.current = requestAnimationFrame(animate);
  }, [isPlaying, theme]);

  // Handle Resize using ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const canvas = canvasRef.current;
        if (!canvas) continue;

        // Account for device pixel ratio for sharp canvas rendering
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvasDimensions.current = { width, height };

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(dpr, dpr);
        }

        centerRef.current = { x: width * 0.5, y: height * 0.5 };

        // Generate / rebuild particles list dynamically
        particlesRef.current = generateParticles(
          width,
          height,
          mode,
          STREAMS_THEMES[theme],
          particlesRef.current
        );
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [mode, theme, generateParticles]);

  // Morph particles when mode or theme updates
  useEffect(() => {
    const { width, height } = canvasDimensions.current;
    if (width > 0 && height > 0) {
      particlesRef.current = generateParticles(
        width,
        height,
        mode,
        STREAMS_THEMES[theme],
        particlesRef.current
      );
    }
  }, [mode, theme, generateParticles]);

  // Setup visualizer animation frame
  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      // Pause and clear audio elements
      if (audioMasterRef.current) {
        audioMasterRef.current.pause();
        audioMasterRef.current = null;
      }
      if (audioVocalRef.current) {
        audioVocalRef.current.pause();
        audioVocalRef.current = null;
      }
      if (audioInstrumentalRef.current) {
        audioInstrumentalRef.current.pause();
        audioInstrumentalRef.current = null;
      }

      // Disconnect source nodes
      if (sourceMasterRef.current) {
        sourceMasterRef.current.disconnect();
        sourceMasterRef.current = null;
      }
      if (sourceVocalRef.current) {
        sourceVocalRef.current.disconnect();
        sourceVocalRef.current = null;
      }
      if (sourceInstrumentalRef.current) {
        sourceInstrumentalRef.current.disconnect();
        sourceInstrumentalRef.current = null;
      }

      // Close AudioContext
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(console.error);
        audioCtxRef.current = null;
      }

      // Revoke custom audio URL if exists
      if (customAudioUrlRef.current) {
        URL.revokeObjectURL(customAudioUrlRef.current);
      }
    };
  }, []);

  // Initialize and play music with three-audio silent stems routing
  const startMusic = async (urlOverride?: string) => {
    if (audioCtxRef.current) return;
    setIsAudioLoading(true);
    try {
      // 1. AudioContext setup
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // 2. Analyser Nodes setup
      const analyserVocalNode = ctx.createAnalyser();
      analyserVocalNode.fftSize = TOTAL_BANDS * 2;
      analyserVocalRef.current = analyserVocalNode;
      dataArrayVocalRef.current = new Uint8Array(analyserVocalNode.frequencyBinCount);

      const analyserInstNode = ctx.createAnalyser();
      analyserInstNode.fftSize = TOTAL_BANDS * 2;
      analyserInstrumentalRef.current = analyserInstNode;
      dataArrayInstrumentalRef.current = new Uint8Array(analyserInstNode.frequencyBinCount);

      // 3. Audio Elements setup
      const activeUrl = urlOverride || customAudioUrl || "/audio/Gunesinkaranlikyuzu.wav";
      const activeVocalUrl = urlOverride || customAudioUrl || "/audio/vocal.mp3";
      const activeInstUrl = urlOverride || customAudioUrl || "/audio/instrumental.mp3";

      // Master Audio (Audible)
      const audioMaster = new Audio();
      audioMaster.crossOrigin = "anonymous";
      audioMaster.src = activeUrl;
      audioMaster.volume = volume;
      audioMaster.muted = isMuted;
      audioMasterRef.current = audioMaster;

      // Vocal Stem (Silent)
      const audioVocal = new Audio();
      audioVocal.crossOrigin = "anonymous";
      audioVocal.src = activeVocalUrl;
      audioVocal.volume = volume;
      audioVocal.muted = false; // Muted in routing, not element level
      audioVocalRef.current = audioVocal;

      // Instrumental Stem (Silent)
      const audioInst = new Audio();
      audioInst.crossOrigin = "anonymous";
      audioInst.src = activeInstUrl;
      audioInst.volume = volume;
      audioInst.muted = false; // Muted in routing, not element level
      audioInstrumentalRef.current = audioInst;

      let tracksLoaded = 0;
      const onCanPlay = () => {
        tracksLoaded++;
        if (tracksLoaded === 3) {
          setIsAudioLoading(false);
          setShowOverlay(false);
        }
      };

      audioMaster.addEventListener("canplay", onCanPlay);
      audioVocal.addEventListener("canplay", onCanPlay);
      audioInst.addEventListener("canplay", onCanPlay);

      // Reset state and rewind when audio completes playing
      audioMaster.addEventListener("ended", () => {
        audioMaster.pause();
        audioVocal.pause();
        audioInst.pause();
        audioMaster.currentTime = 0;
        audioVocal.currentTime = 0;
        audioInst.currentTime = 0;
        setIsPlaying(false);
      });

      // 4. Source Connections (Critical Routing)
      // Master Track -> Connects to destination (Audible)
      const sourceMaster = ctx.createMediaElementSource(audioMaster);
      sourceMaster.connect(ctx.destination);
      sourceMasterRef.current = sourceMaster;

      // Vocal Stem -> Connects ONLY to analyserVocal (Silent)
      const sourceVocal = ctx.createMediaElementSource(audioVocal);
      sourceVocal.connect(analyserVocalNode);
      sourceVocalRef.current = sourceVocal;

      // Instrumental Stem -> Connects ONLY to analyserInstrumental (Silent)
      const sourceInst = ctx.createMediaElementSource(audioInst);
      sourceInst.connect(analyserInstNode);
      sourceInstrumentalRef.current = sourceInst;

      // Resume context if suspended
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // Play all 3 elements simultaneously
      await Promise.all([
        audioMaster.play(),
        audioVocal.play(),
        audioInst.play()
      ]);

      setIsPlaying(true);
      setShowOverlay(false);
    } catch (error) {
      console.error("AudioContext initialization failed:", error);
      setIsAudioLoading(false);
    }
  };

  // Handle uploading custom audio file
  const handleCustomAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous URL if any
    if (customAudioUrlRef.current) {
      URL.revokeObjectURL(customAudioUrlRef.current);
    }

    // Create object URL
    const url = URL.createObjectURL(file);
    setCustomAudioUrl(url);
    setCustomAudioName(file.name);

    // If audio is already initialized, update the sources on the fly
    if (audioCtxRef.current) {
      setIsAudioLoading(true);
      try {
        const master = audioMasterRef.current;
        const vocal = audioVocalRef.current;
        const inst = audioInstrumentalRef.current;

        if (master && vocal && inst) {
          master.pause();
          vocal.pause();
          inst.pause();

          master.src = url;
          vocal.src = url;
          inst.src = url;

          master.load();
          vocal.load();
          inst.load();

          // Wait for them to be ready to play
          let loaded = 0;
          const onCanPlayCustom = async () => {
            loaded++;
            if (loaded === 3) {
              master.removeEventListener("canplay", onCanPlayCustom);
              vocal.removeEventListener("canplay", onCanPlayCustom);
              inst.removeEventListener("canplay", onCanPlayCustom);

              setIsAudioLoading(false);
              // Play
              if (audioCtxRef.current?.state === "suspended") {
                await audioCtxRef.current.resume();
              }
              await Promise.all([
                master.play(),
                vocal.play(),
                inst.play()
              ]);
              setIsPlaying(true);
            }
          };

          master.addEventListener("canplay", onCanPlayCustom);
          vocal.addEventListener("canplay", onCanPlayCustom);
          inst.addEventListener("canplay", onCanPlayCustom);
        }
      } catch (err) {
        console.error("Failed to switch to custom audio:", err);
        setIsAudioLoading(false);
      }
    } else {
      // If audio is not initialized yet, initialize it with this URL
      setIsAudioLoading(true);
      await startMusic(url);
      setCustomAudioName(file.name);
    }
  };

  // Reset back to default audio assets
  const handleResetToDefault = async () => {
    if (!customAudioUrlRef.current) return;
    setIsAudioLoading(true);

    // Revoke object URL
    URL.revokeObjectURL(customAudioUrlRef.current);
    setCustomAudioUrl(null);
    setCustomAudioName("");

    if (audioCtxRef.current) {
      try {
        const master = audioMasterRef.current;
        const vocal = audioVocalRef.current;
        const inst = audioInstrumentalRef.current;

        if (master && vocal && inst) {
          master.pause();
          vocal.pause();
          inst.pause();

          master.src = "/audio/Gunesinkaranlikyuzu.wav";
          vocal.src = "/audio/vocal.mp3";
          inst.src = "/audio/instrumental.mp3";

          master.load();
          vocal.load();
          inst.load();

          // Wait for them to be ready to play
          let loaded = 0;
          const onCanPlayDefault = async () => {
            loaded++;
            if (loaded === 3) {
              master.removeEventListener("canplay", onCanPlayDefault);
              vocal.removeEventListener("canplay", onCanPlayDefault);
              inst.removeEventListener("canplay", onCanPlayDefault);

              setIsAudioLoading(false);
              // Play
              if (audioCtxRef.current?.state === "suspended") {
                await audioCtxRef.current.resume();
              }
              await Promise.all([
                master.play(),
                vocal.play(),
                inst.play()
              ]);
              setIsPlaying(true);
            }
          };

          master.addEventListener("canplay", onCanPlayDefault);
          vocal.addEventListener("canplay", onCanPlayDefault);
          inst.addEventListener("canplay", onCanPlayDefault);
        }
      } catch (err) {
        console.error("Failed to reset to default audio:", err);
        setIsAudioLoading(false);
      }
    } else {
      setIsAudioLoading(false);
    }
  };

  // Play/Pause Action for all three elements
  const togglePlay = async () => {
    const master = audioMasterRef.current;
    const vocal = audioVocalRef.current;
    const inst = audioInstrumentalRef.current;
    const ctx = audioCtxRef.current;
    if (!master || !vocal || !inst || !ctx) return;

    if (isPlaying) {
      master.pause();
      vocal.pause();
      inst.pause();
      setIsPlaying(false);
    } else {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      // Re-align and play
      const masterTime = master.currentTime;
      vocal.currentTime = masterTime;
      inst.currentTime = masterTime;

      await Promise.all([
        master.play(),
        vocal.play(),
        inst.play()
      ]);
      setIsPlaying(true);
    }
  };

  // Mute/Unmute Action on Master (Stems are already silent)
  const toggleMute = () => {
    const master = audioMasterRef.current;
    if (!master) return;
    master.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Volume Action (Updates all tracks, stems remain silent)
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);

    const master = audioMasterRef.current;
    const vocal = audioVocalRef.current;
    const inst = audioInstrumentalRef.current;

    if (master) {
      master.volume = v;
      master.muted = v === 0;
      setIsMuted(v === 0);
    }
    if (vocal) vocal.volume = v;
    if (inst) inst.volume = v;
  };

  // Mouse/Touch Tracking Window Event Listeners
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (isMobileDevice) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      if (isMobileDevice) return;
      const canvas = canvasRef.current;
      if (!canvas || e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.touches[0].clientX - rect.left;
      mouseRef.current.y = e.touches[0].clientY - rect.top;
    };

    const handleWindowMouseLeave = () => {
      // Reset to idle animation coordinates
      mouseRef.current.x = -1;
      mouseRef.current.y = -1;
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("touchmove", handleWindowTouchMove);
    window.addEventListener("mouseleave", handleWindowMouseLeave);
    document.addEventListener("mouseleave", handleWindowMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("touchmove", handleWindowTouchMove);
      window.removeEventListener("mouseleave", handleWindowMouseLeave);
      document.removeEventListener("mouseleave", handleWindowMouseLeave);
    };
  }, [isMobileDevice]);

  // Autoplay music on mount
  useEffect(() => {
    const autoplayTimer = setTimeout(() => {
      startMusic();
    }, 500);
    return () => clearTimeout(autoplayTimer);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        #Clouds {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
          user-select: none;
          opacity: 0.15;
          animation: FadeIn 3s ease-out;
        }
        @keyframes FadeIn {
          from { opacity: 0; }
          to { opacity: 0.15; }
        }
        .Cloud {
          position: absolute;
          width: 100%;
          background-repeat: no-repeat;
          background-size: auto 100%;
          height: 70px;
          animation-duration: 120s;
          animation-iteration-count: infinite;
          animation-fill-mode: forwards;
          animation-timing-function: linear;
          animation-name: Float, FadeFloat;
        }
        .Cloud.Foreground {
          height: 10%;
          min-height: 20px;
          z-index: 2;
        }
        .Cloud.Background {
          height: 9%;
          min-height: 8px;
          animation-duration: 210s;
          z-index: 1;
        }
        @keyframes Float {
          from { transform: translateX(100%) translateZ(0); }
          to { transform: translateX(-100%) translateZ(0); }
        }
        @keyframes FadeFloat {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 1; }
        }
        .Cloud:nth-child(10) { animation-delay: -184.6s; top: 60%; }
        .Cloud.Foreground:nth-child(10) { animation-duration: 80s; height: 35%; }
        .Cloud.Background:nth-child(10) { animation-duration: 110s; height: 8%; }

        .Cloud:nth-child(9) { animation-delay: -166.1s; top: 54%; }
        .Cloud.Foreground:nth-child(9) { animation-duration: 84s; height: 32%; }
        .Cloud.Background:nth-child(9) { animation-duration: 114s; height: 7%; }

        .Cloud:nth-child(8) { animation-delay: -147.6s; top: 48%; }
        .Cloud.Foreground:nth-child(8) { animation-duration: 88s; height: 30%; }
        .Cloud.Background:nth-child(8) { animation-duration: 118s; height: 6%; }

        .Cloud:nth-child(7) { animation-delay: -129.2s; top: 42%; }
        .Cloud.Foreground:nth-child(7) { animation-duration: 92s; height: 27%; }
        .Cloud.Background:nth-child(7) { animation-duration: 122s; height: 5%; }

        .Cloud:nth-child(6) { animation-delay: -110.7s; top: 36%; }
        .Cloud.Foreground:nth-child(6) { animation-duration: 96s; height: 25%; }
        .Cloud.Background:nth-child(6) { animation-duration: 126s; height: 4%; }

        .Cloud:nth-child(5) { animation-delay: -92.3s; top: 30%; }
        .Cloud.Foreground:nth-child(5) { animation-duration: 100s; height: 22%; }
        .Cloud.Background:nth-child(5) { animation-duration: 130s; height: 3%; }

        .Cloud:nth-child(4) { animation-delay: -73.8s; top: 24%; }
        .Cloud.Foreground:nth-child(4) { animation-duration: 104s; height: 20%; }
        .Cloud.Background:nth-child(4) { animation-duration: 134s; height: 2.8%; }

        .Cloud:nth-child(3) { animation-delay: -55.3s; top: 18%; }
        .Cloud.Foreground:nth-child(3) { animation-duration: 108s; height: 17%; }
        .Cloud.Background:nth-child(3) { animation-duration: 138s; height: 2.5%; }

        .Cloud:nth-child(2) { animation-delay: -36.9s; top: 12%; }
        .Cloud.Foreground:nth-child(2) { animation-duration: 112s; height: 15%; }
        .Cloud.Background:nth-child(2) { animation-duration: 142s; height: 2%; }

        .Cloud:nth-child(1) { animation-delay: -18.4s; top: 6%; }
        .Cloud.Foreground:nth-child(1) { animation-duration: 116s; height: 12%; }
        .Cloud.Background:nth-child(1) { animation-duration: 146s; height: 1.5%; }

        .Cloud {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAABgCAYAAACTzNnjAAAFCklEQVR42u3d34uVRRjA8YMsEi0iSwhdRBGhSJgZiNRFIkWhQVEXBipKUVBBLCF6k0h4UxFkBLq4QT/Qiyi80EgxCjXMWqOMtqy0bBNja92yXatN3c3pGc9sHU/v+X3emWfe93vx+QN23u+e95x5Z94pmNWFQo5NEytErzgoBsSIOCf+FqbEBTEhzophcVTsFxvFEjE152PZHGMukbcB6BAPij0uqgtl0bXCBvyjeFPcS2wEWc0y0ec++Ywnf7rwbyc8grQ6RY8Y9RhhJT+Jde4TmghzFuR08bo4ryDEpE/N58QUYsx+kFPcD4yzCkMsZz+1uwkyu0HeKYYiCLHcN2I2QWYnSPudbHubfy37NuFu4wQZeZD2k2Uw4hDLHRZdBBnnH3K/5ykcX86IeQQZl6civ0XXYv/RlhJkHLZkOMTypz7dBKnbyzmJsfTZeTdB6vRszmIsjXI5QeryWMa/M9ZinzjdTJA63CLGcxzjpD/ElQQZfq3iKDFe8lSHIAPqI8L/6SHIMB4nvorTQQsI0v+teoz4KjpBkH7tIrqaNhCkH9cnbK5C8q/uywiSHzKabCLIdM3K+QR4o8YysfVWcZDvElnD1hNkOi5XuilLu5MlOyzni3vESnGfWCRuIMjm1zgSWPM7GWvNXdonXkdM8Q0dCwmytu8Iy/vK9B3iRoJMnghnqifc8jb7yXkXQf5nLWGo2WR2HUGuLrxPDKq25D6d9yBPE4I6/e6rVO6CnMpkuFq/eLmFKwtyMRde/dOg2XkKkvlH/X5P9ZNSWZBvcMGjMJza6iJlQe7nYkfjozwE+TkXOiprsx7kES5yVOzLYK/IcpA/cJGj806Wg/yaCxzlzsersxpkPxc4SruzGuQBLm603yU7DPOQUOSJWIK0E6j2lcvPm+JJV+post7esDbsFuP1t/fEXs5cJG65DmIO3KY3vG3yCLbXO1N1xVkB3uWfQQFye3rtUS5DN1bC5C9j0cOki7XOwUFwJOb6gg7TmCW1lMizI7QwQ5nW2qqGCv7yDtwsxfGXhU0OczyKvECIOOKvb5CnKa2+TDoKOat3wFyaIH1ONFH0H2MNCo00NpBzmXR39owIy0gzzOIKNOv6X9LHsZg4wGp3xsM/ZMoUfF3aaZ4++qBDnIIKMNzrsHKb11Lb6oEORtDCRSYB81f+vWxzYUJBv2kTYb5vx6gzzHgMHTjsUXagV5BwMFzz78d5NYQDbGCAEcOzissaEIL9kcBDIx0lBsrwMIW0uD3KcQUHgqaEFpUGyLQGhnSgNkgGBBg8QJDQ5Phkky82g5bvkNQXDscDQY6MNcpiBgBL9NsjDDAS0LPq1Qb7EQECJicLFSUkGAkpMLgMaYzCgKci3GQxomPqZDPImBgMa9uOULifnDWcI7VRpkIsYEAR2sHwX2GcMCgJak/QKPh4lIsgcpOhM2iv7JIODAPqqvY7vPQYInlf6zKsWpN2iOMBAwZMD9bzSudPwvh+kr3gofJ0vve/ikxIp36pXNHosiD2j5gMGD2ksyG3lJK917qc5A4l2eNW04Wi5OaZ41DADilZu0xtMmw/fXCV+ZnDRoFFTfBdpaudlLxVfsXMRNYy7W3SH8XSAu/01bo8s/kL8xQWAM+JC7DIeDnCvZqZ4RGxxi3/3iUPOJ+5TtRXfG/v6jeadNMVjlqsZquG0uwU164ybg2vFuPuh2ax23tkm3N91VLwmbjVNvPT+H7Ro4730ITNPAAAAAElFTkSuQmCC);
        }
        .Cloud.Background {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAAAqCAYAAAAUJM0rAAACFUlEQVRo3u3aPSwDYRzH8UZEbAYiYrDYjLZGpIPBJLGwSKwi0k1iYBKDdFJsEiMxSZgsFZJGiGjqJWEhSKuaNKRUG8r5PfI8SXOud72+PH2eu2f47Ndv7+V5/nee/G6bh5MWmIV9iEMWvkGjfiADD7AHk9BU6+PSNK0kPAINwwXkC6KU6gvC4HVyKB/clhHHCDnbTqHbSaEaYIv+OK3KyBk274RQrXBXg0B6B/QPkTIUiZTiEIm5gkbZQjXTJ5nG2ZFsocJ1iMQEZQk1VcdIGl2L9Yoeitwj3uocirgRPVRAgEjMoMihkgKFStIzK063QVHYhKF6h/IKFMlKGpaNlhM8Qq1JFIp5gQHeoSIShmJPST/PUElJQ7FN9hivUGmJQxE56OQRKiN5qL/NNY9QKQeEIpdgR7VC9cEqHeGeUyEHXHrMUiWhyKx6BV4dEsNMtNxQI4Ls33h5LidUoEYjXKEXoXZDLbgsEBOzE8qne8fmJhE7oWIujUQcwhyMmy0VSKRRF0cyWlclYMYo1LEKZOgRugpDpVWUot5ZLI8LlwN23bNQKoY1vwpVmmsS6kOFsPRJQl2qENZIqGkVwnp9xb5nUksEcxm2hZlQMcy3OYXTgx0VpOi2pl8/jwqpMP9sF5twBl08ctE7I/dws5l5D5y4OBj51HvdzluYdlik0RL06cjkKpSlB1Span5x/AQb5Hfrxyy/oU5ISeVw53AAAAAASUVORK5CYII=);
        }
      `}} />

      {/* Canvas background container (fixed, inset-0, z-0) */}
      <div
        ref={containerRef}
        className="fixed inset-0 w-full h-full select-none overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {/* Floating Clouds Background Layer */}
        <div id="Clouds">
          <div className="Cloud Foreground"></div>
          <div className="Cloud Background"></div>
          <div className="Cloud Foreground"></div>
          <div className="Cloud Background"></div>
          <div className="Cloud Foreground"></div>
          <div className="Cloud Background"></div>
          <div className="Cloud Background"></div>
          <div className="Cloud Foreground"></div>
          <div className="Cloud Background"></div>
          <div className="Cloud Background"></div>
        </div>

        {/* HTML5 Particle Visualizer Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Cyberpunk Grid/Radial Blur Layer */}
        <div className="absolute inset-0 bg-radial-gradient opacity-20 pointer-events-none" />
      </div>

      {/* Control Widgets & Play Button Overlay in the flow (relative, z-20) */}
      <div className="max-w-3xl mx-auto mb-8 relative z-20 pointer-events-auto">
        <AnimatePresence mode="wait">
          {showOverlay ? (
            <motion.div
              key="overlay"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6"
            >
              {/* Corner Sci-fi Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-fuchsia-500" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-fuchsia-500" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-fuchsia-500" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-fuchsia-500" />

              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl shrink-0">
                  <Music className="w-6 h-6 text-fuchsia-400 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-sm font-orbitron text-white tracking-[0.2em] font-bold">
                    {language === "tr" ? "SES DETEKTÖRÜ" : "AUDIO TRANSMISSION"}
                  </h2>
                  <p className="text-[10px] font-rajdhani text-gray-400 tracking-wider uppercase mt-1">
                    {language === "tr"
                      ? "İnteraktif parçacık sistemini başlatmak için müzik sinyalini yükleyin."
                      : "Load the audio stream to engage the interactive particle visualizer."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                <button
                  onClick={() => startMusic()}
                  disabled={isAudioLoading}
                  className="relative px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 text-white font-orbitron font-bold uppercase tracking-[0.2em] text-xs rounded-xl border border-white/20 shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[150px]"
                >
                  {isAudioLoading && !customAudioUrl ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {language === "tr" ? "YÜKLENİYOR..." : "LOADING..."}
                    </span>
                  ) : (
                    <span>{language === "tr" ? "SİNYALİ BAŞLAT" : "ENGAGE BEAT"}</span>
                  )}
                </button>

                <label className={`relative px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-orbitron font-bold uppercase tracking-[0.2em] text-xs rounded-xl border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2 ${isAudioLoading ? "opacity-50 cursor-wait pointer-events-none" : ""}`}>
                  {isAudioLoading && customAudioUrl ? (
                    <>
                      <span className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span>{language === "tr" ? "YÜKLENİYOR..." : "LOADING..."}</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} className="text-cyan-400 animate-pulse" />
                      <span>{language === "tr" ? "MÜZİK YÜKLE" : "UPLOAD MUSIC"}</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="audio/*"
                    disabled={isAudioLoading}
                    onChange={handleCustomAudioUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="controls"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4 bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl relative overflow-hidden"
            >
              {/* Corner Sci-fi Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-fuchsia-500/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-fuchsia-500/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-fuchsia-500/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-fuchsia-500/50" />

              {/* Top Row: Details & Playback Controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-3 border-b border-white/5 w-full">
                {/* Left panel: Song Details + Animated Equalizer */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-10 h-10 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center relative overflow-hidden shrink-0">
                    <Music className={`w-5 h-5 text-fuchsia-400 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-orbitron text-fuchsia-400 tracking-widest font-bold">
                      {language === "tr" ? "SU AN ÇALAN SINYAL" : "TRANSMITTING TRACK"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 max-w-[200px] sm:max-w-[300px]">
                      {customAudioUrl ? (
                        <Music size={14} className="text-cyan-400 shrink-0" />
                      ) : (
                        (() => {
                          const spotifyLink = "https://open.spotify.com/intl-tr/artist/0EtJtiKuWQJpcU4rpn0cL2?si=JU0HLJtWQYCGPin9Y8oTzg";
                          return spotifyLink ? (
                            <a
                              href={spotifyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-500 hover:text-green-400 transition-colors duration-200 flex items-center shrink-0"
                            >
                              <FaSpotify size={16} />
                            </a>
                          ) : (
                            <FaSpotify size={16} className="text-green-500/80 flex items-center shrink-0" />
                          );
                        })()
                      )}
                      <h4 className="text-xs font-orbitron text-white tracking-wider font-semibold uppercase truncate" title={customAudioUrl ? customAudioName : undefined}>
                        {customAudioUrl ? customAudioName : (language === "tr" ? "Günesin Karanlık Yüzü" : "Gunesin Karanlik Yuzu")}
                      </h4>
                    </div>
                    <p className="text-[9px] font-rajdhani text-gray-400 mt-0.5 tracking-widest uppercase">
                      {customAudioUrl
                        ? (language === "tr" ? "Kullanıcı Dosyası" : "User Audio File")
                        : (language === "tr" ? "Yazar: Haian" : "Author: Haian")}
                    </p>
                  </div>

                  {/* EQ visualizer bars */}
                  <div className="flex items-end gap-[3px] h-5 px-2">
                    {[0, 1, 2, 3, 4].map((bar) => {
                      const heights = isPlaying ? [12, 18, 8, 20, 10] : [4, 4, 4, 4, 4];
                      return (
                        <motion.div
                          key={bar}
                          animate={
                            isPlaying
                              ? { height: [4, heights[bar], 4] }
                              : { height: 4 }
                          }
                          transition={{
                            repeat: Infinity,
                            duration: 0.8 + bar * 0.15,
                            repeatType: "reverse",
                            ease: "easeInOut"
                          }}
                          className="w-[3px] bg-gradient-to-t from-fuchsia-500 to-cyan-400 rounded-full"
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Middle panel: Music Controls */}
                <div className="flex items-center gap-6 justify-center w-full md:w-auto">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-fuchsia-500/50 flex items-center justify-center transition-all cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    )}
                  </button>

                  {/* Audio Volume Slider */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleMute}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-fuchsia-500" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 md:w-28 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500 focus:outline-none focus:ring-0 [&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-fuchsia-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Row: Visualizer Customizer Controls */}
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full">
                {customAudioUrl && (
                  <button
                    onClick={handleResetToDefault}
                    disabled={isAudioLoading}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30 transition-all cursor-pointer flex items-center gap-1.5 text-[9px] font-orbitron font-bold tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    title={language === "tr" ? "Varsayılan Müziğe Dön" : "Reset to Default Music"}
                  >
                    <RotateCcw size={12} className={isAudioLoading ? "animate-spin" : ""} />
                    <span>{language === "tr" ? "VARSAYILAN" : "DEFAULT"}</span>
                  </button>
                )}

                <label className={`p-2 bg-white/5 hover:bg-white/10 text-purple-400 hover:text-cyan-300 rounded-lg border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer flex items-center gap-1.5 text-[9px] font-orbitron font-bold tracking-widest ${isAudioLoading ? "opacity-50 cursor-wait pointer-events-none" : ""}`}>
                  <Upload size={12} />
                  <span>{language === "tr" ? "YENI SARKI YUKLE" : "UPLOAD NEW SONG"}</span>
                  <input
                    type="file"
                    accept="audio/*"
                    disabled={isAudioLoading}
                    onChange={handleCustomAudioUpload}
                    className="hidden"
                  />
                </label>

                {/* Theme dropdown */}
                <div className="relative">
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as ThemeName)}
                    className="bg-white/5 border border-white/10 hover:border-fuchsia-500/50 text-[10px] font-orbitron text-gray-300 uppercase tracking-widest px-3 py-2 rounded-lg focus:outline-none transition-all cursor-pointer"
                  >
                    {Object.keys(STREAMS_THEMES).map((themeKey) => (
                      <option
                        key={themeKey}
                        value={themeKey}
                        className="bg-neutral-900 text-gray-300"
                      >
                        {THEME_NAMES[themeKey as ThemeName]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
