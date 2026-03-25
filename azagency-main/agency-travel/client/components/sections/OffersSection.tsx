import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OfferCard from "../ui/OfferCard";
import { useOffers, getOfferImageSrc, getOfferFlagSrc } from "@/hooks/useOffers";
import { BlurFade } from "@/components/magicui/blur-fade";

const OffersSection = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { data: cmsOffers, isLoading } = useOffers(undefined, { homepage: true });

  
  const offers = (cmsOffers ?? []).map((o) => ({
    src: getOfferImageSrc(o),
    name: o.title,
    flag: o.flag ?? "",
    flagSrc: getOfferFlagSrc(o),
    dates: o.dates ?? "",
    duration: o.duration ?? "",
    price: o.price,
    tag: o.tag,
    slug: o.slug,
  }));

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 360;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="offres" className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
        <h2 className="font-jakarta font-bold text-[36px] sm:text-[40px] tracking-[-2px]">
          <span className="text-gold-100">Offres </span>
          <span className="text-black-100">du moment</span>
        </h2>
        <p className="text-black-50 text-lg sm:text-xl leading-[30px] tracking-tight max-w-[620px] lg:text-right">
          Des offres prêtes à partir, avec des détails clairs et un accompagnement jusqu'au départ.
        </p>
      </div>

      <div className="relative">
        <div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory no-scrollbar"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[320px] sm:w-[333px] snap-start animate-pulse"
                >
                  <div className="bg-gray-200 rounded-2xl h-[420px]" />
                </div>
              ))
            : offers.map((offer, index) => (
                <BlurFade
                  key={offer.name}
                  className="flex-shrink-0 w-[320px] sm:w-[333px] snap-start"
                  delay={0.14 + index * 0.08}
                  duration={0.95}
                  inView
                >
                  <OfferCard {...offer} href={offer.slug ? `/offer/${offer.slug}` : undefined} />
                </BlurFade>
              ))}
        </div>

        
        
      </div>
    </section>
  );
};

export default OffersSection;
