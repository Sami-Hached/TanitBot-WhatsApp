import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertOctagon, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";

const DigitalRightsGuide = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [showAll, setShowAll] = useState(false);

  const dos = t("digitalRights.dos", { returnObjects: true }) as string[];
  const donts = t("digitalRights.donts", { returnObjects: true }) as string[];

  const visibleCount = 5;
  const visibleDos = showAll ? dos : dos.slice(0, visibleCount);
  const visibleDonts = showAll ? donts : donts.slice(0, visibleCount);

  return (
    <section id="digital-rights" className="py-24 overflow-hidden bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-accent/20 text-primary font-heading text-xs tracking-widest uppercase px-4 py-1.5 rounded-full"
          >
            <ShieldAlert size={14} className="text-secondary animate-pulse" />
            {t("digitalRights.titleHighlight")}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight"
          >
            {t("digitalRights.titlePrefix")}{" "}
            <span className="text-secondary font-bold">{t("digitalRights.titleHighlight")}</span>{" "}
            {t("digitalRights.titleSuffix")}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground font-body text-base md:text-lg leading-relaxed"
          >
            {t("digitalRights.subtitle")}
          </motion.p>
        </div>

        {/* DOs & DON'Ts Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* DOs Card Column */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-lime/5 border border-lime/20 rounded-[2.5rem] p-6 md:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Visual background blob */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-lime/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
            
            <h3 className="font-heading text-2xl text-jungle mb-2 flex items-center gap-3">
              <span className="w-2.5 h-8 bg-lime rounded-full" />
              {t("digitalRights.doTitle")}
            </h3>
            <p className="text-muted-foreground font-body text-sm mb-8">
              {t("digitalRights.doSubtitle")}
            </p>

            {/* List */}
            <ul className="space-y-4 relative z-10">
              <AnimatePresence initial={false}>
                {visibleDos.map((item, idx) => (
                  <motion.li
                    key={`do-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-border/40 hover:border-lime/30 hover:shadow-sm transition-all duration-300 hover:-translate-y-[2px]"
                  >
                    <span className="shrink-0 w-6.5 h-6.5 rounded-full bg-lime/20 flex items-center justify-center text-primary mt-0.5">
                      <CheckCircle2 size={16} className="text-primary font-bold" />
                    </span>
                    <span className="text-foreground font-body text-sm md:text-base leading-relaxed">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>

          {/* DON'Ts Card Column */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-secondary/5 border border-secondary/20 rounded-[2.5rem] p-6 md:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Visual background blob */}
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-secondary/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
            
            <h3 className="font-heading text-2xl text-foreground mb-2 flex items-center gap-3">
              <span className="w-2.5 h-8 bg-secondary rounded-full" />
              {t("digitalRights.dontTitle")}
            </h3>
            <p className="text-muted-foreground font-body text-sm mb-8">
              {t("digitalRights.dontSubtitle")}
            </p>

            {/* List */}
            <ul className="space-y-4 relative z-10">
              <AnimatePresence initial={false}>
                {visibleDonts.map((item, idx) => (
                  <motion.li
                    key={`dont-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-border/40 hover:border-secondary/30 hover:shadow-sm transition-all duration-300 hover:-translate-y-[2px]"
                  >
                    <span className="shrink-0 w-6.5 h-6.5 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mt-0.5">
                      <AlertOctagon size={16} className="text-secondary" />
                    </span>
                    <span className="text-foreground font-body text-sm md:text-base leading-relaxed">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>
        </div>

        {/* Toggle Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-cream font-heading text-sm px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none"
          >
            {showAll ? (
              <>
                {t("digitalRights.showLess")} <ChevronUp size={16} />
              </>
            ) : (
              <>
                {t("digitalRights.showMore")} <ChevronDown size={16} />
              </>
            )}
          </button>
        </motion.div>

        {/* Interactive TanitBot Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-[2.5rem] bg-gradient-to-r from-casal to-jungle text-cream p-8 md:p-12 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center md:text-start relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream/15 text-cream text-xs font-heading font-medium tracking-wide">
              {isArabic ? "استشارة فورية" : "Instant Guidance"}
            </span>
            <h3 className="font-heading text-2xl md:text-3xl font-bold">
              {isArabic ? "تعرضت لمشكلة أو تحتاج استشارة فورية؟" : "Facing a digital emergency or need instant advice?"}
            </h3>
            <p className="text-cream/80 font-body text-sm md:text-base max-w-xl">
              {isArabic
                ? "تحدث مباشرة ومجهول الهوية مع تانيت بوت، المساعد الذكي المدرب على القوانين وأدلة السلامة الرقمية في تونس."
                : "Chat anonymously with TanitBot, our AI safety assistant grounded in Tunisian digital security guides."}
            </p>
          </div>
          <Link
            to="/chat"
            className="shrink-0 bg-lime text-jungle font-heading font-bold text-sm px-8 py-3.5 rounded-full hover:bg-lime/90 transition-all shadow-md hover:scale-105"
          >
            {isArabic ? "تحدث مع تانيت بوت الآن" : "Chat with TanitBot Now"}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default DigitalRightsGuide;
