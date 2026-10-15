import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-foreground text-cream py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-4"
          >
            <div className="inline-flex rounded-xl bg-cream px-3 py-2">
              <img src={logo} alt="El Media Lab" className="h-12 w-auto" />
            </div>
            <p className="text-cream/60 font-body text-sm leading-relaxed">
              {t("footer.description")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.08 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h4 className="font-heading text-sm uppercase tracking-wider mb-4 text-aqua">{t("footer.quickLinks")}</h4>
            <div className="space-y-2">
              <a href="/#about" className="block text-cream/60 hover:text-cream text-sm font-body transition-colors">{t("footer.aboutUs")}</a>
              <Link to="/projects" className="block text-cream/60 hover:text-cream text-sm font-body transition-colors">{t("footer.projects")}</Link>
              <a href="/#partners" className="block text-cream/60 hover:text-cream text-sm font-body transition-colors">{t("footer.partners")}</a>
              <Link to="/projects#testimonials" className="block text-cream/60 hover:text-cream text-sm font-body transition-colors">{t("footer.testimonials")}</Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.16 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h4 className="font-heading text-sm uppercase tracking-wider mb-4 text-aqua">{t("footer.getInTouch")}</h4>
            <div className="pt-1">
              <Link to="/contact" className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/95 font-heading text-sm px-6 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md active:scale-95 text-center">
                {t("footer.getInTouch")}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.24 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h4 className="font-heading text-sm uppercase tracking-wider mb-4 text-aqua">{t("footer.contact")}</h4>
            <div className="space-y-2 text-cream/60 text-sm font-body">
              <p>
                <a
                  href="mailto:elmedialab@gmail.com"
                  className="hover:text-cream transition-colors"
                >
                  elmedialab@gmail.com
                </a>
              </p>
              <div className="flex gap-4 mt-4">
                <a
                  href="https://www.instagram.com/elmedia_lab/?hl=fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/40 hover:text-aqua transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=100092296554280&ref=PROFILE_EDIT_xav_ig_profile_page_web#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/40 hover:text-aqua transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="https://www.linkedin.com/company/elmedia-lab/?viewAsMember=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/40 hover:text-aqua transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
          className="border-t border-cream/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-cream/40 text-xs font-body">© 2026 El Media Lab. {t("footer.rights")}</p>
          <p className="text-cream/40 text-xs font-body">{t("footer.arabicTagline")}</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
