"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import { Zap } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export default function AboutSection2() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.18,
        duration: 0.7,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: 40,
      opacity: 0,
    },
  };

  const textVariants = {
    visible: (i: number) => ({
      filter: "blur(0px)",
      opacity: 1,
      transition: {
        delay: i * 0.16,
        duration: 0.6,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
    },
  };

  return (
    <section className="py-24 px-4 bg-primary/5">
      <div className="max-w-6xl mx-auto" ref={heroRef}>
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-1">
            <TimelineContent
              as="h2"
              animationNum={0}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className="sm:text-4xl text-2xl md:text-5xl !leading-[120%] font-heading text-foreground mb-8"
            >
              {t("aboutAnimated.prefix")}{" "}
              <TimelineContent
                as="span"
                animationNum={1}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-primary border-2 border-primary inline-block border-dotted px-2 rounded-md"
              >
                {t("aboutAnimated.highlightOne")}
              </TimelineContent>{" "}
              {t("aboutAnimated.middle")}{" "}
              <TimelineContent
                as="span"
                animationNum={2}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-secondary border-2 border-secondary inline-block border-dotted px-2 rounded-md"
              >
                {t("aboutAnimated.highlightTwo")}
              </TimelineContent>{" "}
              {t("aboutAnimated.almostEnd")}{" "}
              <TimelineContent
                as="span"
                animationNum={3}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-lime border-2 border-lime inline-block border-dotted px-2 rounded-md"
              >
                {t("aboutAnimated.highlightThree")}
              </TimelineContent>
            </TimelineContent>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-start">
              <TimelineContent
                as="a"
                href="#about-details"
                animationNum={5}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="bg-primary gap-2 font-heading shadow-lg shadow-primary/30 text-primary-foreground h-12 px-5 rounded-full text-sm inline-flex items-center cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Zap fill="currentColor" size={16} />
                {t("aboutAnimated.button")}
              </TimelineContent>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
