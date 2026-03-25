import { useEffect, useMemo, useState } from "react";
import { Images } from "lucide-react";

export interface OfferGalleryProps {
  images: string[];
  alt?: string;
}

const OfferGallery = ({ images, alt = "" }: OfferGalleryProps) => {
  const cleanedImages = useMemo(
    () => images.filter(Boolean),
    [images],
  );
  const mainImage = cleanedImages[0];
  const sideImages = cleanedImages.slice(1, 4);
  const totalPhotos = cleanedImages.length;
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!mainImage) {
    return null;
  }

  const openAt = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + totalPhotos) % totalPhotos);
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % totalPhotos);
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
      if (event.key === "ArrowLeft") {
        goPrev();
      }
      if (event.key === "ArrowRight") {
        goNext();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 rounded-2xl">
        
        <div className="relative h-[300px] sm:h-[400px] lg:h-[440px] overflow-hidden rounded-2xl">
          <img
            src={mainImage}
            alt={alt}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => openAt(0)}
            className="absolute z-20 bottom-4 left-4 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-black-100 text-sm font-medium tracking-tight px-4 py-2.5 rounded-full hover:bg-white transition-colors shadow-md pointer-events-auto"
          >
            <Images className="w-4 h-4" />
            Voir toutes les photos ({totalPhotos})
          </button>
        </div>

        
        <div className="hidden lg:grid lg:grid-rows-3 gap-3 h-[440px]">
          {sideImages.map((src, i) => (
            <button
              key={i}
              type="button"
              className="h-full overflow-hidden rounded-2xl text-left"
              onClick={() => openAt(i + 1)}
            >
              <img
                src={src}
                alt={`${alt} ${i + 2}`}
                className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
              />
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-screen h-[100dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={cleanedImages[activeIndex]}
              alt={`${alt} ${activeIndex + 1}`}
              className="w-full h-full object-contain"
            />

            <button
              type="button"
              className="absolute top-3 right-3 bg-white/90 text-black-100 rounded-full px-3 py-1.5 text-sm"
              onClick={() => setIsOpen(false)}
            >
              Fermer
            </button>

            {totalPhotos > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 text-black-100 rounded-full px-2.5 sm:px-3 py-2 text-xs sm:text-sm"
                  onClick={goPrev}
                >
                  Précédent
                </button>
                <button
                  type="button"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 text-black-100 rounded-full px-2.5 sm:px-3 py-2 text-xs sm:text-sm"
                  onClick={goNext}
                >
                  Suivant
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-auto bg-black/45 backdrop-blur-sm rounded-xl px-2 py-2 flex flex-nowrap gap-2 justify-start overflow-x-auto">
              {cleanedImages.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  className={`h-14 w-20 shrink-0 overflow-hidden rounded border ${
                    index === activeIndex ? "border-gold-100" : "border-white/30"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <img
                    src={src}
                    alt={`${alt} miniature ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OfferGallery;
