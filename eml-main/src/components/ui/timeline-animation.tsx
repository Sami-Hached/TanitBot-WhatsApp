"use client";

import { HTMLMotionProps, motion, useInView } from "motion/react";
import { useRef } from "react";

type VariantDef = {
  visible: (i: number) => Record<string, unknown>;
  hidden: Record<string, unknown>;
};

type TimelineContentProps<T extends keyof JSX.IntrinsicElements> = {
  as?: T;
  animationNum: number;
  timelineRef?: React.RefObject<Element>;
  customVariants: VariantDef;
  className?: string;
  children: React.ReactNode;
} & Omit<HTMLMotionProps<T>, "children" | "className">;

export function TimelineContent<T extends keyof JSX.IntrinsicElements = "div">({
  as,
  animationNum,
  timelineRef,
  customVariants,
  className,
  children,
  ...props
}: TimelineContentProps<T>) {
  const localRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(timelineRef ?? localRef, { once: true, amount: 0.2 });
  const MotionTag = motion(as ?? "div");

  return (
    <MotionTag
      ref={localRef as never}
      custom={animationNum}
      variants={customVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
      {...(props as object)}
    >
      {children}
    </MotionTag>
  );
}
