type DecorativeLandmarkPatternProps = {
  className?: string;
  opacity?: number;
  scale?: number;
  tileSize?: number;
};

const patternItems = [
  { src: "/assets/figma/eiffel.png", x: 248, y: -8 },
  { src: "/assets/figma/statue.png", x: 154, y: 52 },
  { src: "/assets/figma/eiffel.png", x: 76, y: 154 },
  { src: "/assets/figma/petra.png", x: 246, y: 164 },
  { src: "/assets/figma/statue.png", x: 36, y: 258 },
  { src: "/assets/figma/plane.png", x: 158, y: 268 },
  { src: "/assets/figma/eiffel.png", x: -6, y: 360 },
  { src: "/assets/figma/petra.png", x: 112, y: 372 },
  { src: "/assets/figma/colosseum.png", x: 236, y: 382 },
  { src: "/assets/figma/statue.png", x: -48, y: 472 },
  { src: "/assets/figma/plane.png", x: 74, y: 484 },
  { src: "/assets/figma/taj.png", x: 196, y: 494 },
  { src: "/assets/figma/eiffel.png", x: -88, y: 584 },
  { src: "/assets/figma/petra.png", x: 32, y: 596 },
  { src: "/assets/figma/colosseum.png", x: 156, y: 606 },
  { src: "/assets/figma/pyramids.png", x: 280, y: 618 },
];

const DecorativeLandmarkPattern = ({
  className = "",
  opacity = 0.32,
  scale = 1,
  tileSize = 82,
}: DecorativeLandmarkPatternProps) => {
  const multiplier = tileSize / 82;
  const tileRadius = Math.round(tileSize * 0.24);
  const tilePadding = Math.round(tileSize * 0.12);

  return (
    <div
      className={`pointer-events-none absolute overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <div
        className="relative"
        style={{
          width: 380 * scale,
          height: 760 * scale,
          transform: `rotate(24deg) scale(${scale})`,
          transformOrigin: "bottom right",
        }}
      >
        {patternItems.map((item, index) => (
          <div
            key={`${item.src}-${index}`}
            className="absolute bg-white shadow-[0_18px_40px_rgba(0,0,0,0.16)]"
            style={{
              left: item.x * multiplier,
              top: item.y * multiplier,
              width: tileSize,
              height: tileSize,
              borderRadius: tileRadius,
              padding: tilePadding,
            }}
          >
            <img
              src={item.src}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecorativeLandmarkPattern;
