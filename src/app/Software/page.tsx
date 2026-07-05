"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Images, ArrowLeft, Award, GraduationCap, Languages, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import SubPageLayout from "@/components/SubPageLayout";
import CinematicHero from "@/components/CinematicHero";
import CanvasParticles from "@/components/CanvasParticles";
import CursorConstellation from "@/components/CursorConstellation";
import { getSoftwareProjects, getCertificates, getEducations } from "@/data/portfolioData";
export default function SoftwarePage() {
  const { t, language } = useLanguage();
  const [activeSoftwareProject, setActiveSoftwareProject] = React.useState<number | null>(null);
  const [showSoftwareScreenshots, setShowSoftwareScreenshots] = React.useState(false);
  const [enlargedSoftwareImageSrc, setEnlargedSoftwareImageSrc] = React.useState<string | null>(null);
  const [activeCertificate, setActiveCertificate] = React.useState<number | null>(null);
  const [activeEducation, setActiveEducation] = React.useState<number | null>(null);
  const [isMobileDevice, setIsMobileDevice] = React.useState(() => {
    const isMobileSize = typeof window !== 'undefined' && window.innerWidth < 768;
    const isMobileUA = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobileSize || isMobileUA;
  });
  const softwareProjects = getSoftwareProjects(t, language);
  const certificates = getCertificates(t, language);
  const educations = getEducations(t, language);
  // Keyboard handlers
  React.useEffect(() => {
    if (enlargedSoftwareImageSrc === null || activeSoftwareProject === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setEnlargedSoftwareImageSrc(null); return; }
      const gallery = softwareProjects[activeSoftwareProject].gallery;
      const currentIdx = gallery.indexOf(enlargedSoftwareImageSrc);
      if (currentIdx === -1) return;
      if (e.key === "ArrowRight") setEnlargedSoftwareImageSrc(gallery[(currentIdx + 1) % gallery.length]);
      if (e.key === "ArrowLeft") setEnlargedSoftwareImageSrc(gallery[(currentIdx - 1 + gallery.length) % gallery.length]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enlargedSoftwareImageSrc, activeSoftwareProject, softwareProjects]);
  React.useEffect(() => {
    if (activeCertificate === null) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveCertificate(null); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCertificate]);
  React.useEffect(() => {
    if (activeEducation === null) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveEducation(null); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeEducation]);
  return (
    <SubPageLayout
      gradientClass={isMobileDevice 
        ? "bg-[radial-gradient(ellipse_at_50%_0%,rgba(239,68,68,0.25),transparent_70%),linear-gradient(to_bottom,#150000,#080000)]" 
        : "bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.1),transparent_50%),linear-gradient(to_bottom,rgba(0,17,34,0.4),transparent)]"
      }
      skyboxPath="/Skybox/Software.png"
      autoRotateSkybox={true}
    >
      <div className="relative w-full">
        <CanvasParticles color="239, 68, 68" />
        {!isMobileDevice && <CursorConstellation />}
        <CinematicHero title={t("software_title")} themeColorClass="text-red-500" />

      <section className="min-h-screen pb-40 px-6 relative overflow-hidden" id="software">
        <div className="container mx-auto">
          {/* Decorative grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b208_1px,transparent_1px),linear-gradient(to_bottom,#0891b208_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_60%,transparent_100%)] pointer-events-none" />
          {/* ── Software Project Cards ────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10" style={{ perspective: 1000 }}>
            {softwareProjects.map((project, i) => {
              const isSelected = activeSoftwareProject === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50, rotateX: 10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                >
                  <motion.div
                    id={project.title.includes("REST") ? "rest-api" : project.title.includes("Engine") || project.title.includes("Motoru") ? "oyun-motoru" : undefined}
                    onClick={() => setActiveSoftwareProject(i)}
                    animate={{ opacity: activeSoftwareProject !== null && isSelected ? 0 : 1, scale: activeSoftwareProject !== null && isSelected ? 0.95 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="glass p-10 rounded-3xl border border-white/5 hover:border-red-500/30 transition-colors group relative overflow-hidden cursor-pointer flex flex-col justify-between h-full min-h-[380px]"
                    whileHover={activeSoftwareProject === null ? { y: -8, boxShadow: "0 20px 40px -15px rgba(34,211,238,0.15)", transition: { type: "spring", stiffness: 300, damping: 20, delay: 0 } } : undefined}
                  >
                    <div className="flex flex-col flex-grow">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {React.cloneElement(project.icon as React.ReactElement<any>, { size: 120 })}
                      </div>
                      <div className="text-red-500 mb-6 group-hover:scale-110 transition-transform origin-left w-12 h-12 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center justify-center">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {React.cloneElement(project.icon as React.ReactElement<any>, { size: 24 })}
                      </div>
                      <h2 className="text-2xl font-orbitron mb-4 text-white group-hover:text-red-400 transition-colors">{project.title}</h2>
                      <p className="text-lg font-rajdhani text-gray-400 leading-relaxed mb-6 flex-grow">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.techStack.map((tech, idx) => (
                          <span key={idx} className="text-xs font-orbitron px-3 py-1 rounded-full bg-white/5 border border-white/10 text-red-400/80">{tech}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 group-hover:bg-red-500/10 border border-white/10 group-hover:border-red-500/30 rounded-xl text-white font-orbitron text-xs tracking-wider transition-all">
                        {t("cert_detay_gor")}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
          {/* ── Certificates ─────────────────────────────────────────────────────── */}
          <motion.div id="sertifikalar" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mt-32 mb-16 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-white">{t("cert_title")}</h2>
            <div className="w-16 h-1 bg-red-500 mx-auto mt-4" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {certificates.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05, type: "spring", stiffness: 100, damping: 15 }}
              >
                <motion.div onClick={() => setActiveCertificate(i)}
                  whileHover={{ y: -6, boxShadow: "0 15px 30px -10px rgba(6,182,212,0.15)", transition: { type: "spring", stiffness: 300, damping: 20 } }}
                  className="glass p-8 rounded-2xl border border-white/5 hover:border-red-500/30 transition-colors group relative overflow-hidden flex flex-col justify-between cursor-pointer h-full"
                >
                  <div>
                    <div className="text-red-500 mb-6 group-hover:scale-110 transition-transform origin-left w-12 h-12 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center justify-center"><Award size={24} /></div>
                    <h3 className="text-xl font-orbitron mb-2 text-white group-hover:text-red-400 transition-colors">{cert.title}</h3>
                    <p className="text-base font-rajdhani text-red-400/80 font-semibold mb-1">{cert.issuer}</p>
                    <p className="text-sm font-rajdhani text-gray-500 mb-4">{cert.date}</p>
                    <p className="text-sm font-rajdhani text-gray-400 leading-relaxed mb-6">{cert.description}</p>
                  </div>
                  <div>
                    <div className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 group-hover:bg-red-500/10 border border-white/10 group-hover:border-red-500/30 rounded-xl text-white font-orbitron text-xs tracking-wider transition-all">{t("cert_detay_gor")}</div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
          {/* ── Education ────────────────────────────────────────────────────────── */}
          <motion.div id="egitim" initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mt-32 mb-16 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-white">{t("edu_title")}</h2>
            <div className="w-16 h-1 bg-red-500 mx-auto mt-4" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
            {educations.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <motion.div onClick={() => setActiveEducation(i)}
                  whileHover={{ y: -6, boxShadow: "0 15px 30px -10px rgba(6,182,212,0.15)", transition: { type: "spring", stiffness: 300, damping: 20 } }}
                  className="glass p-8 rounded-2xl border border-white/5 hover:border-red-500/30 transition-colors group relative overflow-hidden flex flex-col justify-between cursor-pointer h-full"
                >
                  <div>
                    <div className="text-red-500 mb-6 group-hover:scale-110 transition-transform origin-left w-12 h-12 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center justify-center">
                      {edu.title.includes("English") || edu.title.includes("İngilizce") ? <Languages size={24} /> : <GraduationCap size={24} />}
                    </div>
                    <h3 className="text-xl font-orbitron mb-2 text-white group-hover:text-red-400 transition-colors">{edu.title}</h3>
                    <p className="text-base font-rajdhani text-red-400/80 font-semibold mb-1">{edu.issuer}</p>
                    <p className="text-sm font-rajdhani text-gray-500 mb-4">{edu.date}</p>
                    <p className="text-sm font-rajdhani text-gray-400 leading-relaxed mb-6">{edu.description}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {edu.skills.map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-orbitron px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-red-400/80">{skill}</span>
                      ))}
                    </div>
                    <div className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 group-hover:bg-red-500/10 border border-white/10 group-hover:border-red-500/30 rounded-xl text-white font-orbitron text-xs tracking-wider transition-all">{t("edu_detay_gor")}</div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </div>
      {/* ── Software Detail Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeSoftwareProject !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-gradient-to-br from-purple-950/30 via-indigo-950/20 to-black/60 backdrop-blur-md p-4 md:p-10"
            onClick={() => { setActiveSoftwareProject(null); setShowSoftwareScreenshots(false); }}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }}
              className="glass pt-6 md:pt-8 pb-8 md:pb-12 px-8 md:px-16 rounded-3xl border border-red-500/20 relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.15)] max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => { if (showSoftwareScreenshots) { setShowSoftwareScreenshots(false); } else { setActiveSoftwareProject(null); } }}
                className="mb-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all font-orbitron text-sm uppercase tracking-wider group cursor-pointer z-50 relative"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                {language === "tr" ? "Geri Dön" : "Go Back"}
              </button>
              <AnimatePresence mode="wait">
                {!showSoftwareScreenshots ? (
                  <motion.div key="details-text" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }} className="relative">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="text-red-400 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {React.cloneElement(softwareProjects[activeSoftwareProject].icon as React.ReactElement<any>, { size: 40 })}
                      </div>
                      <div>
                        <h3 className="text-3xl md:text-4xl font-orbitron text-white">{softwareProjects[activeSoftwareProject].title}</h3>
                        {softwareProjects[activeSoftwareProject].role && (
                          <span className="text-xs font-orbitron text-red-400/80 uppercase tracking-widest block mt-1">{softwareProjects[activeSoftwareProject].role}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5 mb-5">
                      {softwareProjects[activeSoftwareProject].techStack.map((tech, idx) => (
                        <span key={idx} className="text-xs font-orbitron px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-300">{tech}</span>
                      ))}
                    </div>
                    <div className="space-y-6 text-lg font-rajdhani text-gray-300 leading-relaxed mb-8 border-t border-white/5 pt-6">
                      {softwareProjects[activeSoftwareProject].detailedDescription.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/5 pt-8">
                      <a href={softwareProjects[activeSoftwareProject].githubUrl} target="_blank" rel="noopener noreferrer"
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 rounded-2xl text-white font-orbitron tracking-wider transition-all group shadow-[0_4px_20px_rgba(0,0,0,0.3)] cursor-pointer"
                      >
                        <Github size={20} className="group-hover:scale-110 transition-transform" />
                        {language === "tr" ? "GitHub Deposu" : "GitHub Repository"}
                        <ExternalLink size={16} className="text-white/50 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </a>
                      {softwareProjects[activeSoftwareProject].gallery && softwareProjects[activeSoftwareProject].gallery.length > 0 && (
                        <button onClick={() => setShowSoftwareScreenshots(true)}
                          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-2xl text-red-400 font-orbitron tracking-wider transition-all group shadow-[0_4px_20px_rgba(34,211,238,0.15)] cursor-pointer"
                        >
                          <Images size={20} className="group-hover:scale-110 transition-transform" />
                          {t("modal_screenshots")}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="screenshots-grid" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="w-full flex flex-col gap-4 pt-0">
                    <div className="text-center">
                      <h3 className="text-base md:text-lg font-bold font-orbitron text-red-400/90 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] uppercase tracking-widest">{t("modal_screenshots")}</h3>
                      <div className="w-16 h-[2px] bg-red-500/60 mx-auto mt-2" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
                      {softwareProjects[activeSoftwareProject].gallery.map((img, idx) => (
                        <div key={idx} className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.4)] cursor-pointer group/screen" onClick={() => setEnlargedSoftwareImageSrc(img)}>
                          <Image src={img} alt={`${softwareProjects[activeSoftwareProject].title} Screen ${idx + 1}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover/screen:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-red-950/20 opacity-0 group-hover/screen:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="font-orbitron text-[10px] text-red-400 bg-black/60 border border-red-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">{t("row_buyut")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── Certificate Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeCertificate !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-gradient-to-br from-purple-950/30 via-indigo-950/20 to-black/60 backdrop-blur-md p-4 md:p-10"
            onClick={() => setActiveCertificate(null)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }}
              className="glass pt-6 md:pt-8 pb-8 md:pb-12 px-8 md:px-16 rounded-3xl border border-red-500/20 relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.15)] max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setActiveCertificate(null)} className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all font-orbitron text-sm uppercase tracking-wider group cursor-pointer z-50 relative">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                {language === "tr" ? "Geri Dön" : "Go Back"}
              </button>
              <div className="relative">
                <div className="flex items-center gap-6 mb-6">
                  <div className="text-red-400 p-4 bg-red-500/10 rounded-2xl border border-red-500/20"><Award size={40} /></div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-orbitron text-white">{certificates[activeCertificate].title}</h3>
                    <span className="text-xs font-orbitron text-red-400/80 uppercase tracking-widest block mt-1">{certificates[activeCertificate].issuer} &bull; {certificates[activeCertificate].date}</span>
                  </div>
                </div>
                <div className="space-y-6 text-lg font-rajdhani text-gray-300 leading-relaxed mb-8 border-t border-white/5 pt-6">
                  <p>{certificates[activeCertificate].detailedDescription}</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-end items-center gap-6 border-t border-white/5 pt-8">
                  <a href={certificates[activeCertificate].credentialUrl} target="_blank" rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-2xl text-red-400 font-orbitron tracking-wider transition-all group shadow-[0_4px_20px_rgba(34,211,238,0.15)] cursor-pointer"
                  >
                    {language === "tr" ? "Sertifikayı Doğrula" : "Verify Certificate"}
                    <ExternalLink size={16} className="text-white/50 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── Education Modal ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeEducation !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-gradient-to-br from-purple-950/30 via-indigo-950/20 to-black/60 backdrop-blur-md p-4 md:p-10"
            onClick={() => setActiveEducation(null)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }}
              className="glass pt-6 md:pt-8 pb-8 md:pb-12 px-8 md:px-16 rounded-3xl border border-red-500/20 relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.15)] max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setActiveEducation(null)} className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all font-orbitron text-sm uppercase tracking-wider group cursor-pointer z-50 relative">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                {language === "tr" ? "Geri Dön" : "Go Back"}
              </button>
              <div className="relative">
                <div className="flex items-center gap-6 mb-6">
                  <div className="text-red-400 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                    {educations[activeEducation].title.includes("English") || educations[activeEducation].title.includes("İngilizce") ? <Languages size={40} /> : <GraduationCap size={40} />}
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-orbitron text-white">{educations[activeEducation].title}</h3>
                    <span className="text-xs font-orbitron text-red-400/80 uppercase tracking-widest block mt-1">{educations[activeEducation].issuer} &bull; {educations[activeEducation].date}</span>
                  </div>
                </div>
                <div className="space-y-6 text-lg font-rajdhani text-gray-300 leading-relaxed mb-8 border-t border-white/5 pt-6 whitespace-pre-line">
                  <p>{educations[activeEducation].detailedDescription}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── Software Lightbox ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {enlargedSoftwareImageSrc !== null && activeSoftwareProject !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[140] flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none"
            onClick={() => setEnlargedSoftwareImageSrc(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 z-50 cursor-pointer" onClick={() => setEnlargedSoftwareImageSrc(null)}><X size={28} /></button>
            <button className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300 hover:scale-110 transition-all p-4 bg-red-950/40 hover:bg-red-500/20 border border-red-500/30 rounded-full hidden md:block cursor-pointer"
              onClick={(e) => { e.stopPropagation(); const gallery = softwareProjects[activeSoftwareProject].gallery; const i = gallery.indexOf(enlargedSoftwareImageSrc || ""); if (i !== -1) setEnlargedSoftwareImageSrc(gallery[(i - 1 + gallery.length) % gallery.length]); }}
            ><ChevronLeft size={32} /></button>
            <motion.div key={enlargedSoftwareImageSrc} drag={isMobileDevice ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6}
              onDragEnd={(e, info) => { const gallery = softwareProjects[activeSoftwareProject!].gallery; const i = gallery.indexOf(enlargedSoftwareImageSrc || ""); if (i !== -1) { if (info.offset.x < -50) setEnlargedSoftwareImageSrc(gallery[(i + 1) % gallery.length]); else if (info.offset.x > 50) setEnlargedSoftwareImageSrc(gallery[(i - 1 + gallery.length) % gallery.length]); } }}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
              className={`relative w-full max-w-[95vw] h-[96vh] flex items-center justify-center p-2 ${isMobileDevice ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
              style={{ touchAction: "none" }} onClick={(e) => e.stopPropagation()}
            >
              <Image src={enlargedSoftwareImageSrc || ""} alt="Software Project Enlarged Screenshot" fill className="object-contain drop-shadow-[0_0_50px_rgba(6,182,212,0.15)] pointer-events-none select-none" />
            </motion.div>
            <button className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300 hover:scale-110 transition-all p-4 bg-red-950/40 hover:bg-red-500/20 border border-red-500/30 rounded-full hidden md:block cursor-pointer"
              onClick={(e) => { e.stopPropagation(); const gallery = softwareProjects[activeSoftwareProject!].gallery; const i = gallery.indexOf(enlargedSoftwareImageSrc || ""); if (i !== -1) setEnlargedSoftwareImageSrc(gallery[(i + 1) % gallery.length]); }}
            ><ChevronRight size={32} /></button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-orbitron text-xs tracking-widest text-white/40 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              {(enlargedSoftwareImageSrc ? softwareProjects[activeSoftwareProject].gallery.indexOf(enlargedSoftwareImageSrc) : 0) + 1} / {softwareProjects[activeSoftwareProject].gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SubPageLayout>
  );
}
