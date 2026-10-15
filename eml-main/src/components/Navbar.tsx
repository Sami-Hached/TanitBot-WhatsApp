import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.about"), href: "/#about" },
    { label: t("nav.tanitbot") || "TanitBot", href: "/chat" },
    { label: t("nav.projects"), href: "/projects" },
    { label: t("nav.partners"), href: "/#partners" },
    { label: t("nav.testimonials"), href: "/projects#testimonials" },
    { label: t("blogPage.title"), href: "/blog" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="El Media Lab" className="h-12 md:h-14 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className="font-heading text-sm tracking-wide text-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="bg-primary text-primary-foreground font-heading text-sm px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
          >
            {t("nav.getInvolved")}
          </Link>
          <div className="inline-flex items-center rounded-full border border-border p-1">
            <button
              type="button"
              onClick={() => i18n.changeLanguage("en")}
              className={`px-3 py-1 text-xs font-heading rounded-full transition-colors ${
                i18n.language === "en" ? "bg-primary text-primary-foreground" : "text-foreground"
              }`}
            >
              {t("common.english")}
            </button>
            <button
              type="button"
              onClick={() => i18n.changeLanguage("ar")}
              className={`px-3 py-1 text-xs font-heading rounded-full transition-colors ${
                i18n.language === "ar" ? "bg-primary text-primary-foreground" : "text-foreground"
              }`}
            >
              {t("common.arabic")}
            </button>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label={t("nav.toggleMenu")}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cream border-t border-border px-6 pb-6 animate-fade-in">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 font-heading text-sm text-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 inline-block bg-primary text-primary-foreground font-heading text-sm px-6 py-2.5 rounded-full"
          >
            {t("nav.getInvolved")}
          </Link>
          <div className="mt-4 inline-flex items-center rounded-full border border-border p-1">
            <button
              type="button"
              onClick={() => i18n.changeLanguage("en")}
              className={`px-3 py-1 text-xs font-heading rounded-full transition-colors ${
                i18n.language === "en" ? "bg-primary text-primary-foreground" : "text-foreground"
              }`}
            >
              {t("common.english")}
            </button>
            <button
              type="button"
              onClick={() => i18n.changeLanguage("ar")}
              className={`px-3 py-1 text-xs font-heading rounded-full transition-colors ${
                i18n.language === "ar" ? "bg-primary text-primary-foreground" : "text-foreground"
              }`}
            >
              {t("common.arabic")}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
