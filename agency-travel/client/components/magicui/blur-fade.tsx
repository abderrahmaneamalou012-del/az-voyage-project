import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  blur?: number;
  yOffset?: number;
  inView?: boolean;
  once?: boolean;
}

export function BlurFade({
  children,
  className,
  style,
  delay = 0,
  duration = 0.9,
  blur = 10,
  yOffset = 18,
  inView = false,
  once = true,
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const shouldShow = inView ? isInView : true;

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: prefersReducedMotion ? 0 : yOffset,
        filter: prefersReducedMotion ? "blur(0px)" : `blur(${blur}px)`,
      }}
      animate={{
        opacity: shouldShow ? 1 : 0,
        y: shouldShow || prefersReducedMotion ? 0 : yOffset,
        filter: shouldShow || prefersReducedMotion ? "blur(0px)" : `blur(${blur}px)`,
      }}
      transition={{
        delay,
        duration: prefersReducedMotion ? 0.01 : duration,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={style}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
