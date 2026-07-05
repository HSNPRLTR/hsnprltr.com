"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Lock, Unlock, Radio, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import SubPageLayout from "@/components/SubPageLayout";
import CinematicHero from "@/components/CinematicHero";
import ContactVisualizer from "@/components/ContactVisualizer";

export default function ContactPage() {
  const { t, language } = useLanguage();

  const [isMobileDevice, setIsMobileDevice] = React.useState(false);
  React.useEffect(() => {
    const isMobileSize = window.innerWidth < 768;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobileDevice(isMobileSize || isMobileUA);
  }, []);

  const [contactForm, setContactForm] = React.useState({ ad: "", eposta: "", telefon: "", mesaj: "" });
  const [isContactSubmitted, setIsContactSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const isAdValid = contactForm.ad.trim().length > 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.eposta.trim());
  const isMesajValid = contactForm.mesaj.trim().length >= 50;
  const signalStrength = (isAdValid ? 25 : 0) + (isEmailValid ? 25 : 0) + (isMesajValid ? 50 : 0);

  return (
    <SubPageLayout
      gradientClass={isMobileDevice 
        ? "bg-[radial-gradient(ellipse_at_50%_0%,rgba(168,85,247,0.25),transparent_70%),linear-gradient(to_bottom,#100220,#05000A)]" 
        : "bg-[radial-gradient(ellipse_at_50%_30%,rgba(6,182,212,0.06),transparent_55%),radial-gradient(ellipse_at_20%_80%,rgba(14,116,144,0.06),transparent_50%)]"
      }
      skyboxPath="/Skybox/contact.glb"
      autoRotateSkybox={true}
    >
      <CinematicHero title={t("contact_title") || "Contact"} themeColorClass="text-fuchsia-500" />
      <section className="pb-32 px-6 relative overflow-hidden" id="contact">
        <ContactVisualizer />
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80, damping: 15 }}
            className="glass neon-border p-12 rounded-3xl relative z-10 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50" />

            <h1 className="text-3xl md:text-4xl font-orbitron mb-12 flex items-center gap-4">
              <span className="w-3 h-10 bg-fuchsia-500 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              {t("contact_title")}
            </h1>

            <AnimatePresence mode="wait">
              {!isContactSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (signalStrength === 100 && !isSubmitting) {
                      setIsSubmitting(true);
                      setSubmitError(null);
                      try {
                        const response = await fetch("https://api.web3forms.com/submit", {
                          method: "POST",
                          headers: { "Content-Type": "application/json", "Accept": "application/json" },
                          body: JSON.stringify({
                            access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "",
                            name: contactForm.ad,
                            email: contactForm.eposta,
                            phone: contactForm.telefon || "Belirtilmedi",
                            message: contactForm.mesaj,
                            subject: "Hasan Parlatır - Yeni İletişim Terminali Sinyali"
                          })
                        });
                        const result = await response.json();
                        if (result.success) {
                          setIsContactSubmitted(true);
                        } else {
                          setSubmitError(result.message || (language === "tr" ? "Sinyal iletilemedi." : "Signal could not be transmitted."));
                        }
                      } catch {
                        setSubmitError(language === "tr" ? "Bağlantı hatası oluştu." : "Connection error occurred.");
                      } finally {
                        setIsSubmitting(false);
                      }
                    }
                  }}
                  className="space-y-8"
                >
                  {/* Signal Strength */}
                  <div className="space-y-3 bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />
                    <div className="flex justify-between items-center text-xs font-orbitron">
                      <span className="text-gray-400 tracking-wider flex items-center gap-2">
                        <Radio size={14} className="text-fuchsia-400 animate-pulse" />
                        {t("contact_signal_strength")}
                      </span>
                      <span className={`${signalStrength === 100 ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "text-fuchsia-400"} font-bold tracking-widest`}>%{signalStrength}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
                      <motion.div
                        className={`h-full ${signalStrength === 100 ? "bg-gradient-to-r from-fuchsia-500 to-emerald-500" : "bg-fuchsia-500"} shadow-[0_0_15px_rgba(6,182,212,0.8)]`}
                        initial={{ width: 0 }}
                        animate={{ width: `${signalStrength}%` }}
                        transition={{ type: "spring", stiffness: 80, damping: 15 }}
                      />
                    </div>
                    {signalStrength < 100 && <p className="text-[10px] font-rajdhani text-white/40 tracking-wider">{t("contact_signal_warning")}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-orbitron uppercase text-fuchsia-400/60 tracking-widest">{t("contact_label_sender")}</label>
                        {isAdValid && <span className="text-[9px] font-orbitron text-emerald-400 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{t("contact_status_active")} (+%25)</span>}
                      </div>
                      <input type="text" required value={contactForm.ad} onChange={(e) => setContactForm({ ...contactForm, ad: e.target.value })}
                        className="w-full bg-white/5 border border-fuchsia-500/20 hover:border-fuchsia-400/40 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/30 p-4 rounded-xl font-rajdhani focus:outline-none transition-all duration-300 placeholder-white/20 text-white"
                        placeholder={t("contact_placeholder_name")} />
                    </div>
                    {/* Email */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-orbitron uppercase text-fuchsia-400/60 tracking-widest">{t("contact_label_coordinates")}</label>
                        {isEmailValid && <span className="text-[9px] font-orbitron text-emerald-400 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{t("contact_status_active")} (+%25)</span>}
                      </div>
                      <input type="email" required value={contactForm.eposta} onChange={(e) => setContactForm({ ...contactForm, eposta: e.target.value })}
                        className="w-full bg-white/5 border border-fuchsia-500/20 hover:border-fuchsia-400/40 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/30 p-4 rounded-xl font-rajdhani focus:outline-none transition-all duration-300 placeholder-white/20 text-white"
                        placeholder={t("contact_placeholder_email")} />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-orbitron uppercase text-fuchsia-400/60 tracking-widest">{t("contact_label_backup")}</label>
                      {contactForm.telefon.trim().length > 0 && <span className="text-[9px] font-orbitron text-fuchsia-400 tracking-widest bg-fuchsia-500/10 px-2 py-0.5 rounded border border-fuchsia-500/20 animate-pulse">{t("contact_extra_freq")}</span>}
                    </div>
                    <input type="tel" value={contactForm.telefon} onChange={(e) => setContactForm({ ...contactForm, telefon: e.target.value })}
                      className="w-full bg-white/5 border border-fuchsia-500/20 hover:border-fuchsia-400/40 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/30 p-4 rounded-xl font-rajdhani focus:outline-none transition-all duration-300 placeholder-white/20 text-white"
                      placeholder={t("contact_placeholder_phone")} />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-orbitron uppercase text-fuchsia-400/60 tracking-widest">{t("contact_label_details")}</label>
                      {isMesajValid && <span className="text-[9px] font-orbitron text-emerald-400 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{t("contact_status_active")} (+%50)</span>}
                    </div>
                    <textarea rows={5} required value={contactForm.mesaj} onChange={(e) => setContactForm({ ...contactForm, mesaj: e.target.value })}
                      className="w-full bg-white/5 border border-fuchsia-500/20 hover:border-fuchsia-400/40 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/30 p-4 rounded-xl font-rajdhani focus:outline-none transition-all duration-300 resize-none placeholder-white/20 text-white"
                      placeholder={t("contact_placeholder_message")} />
                  </div>

                  {submitError && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-rajdhani p-4 rounded-lg text-center">
                      {(language === "tr" ? "⚠️ HATA: " : "⚠️ ERROR: ")}{submitError}
                    </div>
                  )}

                  <button type="submit" disabled={signalStrength < 100 || isSubmitting}
                    className={`w-full py-6 font-orbitron text-lg uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-4 group cursor-pointer ${isSubmitting
                      ? "bg-fuchsia-600/20 border border-fuchsia-500/50 text-fuchsia-300 cursor-wait"
                      : signalStrength === 100
                        ? "bg-gradient-to-r from-fuchsia-600/30 to-emerald-600/30 hover:from-fuchsia-500/40 hover:to-emerald-500/40 border border-emerald-500/80 text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.4)]"
                        : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? (
                      <><span className="w-5 h-5 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin" />{t("contact_btn_transmitting")}</>
                    ) : signalStrength === 100 ? (
                      <><Unlock size={20} className="text-emerald-400 animate-bounce" />{t("contact_btn_transmit")}</>
                    ) : (
                      <><Lock size={20} className="text-white/40" />{t("contact_btn_transmit")}</>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div key="contact-success" initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 15 }} className="py-16 text-center space-y-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_35px_rgba(52,211,153,0.3)] relative">
                    <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-ping opacity-75" />
                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-orbitron font-bold text-emerald-400 uppercase tracking-widest drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">{t("contact_success_title")}</h3>
                    <p className="font-rajdhani text-xl text-gray-300 max-w-lg mx-auto leading-relaxed font-semibold">{t("contact_success_body")}</p>
                  </div>
                  <div className="pt-6">
                    <button onClick={() => { setContactForm({ ad: "", eposta: "", telefon: "", mesaj: "" }); setIsContactSubmitted(false); }}
                      className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-fuchsia-500/50 rounded-xl text-sm font-orbitron uppercase text-fuchsia-400 tracking-[0.2em] transition-all cursor-pointer font-bold"
                    >
                      {t("contact_success_new")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap justify-center gap-12">
              <a href="mailto:hparlatir05@gmail.com" className="flex items-center gap-3 text-white/50 hover:text-fuchsia-400 transition-colors font-rajdhani">
                <Mail size={18} /> hparlatir05@gmail.com
              </a>
              <a href="https://discord.com/users/423413637353308161" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/50 hover:text-fuchsia-400 transition-colors font-rajdhani">
                <MessageSquare size={18} /> Discord: hsnprltr
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </SubPageLayout>
  );
}
