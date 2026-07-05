import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
interface CinematicHeroProps {
  title: string;
  themeColorClass: string; // e.g., 'text-red-500'
}
export default function CinematicHero({ title, themeColorClass }: CinematicHeroProps) {
  const { scrollY } = useScroll();
  const opacityFade = useTransform(scrollY, [0, 100], [1, 0]);
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden z-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        className="text-center"
      >
        <h1 className={`text-6xl md:text-8xl lg:text-9xl font-bold font-orbitron tracking-tighter uppercase drop-shadow-[0_0_25px_rgba(255,255,255,0.1)] ${themeColorClass}`}>
          {title}
        </h1>
        <div className={`w-32 h-1 mx-auto mt-6 rounded-full bg-current opacity-50 ${themeColorClass}`} />
      </motion.div>
      {/* Scroll Down Indicator */}
      <motion.div
        style={{ opacity: opacityFade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-[100]"
      >

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className={`w-12 h-12 opacity-80 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] ${themeColorClass}`} />
        </motion.div>
      </motion.div>
    </div>
  );
}
