import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import heroImg from "@/assets/hero-illustration.jpg";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="container grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-6"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-block bg-wattle/20 text-jungle font-heading text-xs tracking-widest uppercase px-4 py-1.5 rounded-full"
          >
            {t("hero.badge")}
          </motion.span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground">
            {t("hero.titlePrefix")}{" "}
            <span className="text-blush font-bold">{t("hero.titleHighlight")}</span>{" "}
            {t("hero.titleSuffix")}
          </h1>
          <p className="text-black text-lg max-w-md font-body leading-relaxed">
            {t("hero.description")}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-4 items-center"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-heading text-sm px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              {t("hero.primaryCta")} <ArrowRight size={16} />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 border border-border bg-white text-foreground font-heading text-sm px-8 py-3 rounded-full hover:bg-cream/60 transition-colors"
            >
              {t("nav.tanitbot") || "TanitBot"}
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative"
        >
          <div className="absolute -top-8 -right-8 w-72 h-72 bg-aqua/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-56 h-56 bg-blush/20 rounded-full blur-3xl" />
          <img
            src={heroImg}
            alt={t("hero.imageAlt")}
            className="relative z-15 w-full max-w-lg mx-auto scale-110 md:scale-125 transition-transform duration-700 hover:scale-[1.3]"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
