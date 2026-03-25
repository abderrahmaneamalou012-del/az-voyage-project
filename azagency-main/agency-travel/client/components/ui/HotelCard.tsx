import { useState } from "react";
import { Images, Calendar, Bus, Coffee, ChevronLeft, ChevronRight, Star } from "lucide-react";

export interface HotelCardProps {
  name: string;
  description?: string;
  stars?: number;
  images: string[];
  dates: string;
  price: string;
  currency?: string;
  transferIncluded?: boolean;
  breakfastIncluded?: boolean;
  amenities?: string[];
}

const HotelCard = ({
  name,
  description,
  stars,
  images,
  dates,
  price,
  currency = "DZD",
  transferIncluded = true,
  breakfastIncluded,
  amenities,
}: HotelCardProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbs = images.slice(0, 5);

  const prev = () =>
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full max-w-[320px]">
      
      <div className="relative rounded-2xl overflow-hidden h-[220px] group">
        <img
          src={images[activeIndex]}
          alt={name}
          className="w-full h-full object-cover"
        />

        
        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
          <Images className="w-3.5 h-3.5" />
          {images.length} photos
        </span>

        
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4 text-black-80" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="w-4 h-4 text-black-80" />
            </button>
          </>
        )}

        
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === activeIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      
      <div className="flex gap-2 mt-2">
        {thumbs.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
              i === activeIndex ? "border-gold-100" : "border-transparent"
            }`}
          >
            <img
              src={src}
              alt={`${name} ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      
      <div className="mt-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-jakarta font-semibold text-base tracking-tight text-black-100">
              {name}
            </h3>
            {stars && (
              <div className="flex items-center gap-0.5 mt-0.5">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-gold-100 fill-gold-100" />
                ))}
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <span className="font-jakarta font-bold text-lg tracking-tight text-black-100">
              {price}{" "}
            </span>
            <span className="text-gold-100 font-semibold text-sm">{currency}</span>
          </div>
        </div>
        {description && (
          <p className="text-black-50 text-xs leading-relaxed tracking-tight mt-1.5 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1.5">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-black-30" />
            <span className="text-black-50 text-xs tracking-tight">{dates}</span>
          </div>
          <span className="text-xs text-black-30">/ personne</span>
        </div>
        {transferIncluded && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <Bus className="w-3.5 h-3.5 text-gold-100" />
            <span className="text-black-60 text-xs tracking-tight">Transfert inclus</span>
          </div>
        )}
        {breakfastIncluded && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <Coffee className="w-3.5 h-3.5 text-gold-100" />
            <span className="text-black-60 text-xs tracking-tight">Petit-déjeuner inclus</span>
          </div>
        )}
        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {amenities.slice(0, 4).map((item, i) => (
              <span
                key={i}
                className="text-[11px] bg-navy-10/60 text-black-60 px-2 py-0.5 rounded-full tracking-tight"
              >
                {item}
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="text-[11px] text-black-40 px-1 tracking-tight">
                +{amenities.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelCard;
