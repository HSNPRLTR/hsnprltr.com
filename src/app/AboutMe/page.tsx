"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Gamepad2, Music, Film, FileText } from "lucide-react";
import { SiUnity, SiCplusplus, SiCanva } from "react-icons/si";
import { TbBrandCSharp, TbBrandAdobePhotoshop, TbBrandAdobePremier } from "react-icons/tb";
import { PiMicrosoftExcelLogo, PiMicrosoftPowerpointLogo, PiMicrosoftWordLogo } from "react-icons/pi";
import { useLanguage } from "@/context/LanguageContext";
import SubPageLayout from "@/components/SubPageLayout";

export default function AboutMePage() {
  const { t, language } = useLanguage();

  return (
    <SubPageLayout gradientClass="bg-[radial-gradient(ellipse_at_30%_20%,rgba(6,182,212,0.08),transparent_60%),radial-gradient(ellipse_at_70%_80%,rgba(124,58,237,0.06),transparent_60%)]">
      <section className="relative min-h-screen py-32 px-6 pt-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-[#0B0C10]/60 backdrop-blur-md border border-white/10 p-8 md:p-12 max-w-5xl mx-auto rounded-3xl relative overflow-hidden shadow-2xl shadow-cyan-500/5"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <FileText size={120} className="text-cyan-500" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-cyan-400 font-orbitron">{t("about_title")}</h1>

            {/* Section 1: Bio & Core Tech */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              {/* Left Side: Bio text */}
              <div className="lg:col-span-3">
                <p className="text-lg md:text-xl leading-relaxed font-rajdhani text-gray-200">
                  {t("about_bio")}
                </p>
              </div>

              {/* Right Side: Core Skills */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Unity', icon: SiUnity, color: 'text-emerald-400' },
                    { label: 'C#', icon: TbBrandCSharp, color: 'text-purple-400' },
                    { label: 'C++', icon: SiCplusplus, color: 'text-blue-400' },
                    { label: 'GDD', subLabel: language === "tr" ? "Oyun Tasarım Dok." : "Game Design Doc.", icon: FileText, color: 'text-cyan-400' },
                  ].map((tech, i) => {
                    const IconComponent = tech.icon;
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all cursor-default"
                      >
                        <div className="w-12 h-12 flex items-center justify-center text-3xl mb-2">
                          <IconComponent className={`${tech.color} transition-transform duration-300 group-hover:scale-110`} />
                        </div>
                        <span className="text-xs font-orbitron uppercase tracking-widest text-white/60 group-hover:text-cyan-400 transition-colors text-center">{tech.label}</span>
                        {tech.subLabel && (
                          <span className="text-[9px] font-rajdhani text-white/40 group-hover:text-cyan-300/50 transition-colors text-center mt-1">{tech.subLabel}</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Glowing Divider 1 */}
            <div className="border-b border-cyan-500/20 my-8 shadow-[0_1px_10px_rgba(6,182,212,0.15)]" />

            {/* Section 2: Extra Skills */}
            <div>
              <h3 className="text-xs font-bold font-orbitron tracking-widest text-gray-400/80 mb-4 uppercase">
                {t("about_extra_skills")}
              </h3>
              <div className="flex flex-wrap gap-4">
                {[
                  {
                    title: t("about_video_editing"),
                    detail: "Premiere Pro",
                    icons: [TbBrandAdobePremier],
                    colors: ["text-[#9999FF]"]
                  },
                  {
                    title: t("about_graphic_design"),
                    detail: "Photoshop, Canva",
                    icons: [TbBrandAdobePhotoshop, SiCanva],
                    colors: ["text-[#00C8FF]", "text-[#00C4CC]"]
                  },
                  {
                    title: t("about_data_presentation"),
                    detail: "Excel, PowerPoint, Word",
                    icons: [PiMicrosoftExcelLogo, PiMicrosoftPowerpointLogo, PiMicrosoftWordLogo],
                    colors: ["text-[#107C41]", "text-[#C43E1C]", "text-[#185ABD]"]
                  }
                ].map((skill, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all cursor-default"
                  >
                    <div className="flex items-center gap-2">
                      {skill.icons.map((Icon, idx) => (
                        <Icon key={idx} className={`${skill.colors[idx] || 'text-white'} text-lg`} />
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-sm font-semibold font-rajdhani text-white">{skill.title}</span>
                      <span className="text-xs font-rajdhani text-gray-400 sm:before:content-['•'] sm:before:mr-2 sm:before:text-gray-600">{skill.detail}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Glowing Divider 2 */}
            <div className="border-b border-cyan-500/20 my-8 shadow-[0_1px_10px_rgba(6,182,212,0.15)]" />

            {/* Section 3: Interests & Hobbies */}
            <div>
              <h3 className="text-xs font-bold font-orbitron tracking-widest text-gray-400/80 mb-6 uppercase">
                {t("about_interests")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1: Favorite Games */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Gamepad2 className="text-cyan-400 w-5 h-5" />
                    <h4 className="text-base font-bold font-orbitron text-white">{t("about_fav_games")}</h4>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: "The Last of Us Part 2", desc: t("about_mechanics"), img: "/gallery/oyunfimmuzik/The_Last_of_Us_Part_II_cover_art.png" },
                      { name: "Hollow Knight", desc: t("about_atmosphere"), img: "/gallery/oyunfimmuzik/Hollow_Knight_kapak.jpg" }
                    ].map((game, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all cursor-default"
                      >
                        <div className="w-12 h-12 rounded-lg relative overflow-hidden flex-shrink-0 border border-white/10">
                          <Image src={game.img} alt={game.name} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold font-rajdhani text-white leading-tight">{game.name}</span>
                          <span className="text-xs font-rajdhani text-gray-400 mt-0.5">{game.desc}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Music */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Music className="text-cyan-400 w-5 h-5" />
                    <h4 className="text-base font-bold font-orbitron text-white">{t("about_fav_music")}</h4>
                  </div>
                  <div className="space-y-4">
                    {[
                      { track: "Şehinşah", details: "Karma", img: "/gallery/oyunfimmuzik/karma.jpg" },
                      { track: "Sezen Aksu", details: "Biliyorsun", img: "/gallery/oyunfimmuzik/sezen aksu.jpg" }
                    ].map((music, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all cursor-default"
                      >
                        <div className="w-12 h-12 rounded-lg relative overflow-hidden flex-shrink-0 border border-white/10">
                          <Image src={music.img} alt={`${music.track} - ${music.details}`} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold font-rajdhani text-white leading-tight">{music.track}</span>
                          <span className="text-xs font-rajdhani text-gray-400 mt-0.5">{music.details}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Film & Series */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Film className="text-cyan-400 w-5 h-5" />
                    <h4 className="text-base font-bold font-orbitron text-white">{t("about_fav_media")}</h4>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: "Requiem For a Dream", category: t("about_movie"), img: "/gallery/oyunfimmuzik/Requiem_For_A_Dream.jpg" },
                      { title: "Breaking Bad", category: t("about_series"), img: "/gallery/oyunfimmuzik/Breaking_Bad.jpg" }
                    ].map((media, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all cursor-default"
                      >
                        <div className="w-12 h-12 rounded-lg relative overflow-hidden flex-shrink-0 border border-white/10">
                          <Image src={media.img} alt={media.title} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold font-rajdhani text-white leading-tight">{media.title}</span>
                          <span className="text-xs font-rajdhani text-gray-400 mt-0.5">{media.category}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </SubPageLayout>
  );
}
