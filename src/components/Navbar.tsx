"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

interface NavChildLink {
  title: string;
  target: string;
}

interface NavLink {
  title: string;
  target: string;
  children?: NavChildLink[];
}

interface NavbarProps {
  isHidden?: boolean;
}

export default function Navbar({ isHidden = false }: NavbarProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const navLinks: NavLink[] = [
    { title: t("menu_home"), target: "#hero" },
    { title: t("menu_about"), target: "#about" },
    {
      title: t("menu_games"),
      target: "#games",
      children: [
        { title: "Aksolotl Gazi", target: "#aksolotl" },
        { title: "Justice: Has Faces", target: "#justice" },
        { title: "Fragments of Us", target: "#fou" },
        { title: "MERMAIDEN", target: "#mermaiden" },
        { title: "Echoes of the Peak", target: "#eotp" },
        { title: "Broken Heart", target: "#brokenheart" },
        { title: "Rock & Roll the Dice", target: "#rrtd" },
        { title: "CLOZOPINE", target: "#clozopine" },
      ],
    },
    {
      title: t("menu_software"),
      target: "#software",
      children: [
        { title: t("menu_certificates"), target: "#sertifikalar" },
        { title: t("menu_education"), target: "#egitim" },
      ],
    },
    { title: t("menu_work"), target: "#work-with-me" },
    { title: t("menu_social"), target: "#social" },
    { title: t("menu_contact"), target: "#contact" },
  ];


  useEffect(() => {
    const handleScroll = () => {
      // Show navbar when scrolling past the top of the Hero section
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMobileLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    scrollToSection(e, href);
  };

  const toggleAccordion = (title: string) => {
    setActiveAccordion(activeAccordion === title ? null : title);
  };

  return (
    <AnimatePresence>
      {!isHidden && isVisible && (
        <>
          {/* Desktop Navbar (> 1024px) */}
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-6 right-6 z-50 hidden lg:block"
          >
            <div className="bg-black/50 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] rounded-full px-8 py-3.5 flex items-center gap-8">
              {navLinks.map((link) => {
                const hasChildren = !!link.children;
                return (
                  <div
                    key={link.target}
                    className="relative py-1"
                    onMouseEnter={() => hasChildren && setHoveredItem(link.title)}
                    onMouseLeave={() => hasChildren && setHoveredItem(null)}
                  >
                    <a
                      href={link.target}
                      onClick={(e) => scrollToSection(e, link.target)}
                      className="text-xs md:text-sm font-orbitron font-medium text-gray-300 hover:text-cyan-400 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer select-none"
                    >
                      {link.title}
                      {hasChildren && (
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-300 ${hoveredItem === link.title ? "rotate-180 text-cyan-400" : ""
                            }`}
                        />
                      )}
                    </a>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {hasChildren && hoveredItem === link.title && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 bg-black/85 backdrop-blur-md border border-cyan-500/35 rounded-2xl py-3 shadow-[0_10px_30px_rgba(6,182,212,0.2)] flex flex-col z-50 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
                          {link.children?.map((child) => (
                            <a
                              key={child.target}
                              href={child.target}
                              onClick={(e) => {
                                setHoveredItem(null);
                                scrollToSection(e, child.target);
                              }}
                              className="px-5 py-2.5 text-xs font-orbitron text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all uppercase tracking-widest text-center border-b border-white/5 last:border-b-0 cursor-pointer"
                            >
                              {child.title}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              
              {/* Sci-Fi inline Language Toggle */}
              <div className="border-l border-cyan-500/25 pl-4 h-6 flex items-center">
                <LanguageToggle inline />
              </div>
            </div>
          </motion.nav>

          {/* Mobile Hamburger Trigger (< 1024px) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-6 right-6 z-[60] block lg:hidden"
          >
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3.5 bg-black/60 backdrop-blur-md border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] rounded-full text-cyan-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </motion.div>

          {/* Mobile Full Screen Menu Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col justify-center items-center p-8 block lg:hidden overflow-y-auto"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08),transparent_70%)] pointer-events-none" />

                <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 relative z-10 py-12">
                  {navLinks.map((link) => {
                    const hasChildren = !!link.children;
                    const isExpanded = activeAccordion === link.title;

                    return (
                      <div key={link.target} className="w-full flex flex-col items-center">
                        {hasChildren ? (
                          <button
                            onClick={() => toggleAccordion(link.title)}
                            className="text-xl md:text-2xl font-orbitron font-semibold text-gray-200 hover:text-cyan-400 transition-colors uppercase tracking-widest flex items-center gap-2 py-2.5 cursor-pointer"
                          >
                            {link.title}
                            <ChevronDown
                              size={18}
                              className={`transition-transform duration-300 text-cyan-500/80 ${isExpanded ? "rotate-180 text-cyan-400" : ""
                                }`}
                            />
                          </button>
                        ) : (
                          <a
                            href={link.target}
                            onClick={(e) => handleMobileLinkClick(e, link.target)}
                            className="text-xl md:text-2xl font-orbitron font-semibold text-gray-200 hover:text-cyan-400 transition-colors uppercase tracking-widest py-2.5 cursor-pointer text-center"
                          >
                            {link.title}
                          </a>
                        )}

                        {/* Accordion content */}
                        <AnimatePresence initial={false}>
                          {hasChildren && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden w-full flex flex-col items-center bg-cyan-950/20 border border-cyan-500/10 rounded-2xl py-2.5 mt-2 gap-1"
                            >
                              {link.children?.map((child) => (
                                <a
                                  key={child.target}
                                  href={child.target}
                                  onClick={(e) => handleMobileLinkClick(e, child.target)}
                                  className="text-sm font-orbitron text-gray-400 hover:text-cyan-400 transition-colors py-2 px-6 uppercase tracking-wider text-center w-full block cursor-pointer"
                                >
                                  {child.title}
                                </a>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
