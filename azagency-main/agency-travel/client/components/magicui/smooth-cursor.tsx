import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const BRAND_GOLD = "#C89B2C";
const DEFAULT_SIZE = 26;
const DEFAULT_DOT_SIZE = 8;
const PRESSED_SIZE = 18;

type CursorState =
  | { mode: "default" }
  | { mode: "lens"; size: number }
  | { mode: "text" };

const resolveCursorState = (target: EventTarget | null): CursorState => {
  if (!(target instanceof Element)) {
    return { mode: "default" };
  }

  if (target.closest("input, textarea, select, [contenteditable='true']")) {
    return { mode: "text" };
  }

  const lensTarget = target.closest<HTMLElement>("[data-smooth-cursor='lens']");
  if (lensTarget) {
    const parsedSize = Number(lensTarget.dataset.smoothCursorSize);
    return {
      mode: "lens",
      size: Number.isFinite(parsedSize) ? parsedSize : 150,
    };
  }

  return { mode: "default" };
};

export function SmoothCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>({ mode: "default" });

  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);

  const springConfig = prefersReducedMotion
    ? { stiffness: 1200, damping: 120, mass: 0.2 }
    : { stiffness: 520, damping: 42, mass: 0.18 };

  const x = useSpring(pointerX, springConfig);
  const y = useSpring(pointerY, springConfig);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncEnabled = () => {
      const isEnabled = mediaQuery.matches;
      setEnabled(isEnabled);
      document.documentElement.classList.toggle("has-smooth-cursor", isEnabled);
    };

    syncEnabled();
    mediaQuery.addEventListener("change", syncEnabled);

    return () => {
      document.documentElement.classList.remove("has-smooth-cursor");
      mediaQuery.removeEventListener("change", syncEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      setVisible(true);
      setCursorState(resolveCursorState(event.target));
    };

    const handlePointerDown = () => setPressed(true);
    const handlePointerUp = () => setPressed(false);
    const handleWindowBlur = () => {
      setVisible(false);
      setPressed(false);
    };
    const handleMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        setVisible(false);
        setPressed(false);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [enabled, pointerX, pointerY]);

  if (!enabled) {
    return null;
  }

  const isLens = cursorState.mode === "lens";
  const isText = cursorState.mode === "text";
  const isPressedCircle = pressed && !isLens;
  const outerWidth = isLens ? cursorState.size : isPressedCircle ? PRESSED_SIZE : isText ? 2.5 : DEFAULT_SIZE;
  const outerHeight = isLens ? cursorState.size : isPressedCircle ? PRESSED_SIZE : isText ? 30 : DEFAULT_SIZE;
  const outerOpacity = !visible ? 0 : isLens ? 0 : 1;
  const outerScale = isLens ? 0.98 : isPressedCircle ? 1 : 1;
  const dotOpacity = !visible || isText || isLens || isPressedCircle ? 0 : 1;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200]"
        style={{
          x,
          y,
        }}
        animate={{
          width: outerWidth,
          height: outerHeight,
          opacity: outerOpacity,
          scale: outerScale,
        }}
        transition={{
          type: "spring",
          stiffness: prefersReducedMotion ? 720 : 245,
          damping: prefersReducedMotion ? 80 : 24,
          mass: prefersReducedMotion ? 0.28 : 0.5,
        }}
      >
        <div
          className="h-full w-full -translate-x-1/2 -translate-y-1/2"
          style={{
            borderRadius: 9999,
            border: isPressedCircle || isText ? "none" : `${isLens ? 2 : 1.5}px solid ${BRAND_GOLD}`,
            background: isPressedCircle
              ? BRAND_GOLD
              : isText
              ? BRAND_GOLD
              : isLens
              ? "rgba(200, 155, 44, 0.06)"
              : "rgba(255, 255, 255, 0.04)",
            boxShadow:
              isPressedCircle
                ? "0 0 24px rgba(200, 155, 44, 0.55)"
                : isText
                ? "0 0 16px rgba(200, 155, 44, 0.45)"
                : isLens
                ? "0 0 0 1px rgba(200, 155, 44, 0.18), 0 16px 42px rgba(200, 155, 44, 0.22)"
                : "0 0 0 1px rgba(200, 155, 44, 0.12), 0 10px 30px rgba(200, 155, 44, 0.16)",
            backdropFilter: isPressedCircle || isText ? undefined : "blur(2px)",
          }}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[201] rounded-full"
        style={{
          x,
          y,
        }}
        animate={{
          width: DEFAULT_DOT_SIZE,
          height: DEFAULT_DOT_SIZE,
          opacity: dotOpacity,
          scale: pressed ? 0.75 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: prefersReducedMotion ? 900 : 450,
          damping: prefersReducedMotion ? 100 : 35,
          mass: 0.2,
        }}
      >
        <div
          className="h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: BRAND_GOLD,
            boxShadow: "0 0 18px rgba(200, 155, 44, 0.6)",
          }}
        />
      </motion.div>
    </>
  );
}
