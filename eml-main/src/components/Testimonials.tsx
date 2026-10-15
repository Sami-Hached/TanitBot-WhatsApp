import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type BaseTestimonial = {
  name: string;
  role: string;
  quote: string;
};

const Testimonials = () => {
  const { t } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const baseTestimonials = t("testimonials.items", { returnObjects: true }) as BaseTestimonial[];
  const testimonials = [
    {
      text: baseTestimonials[0]?.quote ?? "",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80",
      name: baseTestimonials[0]?.name ?? "",
      role: baseTestimonials[0]?.role ?? "",
    },
    {
      text: baseTestimonials[1]?.quote ?? "",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      name: baseTestimonials[1]?.name ?? "",
      role: baseTestimonials[1]?.role ?? "",
    },
    {
      text: baseTestimonials[2]?.quote ?? "",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      name: baseTestimonials[2]?.name ?? "",
      role: baseTestimonials[2]?.role ?? "",
    },
    {
      text: baseTestimonials[0]?.quote ?? "",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      name: baseTestimonials[0]?.name ?? "",
      role: baseTestimonials[0]?.role ?? "",
    },
    {
      text: baseTestimonials[1]?.quote ?? "",
      image:
        "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=200&q=80",
      name: baseTestimonials[1]?.name ?? "",
      role: baseTestimonials[1]?.role ?? "",
    },
    {
      text: baseTestimonials[2]?.quote ?? "",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      name: baseTestimonials[2]?.name ?? "",
      role: baseTestimonials[2]?.role ?? "",
    },
    {
      text: baseTestimonials[0]?.quote ?? "",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      name: baseTestimonials[0]?.name ?? "",
      role: baseTestimonials[0]?.role ?? "",
    },
    {
      text: baseTestimonials[1]?.quote ?? "",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
      name: baseTestimonials[1]?.name ?? "",
      role: baseTestimonials[1]?.role ?? "",
    },
    {
      text: baseTestimonials[2]?.quote ?? "",
      image:
        "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=200&q=80",
      name: baseTestimonials[2]?.name ?? "",
      role: baseTestimonials[2]?.role ?? "",
    },
  ].map((item, index) => ({ ...item, index }));

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);
  const selectedTestimonial = useMemo(
    () => (selectedIndex === null ? null : testimonials[selectedIndex]),
    [selectedIndex, testimonials],
  );

  const showNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % testimonials.length);
  };

  const showPrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="bg-background py-20 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border border-border py-1 px-4 rounded-lg font-heading text-sm text-foreground/90">
              {t("nav.testimonials")}
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-heading tracking-tighter mt-5 text-foreground text-center">
            {t("testimonials.titlePrefix")}{" "}
            <span className="text-secondary">{t("testimonials.titleHighlight")}</span>
          </h2>
          <p className="text-center mt-5 text-muted-foreground font-body">
            {t("testimonials.description")}
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn
            testimonials={firstColumn}
            duration={15}
            paused={isPaused}
            onHoverChange={setIsPaused}
            onTestimonialClick={setSelectedIndex}
          />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
            paused={isPaused}
            onHoverChange={setIsPaused}
            onTestimonialClick={setSelectedIndex}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
            paused={isPaused}
            onHoverChange={setIsPaused}
            onTestimonialClick={setSelectedIndex}
          />
        </div>
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
        <DialogContent className="max-w-xl border-border bg-cream p-0 overflow-hidden sm:rounded-2xl">
          {selectedTestimonial && (
            <div className="p-8 md:p-10">
              <div className="flex items-start justify-between gap-3 mb-6">
                <Quote className="text-secondary shrink-0" size={28} />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="h-10 w-10 rounded-full border border-border bg-background hover:bg-primary/5 inline-flex items-center justify-center transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="h-10 w-10 rounded-full border border-border bg-background hover:bg-primary/5 inline-flex items-center justify-center transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <p className="text-foreground text-lg leading-relaxed font-body">
                "{selectedTestimonial.text}"
              </p>

              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                <img
                  src={selectedTestimonial.image}
                  alt={selectedTestimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-heading text-foreground">{selectedTestimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedTestimonial.role}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Testimonials;
