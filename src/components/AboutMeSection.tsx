"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gamepad2, Music, Film, ChevronDown } from "lucide-react";
import { SiUnity, SiCplusplus, SiCanva, SiDotnet } from "react-icons/si";
import { TbBrandCSharp, TbBrandAdobePhotoshop, TbBrandAdobePremier } from "react-icons/tb";
import { PiMicrosoftExcelLogo, PiMicrosoftPowerpointLogo, PiMicrosoftWordLogo } from "react-icons/pi";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutMeSection() {
  const { t, language } = useLanguage();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeInVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
  } as const;

  return (
    <div className="relative w-full flex flex-col pointer-events-none">

      {/* Block 1: Hero 1 */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center pointer-events-auto">
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={fadeInVariant}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold text-white font-orbitron tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] text-center px-4"
        >
          {t("about_title")}
        </motion.h1>

        <motion.div
          animate={{
            opacity: isScrolled ? 0 : 0.5,
            y: isScrolled ? 15 : [0, 15, 0]
          }}
          transition={isScrolled ? { duration: 0.3 } : { y: { duration: 2, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.3 } }}
          className="absolute bottom-10 text-white/50 pointer-events-none"
        >
          <ChevronDown size={48} />
        </motion.div>
      </section>

      {/* Block 2: Unity & C# */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 pointer-events-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          variants={fadeInVariant}
          className="max-w-6xl mx-auto flex flex-col items-center text-center gap-10"
        >
          <div className="flex items-center gap-12">
            <SiUnity className="text-8xl md:text-9xl text-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
            <TbBrandCSharp className="text-8xl md:text-9xl text-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-rajdhani text-gray-200 leading-tight">
            {language === "tr"
              ? "Ben Hasan Parlatır. 5 yıllık Unity ve C# deneyimine sahip bağımsız oyun geliştiricisi ve yazılımcıyım."
              : "I am Hasan Parlatır. An independent game developer and software engineer with 5 years of Unity and C# experience."}
          </h2>
        </motion.div>
      </section>

      {/* Block 3: C++ & GDD */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 pointer-events-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          variants={fadeInVariant}
          className="max-w-6xl mx-auto flex flex-col items-center text-center gap-10"
        >
          <div className="flex items-center gap-12">
            <SiCplusplus className="text-8xl md:text-9xl text-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
            <SiDotnet className="text-8xl md:text-9xl text-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-rajdhani text-gray-200 leading-tight">
            {language === "tr"
              ? "C++ ile 2D oyun motoru ve ASP.NET Core ile REST API sistemleri geliştirdim."
              : "I developed a 2D game engine with C++ and REST API systems using ASP.NET Core."}
          </h2>
        </motion.div>
      </section>

      {/* Block 4: Ekstra Beceriler */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 pointer-events-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeInVariant}
          className="max-w-6xl mx-auto flex flex-col items-center text-center gap-12"
        >
          <h3 className="text-xl md:text-2xl font-orbitron tracking-[0.3em] uppercase text-gray-400">
            {t("about_extra_skills")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full">
            <div className="flex flex-col items-center gap-6">
              <TbBrandAdobePremier className="text-8xl text-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
              <span className="text-2xl font-rajdhani text-gray-300">{t("about_video_editing")}</span>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="flex gap-4">
                <TbBrandAdobePhotoshop className="text-8xl text-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
                <SiCanva className="text-8xl text-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
              </div>
              <span className="text-2xl font-rajdhani text-gray-300">{t("about_graphic_design")}</span>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="flex gap-4">
                <PiMicrosoftExcelLogo className="text-6xl md:text-7xl text-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
                <PiMicrosoftPowerpointLogo className="text-6xl md:text-7xl text-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
                <PiMicrosoftWordLogo className="text-6xl md:text-7xl text-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
              </div>
              <span className="text-2xl font-rajdhani text-gray-300">{t("about_data_presentation")}</span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold font-rajdhani text-gray-200 leading-tight mt-8">
            {language === "tr"
              ? "Kodlamanın ötesinde; oyun tasarımı, sistem mimarisi ve görsel medya üretiminde yetkinim."
              : "Beyond coding; I am proficient in game design, system architecture, and visual media production."}
          </h2>
        </motion.div>
      </section>

      {/* Block 5: İlgi Alanlarım - Cards */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 pointer-events-auto py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeInVariant}
          className="max-w-7xl mx-auto flex flex-col items-center text-center gap-12 w-full"
        >
          <h3 className="text-xl md:text-2xl font-orbitron tracking-[0.3em] uppercase text-gray-400">
            {t("about_interests")}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            {/* Card 1 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col items-center gap-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
              <Gamepad2 className="w-16 h-16 text-gray-400" />
              <h4 className="text-3xl font-orbitron text-white font-bold">{t("about_fav_games")}</h4>
              <div className="flex flex-col gap-4 w-full">
                <div className="p-4 bg-black/30 rounded-xl">
                  <p className="text-xl font-bold text-gray-200">The Last of Us Part 2</p>
                  <p className="text-sm text-gray-400 mt-1">{t("about_mechanics")}</p>
                </div>
                <div className="p-4 bg-black/30 rounded-xl">
                  <p className="text-xl font-bold text-gray-200">Hollow Knight</p>
                  <p className="text-sm text-gray-400 mt-1">{t("about_atmosphere")}</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col items-center gap-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
              <Music className="w-16 h-16 text-gray-400" />
              <h4 className="text-3xl font-orbitron text-white font-bold">{t("about_fav_music")}</h4>
              <div className="flex flex-col gap-4 w-full">
                <div className="p-4 bg-black/30 rounded-xl">
                  <p className="text-xl font-bold text-gray-200">Şehinşah</p>
                  <p className="text-sm text-gray-400 mt-1">Karma</p>
                </div>
                <div className="p-4 bg-black/30 rounded-xl">
                  <p className="text-xl font-bold text-gray-200">Sezen Aksu</p>
                  <p className="text-sm text-gray-400 mt-1">Biliyorsun</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col items-center gap-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
              <Film className="w-16 h-16 text-gray-400" />
              <h4 className="text-3xl font-orbitron text-white font-bold">{t("about_fav_media")}</h4>
              <div className="flex flex-col gap-4 w-full">
                <div className="p-4 bg-black/30 rounded-xl">
                  <p className="text-xl font-bold text-gray-200">Requiem For a Dream</p>
                  <p className="text-sm text-gray-400 mt-1">{t("about_movie")}</p>
                </div>
                <div className="p-4 bg-black/30 rounded-xl">
                  <p className="text-xl font-bold text-gray-200">Breaking Bad</p>
                  <p className="text-sm text-gray-400 mt-1">{t("about_series")}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Block 6: Closing Statement */}
      <section className="relative w-full min-h-[10vh] flex flex-col items-center justify-center px-6 pointer-events-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={fadeInVariant}
          className="max-w-6xl mx-auto text-4xl md:text-7xl font-bold font-rajdhani text-white text-center leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          {language === "tr"
            ? "Ekip çalısmasına yatkınım ve teknik Ingilizce bilgim iyi seviyede."
            : "Strong team player with good technical English skills."}
        </motion.h2>
      </section>

    </div>
  );
}
