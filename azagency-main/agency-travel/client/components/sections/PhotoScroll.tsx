import { BlurFade } from "@/components/magicui/blur-fade";
import { Lens } from "@/components/magicui/lens";

export interface PhotoScrollImage {
  src: string;
  alt: string;
}

export interface PhotoScrollProps {
  titleHighlight: string;
  titleHighlightColor?: string;
  titleRest: string;
  images: PhotoScrollImage[];
}

const PhotoScroll = ({
  titleHighlight,
  titleHighlightColor,
  titleRest,
  images,
}: PhotoScrollProps) => {
  return (
    <section className="px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-10 px-6 text-center font-jakarta text-[28px] font-bold tracking-[-1.5px] sm:text-[36px]">
          <span
            style={{
              fontFamily: "'Caveat', cursive",
              color: titleHighlightColor || undefined,
            }}
            className={titleHighlightColor ? "" : "text-gold-100"}
          >
            {titleHighlight}
          </span>
          <br />
          <span className="text-black-100">{titleRest}</span>
        </h2>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

          <div className="flex w-max animate-photo-marquee">
            {[0, 1].map((duplicate) => (
              <div key={duplicate} className="flex shrink-0 gap-4 px-2">
                {images.map((img, index) => (
                  <BlurFade
                    key={`${duplicate}-${index}`}
                    inView
                    delay={0.3 + index * 0.06}
                    duration={1.3}
                    blur={14}
                    yOffset={24}
                    className="h-[300px] w-[240px] flex-shrink-0 overflow-hidden rounded-2xl"
                  >
                    <Lens
                      zoomFactor={1.8}
                      lensSize={140}
                      ariaLabel={`Zoom ${img.alt}`}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                      />
                    </Lens>
                  </BlurFade>
                ))}
              </div>
            ))}
          </div>

          <style>{`
            @keyframes photo-marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-photo-marquee {
              animation: photo-marquee 20s linear infinite;
            }
            .animate-photo-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default PhotoScroll;
