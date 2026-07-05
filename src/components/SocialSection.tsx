"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  FaGithub,
  FaLinkedin,
  FaItchIo,
  FaInstagram,
  FaXTwitter,
  FaSpotify,
  FaCopy,
  FaCheck,
  FaArrowRight
} from "react-icons/fa6";

export default function SocialSection() {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hparlatir05@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const workLinks = [
    {
      name: "GitHub",
      desc: t("social_github_desc"),
      url: "https://github.com/HSNPRLTR",
      icon: <FaGithub className="text-2xl text-cyan-400" />,
    },
    {
      name: "LinkedIn",
      desc: t("social_linkedin_desc"),
      url: "https://www.linkedin.com/in/hasan-parlat%C4%B1r-38a251265/",
      icon: <FaLinkedin className="text-2xl text-cyan-400" />,
    },
    {
      name: "Itch.io",
      desc: t("social_itch_desc"),
      url: "https://hsnprltr.itch.io",
      icon: <FaItchIo className="text-2xl text-cyan-400" />,
    },
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden" id="social">
      {/* Soundwave wave keyframes styling */}
      <style jsx global>{`
        @keyframes soundWave {
          0%, 100% {
            transform: scaleY(0.3);
          }
          50% {
            transform: scaleY(1.2);
          }
        }
        @keyframes crtFlicker {
          0% { opacity: 0.95; }
          50% { opacity: 1; }
          100% { opacity: 0.95; }
        }
        .crt-scanlines::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          background-size: 100% 4px, 6px 100%;
          z-index: 10;
          pointer-events: none;
          opacity: 0.45;
        }
        .crt-monitor {
          animation: crtFlicker 0.15s infinite;
        }
      `}</style>

      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold font-orbitron text-white">{t("social_title")}</h2>
          <div className="w-50 h-1 bg-cyan-500 mx-auto mt-4" />
        </motion.div>

        {/* Double Terminal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Panel: [İş] / Komuta Merkezi */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass border border-cyan-500/30 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.1)] flex flex-col justify-between"
          >
            {/* Sci-Fi Corner Decals */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

            <div>
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-8">
                <span className="font-orbitron text-xs text-cyan-400 tracking-wider font-bold">
                  {t("social_left_header")}
                </span>
                <span className="font-orbitron text-[9px] text-cyan-500/50">
                  {t("social_left_sub")}
                </span>
              </div>

              {/* Rows List */}
              <div className="space-y-4">
                {workLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all overflow-hidden"
                  >
                    {/* Hover light beam effect */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                    <div className="flex items-center gap-4 relative z-10">
                      <div className="p-3 bg-cyan-950/40 border border-cyan-500/20 rounded-xl group-hover:border-cyan-400/50 transition-colors">
                        {link.icon}
                      </div>
                      <div>
                        <div className="font-orbitron text-base text-white group-hover:text-cyan-400 transition-colors">
                          {link.name}
                        </div>
                        <div className="font-rajdhani text-xs text-white/40">
                          {link.desc}
                        </div>
                      </div>
                    </div>

                    <FaArrowRight className="text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all relative z-10" />
                  </a>
                ))}
              </div>
            </div>

            {/* Email Field with Copy Button */}
            <div className="mt-8 pt-6 border-t border-cyan-500/10 relative z-10">
              <div className="font-rajdhani text-xs text-white/40 mb-2 uppercase tracking-widest">
                {t("social_direct_line")}
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="font-rajdhani text-sm md:text-base text-white font-medium select-all">
                  hparlatir05@gmail.com
                </span>

                <div className="relative">
                  <button
                    onClick={handleCopyEmail}
                    className="p-3 bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 rounded-xl text-cyan-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                    title={t("social_copy_tooltip")}
                  >
                    {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                  </button>

                  <AnimatePresence>
                    {copied && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: -45, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute right-0 top-0 bg-cyan-500 text-black font-orbitron font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap tracking-wider border border-cyan-300"
                      >
                        {t("social_copied")}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Panel: [Sosyal] / Yayın Frekansları */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass border border-purple-500/30 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.1)] flex flex-col justify-between"
          >
            {/* Sci-Fi Corner Decals */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-400" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-400" />

            <div>
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-4 mb-6">
                <span className="font-orbitron text-xs text-purple-400 tracking-wider font-bold">
                  {t("social_right_header")}
                </span>
                <span className="font-orbitron text-[9px] text-purple-500/50">
                  {t("social_right_sub")}
                </span>
              </div>

              {/* YouTube Monitor */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-orbitron text-xs text-white/70 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    {t("social_yt_monitor")}
                  </span>
                  <span className="text-[10px] font-rajdhani text-white/30">MONITOR_01</span>
                </div>

                {/* Styled Monitor Frame */}
                <div className="relative rounded-2xl overflow-hidden border-4 border-slate-900 shadow-[0_0_25px_rgba(168,85,247,0.2)] aspect-video crt-scanlines crt-monitor bg-black">
                  {/* Glass curved glare reflex overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-20 mix-blend-overlay" />

                  {/* YouTube Iframe */}
                  <iframe
                    className="w-full h-full border-none relative z-0"
                    src="https://www.youtube.com/embed/GN6LFL6A1i8?si=social-section"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Social Media Buttons Grid */}
              <div className="grid grid-cols-2 gap-4">

                {/* Instagram */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="https://www.instagram.com/playboihaso/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-500/40 hover:bg-gradient-to-tr hover:from-amber-500/10 hover:via-pink-500/10 hover:to-purple-600/10 transition-all text-center sm:text-left justify-center sm:justify-start"
                >
                  <div className="p-3 bg-pink-950/30 border border-pink-500/20 rounded-xl text-pink-400">
                    <FaInstagram className="text-xl" />
                  </div>
                  <div>
                    <div className="font-orbitron text-sm text-white">Instagram</div>
                    <div className="font-rajdhani text-[11px] text-white/40">{t("social_instagram_desc")}</div>
                  </div>
                </motion.a>

                {/* Twitter / X */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="https://x.com/HasanParlatir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/40 hover:bg-white/10 transition-all text-center sm:text-left justify-center sm:justify-start"
                >
                  <div className="p-3 bg-slate-900 border border-white/10 rounded-xl text-white">
                    <FaXTwitter className="text-xl" />
                  </div>
                  <div>
                    <div className="font-orbitron text-sm text-white">Twitter / X</div>
                    <div className="font-rajdhani text-[11px] text-white/40">{t("social_twitter_desc")}</div>
                  </div>
                </motion.a>

                {/* Spotify with Sound Wave Animation */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="https://open.spotify.com/intl-tr/artist/0EtJtiKuWQJpcU4rpn0cL2?si=JU0HLJtVQYCGPin9Y8oTzg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-green-500/40 hover:bg-green-950/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-950/30 border border-green-500/20 rounded-xl text-green-400">
                      <FaSpotify className="text-xl" />
                    </div>
                    <div>
                      <div className="font-orbitron text-sm text-white">Spotify</div>
                      <div className="font-rajdhani text-[11px] text-white/40">{t("social_spotify_desc")}</div>
                    </div>
                  </div>

                  {/* Animated Sound Wave Bars */}
                  <div className="flex items-end gap-1 h-5 pr-2">
                    <span className="w-[3px] bg-green-500 rounded-full" style={{ height: "18px", animation: "soundWave 0.7s infinite ease-in-out", transformOrigin: "bottom" }} />
                    <span className="w-[3px] bg-green-500 rounded-full" style={{ height: "18px", animation: "soundWave 0.7s infinite ease-in-out 0.2s", transformOrigin: "bottom" }} />
                    <span className="w-[3px] bg-green-500 rounded-full" style={{ height: "18px", animation: "soundWave 0.7s infinite ease-in-out 0.4s", transformOrigin: "bottom" }} />
                    <span className="w-[3px] bg-green-500 rounded-full" style={{ height: "18px", animation: "soundWave 0.7s infinite ease-in-out 0.1s", transformOrigin: "bottom" }} />
                  </div>
                </motion.a>

              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
