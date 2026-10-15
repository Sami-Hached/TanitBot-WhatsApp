import AboutSection2 from "@/components/ui/about-section-2";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { BookOpen, Search, Lightbulb, Globe, Users, Cpu, Handshake } from "lucide-react";

const About = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const pillarIcons = [BookOpen, Search, Cpu];
  const pillarColors = ["bg-primary", "bg-secondary", "bg-aqua"];
  
  const pillars = (t("about.pillars", { returnObjects: true }) as any[]).map((p, i) => ({
    ...p,
    icon: pillarIcons[i],
    color: pillarColors[i]
  }));

  const valueIcons = [Globe, Users, Lightbulb, Handshake];
  const values = (t("about.values", { returnObjects: true }) as any[]).map((v, i) => ({
    ...v,
    icon: valueIcons[i]
  }));

  return (
    <section id="about" className="overflow-hidden">
      <AboutSection2 />
      
      <div id="about-details" className="bg-primary/5 py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <motion.div 
              initial={{ opacity: 0, x: isArabic ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-cream border border-border rounded-[2rem] p-8 md:p-12 shadow-sm"
            >
              <h3 className="font-heading text-3xl text-foreground mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                {t("about.whoAreWe")}
              </h3>
              <p className="font-body text-muted-foreground text-lg leading-relaxed mb-6">
                {t("about.whoAreWeBody")}
              </p>
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 italic font-heading text-primary text-xl text-center">
                {t("about.question")}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: isArabic ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-cream border border-border rounded-[2rem] p-8 md:p-12 shadow-sm"
            >
              <h3 className="font-heading text-3xl text-foreground mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-secondary rounded-full" />
                {t("about.ourStory")}
              </h3>
              <p className="font-body text-muted-foreground text-lg leading-relaxed">
                {t("about.ourStoryBody")}
              </p>
              <p className="font-body text-muted-foreground text-lg leading-relaxed mt-4">
                {t("about.ourStoryBody2")}
              </p>
            </motion.div>
          </div>

          <div className="mb-24">
            <h3 className="font-heading text-3xl text-center text-foreground mb-12">
              {t("about.whatWeDo")}
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {pillars.map((pillar, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border border-border rounded-3xl p-8 hover:shadow-xl transition-all group"
                >
                  <div className={`${pillar.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    <pillar.icon size={28} />
                  </div>
                  <h4 className="font-heading text-xl text-foreground mb-4">{pillar.title}</h4>
                  <p className="font-body text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-primary/100 rounded-[3rem] p-8 md:p-16 text-cream relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full" />
            
            <div className="relative z-10">
              <h3 className="font-heading text-3xl text-center mb-12">
                {t("about.howWeDoIt")}
              </h3>
              <div className="relative mt-8 mb-4">
                {/* Horizontal Line for Desktop */}
                <div className="absolute top-6 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-aqua/20 via-secondary/20 to-lime/20 hidden md:block z-0" />
                
                {/* Vertical Line for Mobile */}
                <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-aqua/20 via-secondary/20 to-lime/20 md:hidden z-0" />

                <div className="grid md:grid-cols-4 gap-12 md:gap-6 relative z-10">
                  {values.map((v, idx) => {
                    const colors = [
                      "text-aqua border-aqua/30 bg-aqua/5 group-hover:bg-aqua/20 group-hover:border-aqua group-hover:text-cream shadow-[0_0_15px_rgba(109,200,203,0.1)] group-hover:shadow-[0_0_20px_rgba(109,200,203,0.3)]",
                      "text-secondary border-secondary/30 bg-secondary/5 group-hover:bg-secondary/20 group-hover:border-secondary group-hover:text-cream shadow-[0_0_15px_rgba(228,110,135,0.1)] group-hover:shadow-[0_0_20px_rgba(228,110,135,0.3)]",
                      "text-lime border-lime/30 bg-lime/5 group-hover:bg-lime/20 group-hover:border-lime group-hover:text-cream shadow-[0_0_15px_rgba(198,214,53,0.1)] group-hover:shadow-[0_0_20px_rgba(198,214,53,0.3)]",
                      "text-aqua border-aqua/30 bg-aqua/5 group-hover:bg-aqua/20 group-hover:border-aqua group-hover:text-cream shadow-[0_0_15px_rgba(109,200,203,0.1)] group-hover:shadow-[0_0_20px_rgba(109,200,203,0.3)]",
                    ];
                    
                    const numberColors = [
                      "bg-aqua/20 text-aqua group-hover:bg-aqua group-hover:text-primary",
                      "bg-secondary/20 text-secondary group-hover:bg-secondary group-hover:text-primary",
                      "bg-lime/20 text-lime group-hover:bg-lime group-hover:text-primary",
                      "bg-aqua/20 text-aqua group-hover:bg-aqua group-hover:text-primary",
                    ];

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.15 }}
                        className="flex flex-row md:flex-col items-start md:items-center text-start md:text-center group cursor-pointer relative"
                      >
                        {/* Node Container */}
                        <div className="flex-shrink-0 relative mr-6 md:mr-0 md:mb-6 z-10">
                          {/* Circle dot with hover ring */}
                          <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center backdrop-blur-md transition-all duration-500 transform group-hover:scale-110 ${colors[idx]}`}>
                            <v.icon size={22} className="transition-transform duration-500 group-hover:rotate-12" />
                          </div>
                          
                          {/* Step number badge */}
                          <span className={`absolute -top-2 -right-2 text-[10px] font-heading font-bold w-5 h-5 rounded-full flex items-center justify-center border border-cream/10 transition-colors duration-500 ${numberColors[idx]}`}>
                            {idx + 1}
                          </span>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 md:px-2 space-y-2">
                          <h4 className="font-heading text-lg md:text-xl text-cream group-hover:text-white transition-colors duration-300">
                            {v.title}
                          </h4>
                          <p className="font-body text-cream/60 text-xs md:text-sm leading-relaxed transition-all duration-300 group-hover:text-cream/95">
                            {v.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-16 pt-16 border-t border-cream/10 text-center">
                <p className="font-heading text-2xl md:text-3xl max-w-2xl mx-auto leading-tight">
                  {t("about.tagline")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
