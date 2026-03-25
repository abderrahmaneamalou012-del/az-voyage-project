import { AnimatePresence, motion } from "framer-motion";
import { cloneElement, useMemo, useRef, useState, type ReactElement } from "react";
import { cn } from "@/lib/utils";

const BRAND_GOLD = "#C89B2C";

type LensChildProps = {
  src?: string;
  alt?: string;
  className?: string;
};

interface LensProps {
  children: ReactElement<LensChildProps>;
  zoomFactor?: number;
  lensSize?: number;
  isStatic?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function Lens({
  children,
  zoomFactor = 2,
  lensSize = 150,
  isStatic = false,
  ariaLabel = "Zoom Area",
  className,
}: LensProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    active: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const src = children.props.src;
  const alt = children.props.alt ?? "";

  const handlePointerMove = (clientX: number, clientY: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);

    setState({
      active: true,
      x,
      y,
      width: rect.width,
      height: rect.height,
    });
  };

  const lensPosition = useMemo(() => {
    const left = state.x - lensSize / 2;
    const top = state.y - lensSize / 2;

    return {
      left,
      top,
      xPercent: state.width ? (state.x / state.width) * 100 : 50,
      yPercent: state.height ? (state.y / state.height) * 100 : 50,
    };
  }, [lensSize, state.height, state.width, state.x, state.y]);

  const clonedChild = cloneElement(children, {
    className: cn("h-full w-full object-cover", children.props.className),
  });

  return (
    <div
      ref={ref}
      className={cn("relative h-full w-full overflow-hidden cursor-none", className)}
      data-smooth-cursor="lens"
      data-smooth-cursor-size={lensSize}
      onMouseEnter={(e) => handlePointerMove(e.clientX, e.clientY)}
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
      onMouseLeave={() => setState((current) => ({ ...current, active: false }))}
    >
      {clonedChild}

      <AnimatePresence>
        {src && (state.active || isStatic) && (
          <motion.div
            aria-label={ariaLabel}
            className="pointer-events-none absolute z-20 overflow-hidden rounded-full border"
            initial={{ opacity: 0, scale: 0.78, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            transition={{
              opacity: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
              filter: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
              scale: {
                type: "spring",
                stiffness: 220,
                damping: 24,
                mass: 0.55,
              },
            }}
            style={{
              width: lensSize,
              height: lensSize,
              left: isStatic ? "50%" : lensPosition.left,
              top: isStatic ? "50%" : lensPosition.top,
              transform: isStatic ? "translate(-50%, -50%)" : undefined,
              transformOrigin: "center center",
              backdropFilter: "blur(1px)",
              borderColor: `${BRAND_GOLD}CC`,
              boxShadow: `0 18px 50px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(200, 155, 44, 0.18), 0 0 30px rgba(200, 155, 44, 0.28)`,
            }}
          >
            <div
              className="absolute"
              style={{
                width: state.width || "100%",
                height: state.height || "100%",
                left: isStatic ? -(lensSize / 2) : -lensPosition.left,
                top: isStatic ? -(lensSize / 2) : -lensPosition.top,
              }}
            >
              <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover"
                style={{
                  transform: `scale(${zoomFactor})`,
                  transformOrigin: `${lensPosition.xPercent}% ${lensPosition.yPercent}%`,
                }}
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0) 56%, rgba(200,155,44,0.12) 100%)",
              }}
            />
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: 18,
                height: 18,
                transform: "translate(-50%, -50%)",
                border: `1.5px solid ${BRAND_GOLD}`,
                background: "rgba(255, 255, 255, 0.18)",
                boxShadow: "0 0 0 4px rgba(200, 155, 44, 0.14)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
