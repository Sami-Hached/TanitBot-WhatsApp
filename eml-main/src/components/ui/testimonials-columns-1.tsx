"use client";

import React from "react";

export type TestimonialItem = {
  index: number;
  text: string;
  image: string;
  name: string;
  role: string;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
  paused?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  onTestimonialClick?: (index: number) => void;
}) => {
  return (
    <div className={props.className}>
      <div
        style={{ animationDuration: `${props.duration || 10}s`, animationPlayState: props.paused ? "paused" : "running" }}
        className="testimonials-marquee flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role, index: testimonialIndex }, i) => (
                <button
                  type="button"
                  onMouseEnter={() => props.onHoverChange?.(true)}
                  onMouseLeave={() => props.onHoverChange?.(false)}
                  onFocus={() => props.onHoverChange?.(true)}
                  onBlur={() => props.onHoverChange?.(false)}
                  onClick={() => props.onTestimonialClick?.(testimonialIndex)}
                  className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full bg-cream text-start transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  key={`${testimonialIndex}-${i}`}
                >
                  <div className="text-foreground/90 font-body leading-relaxed">{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="font-heading text-sm tracking-tight leading-5">{name}</div>
                      <div className="text-sm leading-5 opacity-60 tracking-tight">{role}</div>
                    </div>
                  </div>
                </button>
              ))}
            </React.Fragment>
          )),
        ]}
      </div>
    </div>
  );
};
