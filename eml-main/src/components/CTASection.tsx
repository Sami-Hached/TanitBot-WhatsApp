import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import ctaImg from "@/assets/cta-illustration.png";

const CTASection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.25 }}
          className="space-y-6"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">
            {t("cta.titlePrefix")} <span className="text-secondary">{t("cta.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground font-body leading-relaxed max-w-md">
            {t("cta.description")}
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-foreground text-cream font-heading text-sm px-8 py-3 rounded-full hover:bg-foreground/90 transition-colors"
          >
            {t("cta.button")} <ArrowRight size={16} />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 28, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true, amount: 0.25 }}
          className="relative"
        >
          <div className="absolute -top-6 -right-6 w-48 h-48 bg-wattle/20 rounded-full blur-2xl" />
          <img src={ctaImg} alt={t("cta.imageAlt")} className="relative z-10 w-full max-w-md mx-auto" />
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
