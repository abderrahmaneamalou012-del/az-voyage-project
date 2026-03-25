import type { ReactNode } from "react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Lens } from "@/components/magicui/lens";

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GridItem {
  col: string;
  row: string;
}

export interface SubGrid {
  columns: string;
  rows: string;
  items: GridItem[];
}

export interface PhotoGalleryProps {
  division: SubGrid[];
  images: GalleryImage[];
  children?: ReactNode;
}

const FALLBACK_IMAGE: GalleryImage = {
  src: "/assets/figma/logo.png",
  alt: "Galerie",
};

const PhotoGallery = ({ division, images, children }: PhotoGalleryProps) => {
  const safeImages = images.length > 0 ? images : [FALLBACK_IMAGE];
  let imgIndex = 0;

  return (
    <section className="px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1200px]">
        {children && <div className="mb-10 text-center">{children}</div>}

        <div className="flex w-full flex-col gap-3">
          {division.map((subGrid, groupIndex) => (
            <div
              key={groupIndex}
              className="grid w-full gap-3"
              style={{
                gridTemplateColumns: subGrid.columns,
                gridTemplateRows: subGrid.rows,
              }}
            >
              {subGrid.items.map((item, itemIndex) => {
                const img = safeImages[imgIndex % safeImages.length];
                const currentIndex = imgIndex;
                imgIndex += 1;

                return (
                  <BlurFade
                    key={`${groupIndex}-${itemIndex}`}
                    inView
                    delay={0.28 + currentIndex * 0.07}
                    duration={1.35}
                    blur={14}
                    yOffset={26}
                    className="overflow-hidden rounded-2xl"
                    style={{ gridColumn: item.col, gridRow: item.row }}
                  >
                    <Lens
                      zoomFactor={1.85}
                      lensSize={150}
                      ariaLabel={`Zoom ${img.alt}`}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                      />
                    </Lens>
                  </BlurFade>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
