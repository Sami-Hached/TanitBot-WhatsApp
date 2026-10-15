import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

type ProjectCard = {
  title: string;
  description: string;
  tag: string;
  color: string;
};

const CurrentProjects = () => {
  const { t } = useTranslation();
  const projects = t("currentProjects.items", { returnObjects: true }) as ProjectCard[];

  return (
    <section className="py-20">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="font-heading text-3xl md:text-4xl text-center mb-4 text-foreground"
        >
          {t("currentProjects.titlePrefix")} <span className="text-primary">{t("currentProjects.titleHighlight")}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-muted-foreground text-center max-w-lg mx-auto mb-12 font-body"
        >
          {t("currentProjects.description")}
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, idx) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-cream rounded-2xl p-8 border border-border hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <span
                className={`inline-block ${p.color} text-primary-foreground font-heading text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-4`}
              >
                {p.tag}
              </span>
              <h3 className="font-heading text-xl text-foreground mb-3">{p.title}</h3>
              <p className="text-muted-foreground font-body leading-relaxed text-sm">
                {p.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-primary font-heading text-sm hover:underline"
          >
            {t("currentProjects.viewAll")} <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CurrentProjects;
