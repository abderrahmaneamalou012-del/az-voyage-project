import { MapPin, Calendar, Clock, Navigation, MapPinned } from "lucide-react";
import { useParams } from "react-router-dom";
import OfferGallery from "../ui/OfferGallery";
import OfferInclusions from "../ui/OfferInclusions";
import OfferProgram from "../ui/OfferProgram";
import PriceSidebar from "../ui/PriceSidebar";
import HotelCard from "../ui/HotelCard";
import ReservationForm, { type PricingBreakdown } from "../ui/ReservationForm";
import { useState } from "react";
import {
  useOffer,
  useHotelsForOffer,
  getOfferGalleryUrls,
  getHotelImageUrls,
  getOfferMainImageUrl,
  type HotelData,
} from "@/hooks/useOffer";
import { resolveGalleryUrls } from "@/lib/payload";
import { usePageMeta } from "@/hooks/usePageMeta";

type ChildPriceBracket = {
  label: string;
  minAge?: number;
  maxAge?: number;
  priceAmount: number;
  priceLabel?: string;
};

type HotelDisplayData = {
  id?: string;
  name: string;
  images: string[];
  dates: string;
  price: string;
  pricePerPerson: string;
  childPrice?: string;
  childPriceAmount?: number;
  childPriceBrackets?: ChildPriceBracket[];
  priceAmount?: number;
  stars?: number;
  description?: string;
  currency: string;
  transferIncluded?: boolean;
  breakfastIncluded?: boolean;
  amenities?: string[];
  rating?: number;
  address?: string;
};

const mapHotelToDisplayData = (
  hotel: HotelData,
  metaDates: string,
  pricePerAdult: string,
  currency: string,
): HotelDisplayData => ({
  id: hotel.id,
  name: hotel.name,
  description: hotel.description,
  stars: hotel.stars,
  images: getHotelImageUrls(hotel),
  dates: hotel.dates ?? metaDates,
  price: hotel.price ?? pricePerAdult,
  priceAmount: hotel.priceAmount,
  pricePerPerson: hotel.pricePerPerson ?? hotel.price ?? pricePerAdult,
  childPrice: hotel.childPrice ?? hotel.pricePerPerson ?? hotel.price ?? pricePerAdult,
  childPriceAmount: hotel.childPriceAmount ?? hotel.priceAmount,
  childPriceBrackets: hotel.childPriceBrackets,
  currency: hotel.currency ?? currency,
  rating: hotel.rating,
  address: hotel.address,
  amenities: hotel.amenities?.map((a) => a.item),
  transferIncluded: hotel.transferIncluded === true,
  breakfastIncluded: hotel.breakfastIncluded === true,
});

const OfferDetailContent = () => {
  const { id } = useParams<{ id: string }>();
  const { data: offer, isLoading } = useOffer(id ?? "");
  const [pricingState, setPricingState] = useState<PricingBreakdown | null>(null);

  const scrollToReservation = () => {
    document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" });
  };

  usePageMeta({
    title: offer ? `${offer.title} — ${offer.destination}, ${offer.country}` : "Offre introuvable",
    description: offer?.shortDescription?.slice(0, 160) ?? "Cette offre n'est pas disponible.",
  });
  const offerSlug = offer?.slug ?? (id && Number.isNaN(Number(id)) ? id : undefined);

  const {
    data: inferredHotels = [],
  } = useHotelsForOffer({
    offerId: offer?.id ?? id,
    offerSlug,
  });

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-20 text-center text-black-50">
        Chargement…
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-20 text-center">
        <h1 className="font-jakarta font-bold text-[28px] tracking-[-1.2px] text-black-100 mb-3">
          Offre introuvable
        </h1>
        <p className="text-black-50">
          Cette page ne trouve aucune donnée publiée dans le CMS pour cette offre.
        </p>
      </div>
    );
  }

  const title = offer.title;
  const country = offer.country;
  const destination = offer.destination;
  const description = offer.shortDescription ?? "";
  const metaDates = offer.metaDates ?? offer.dates ?? "";
  const metaDuration = offer.metaDuration ?? offer.duration ?? "";
  const departureLocation = offer.departureLocation ?? "";
  const location = offer.location ?? "";
  const time = offer.time ?? "";
  const numberOfDays = offer.numberOfDays ?? offer.durationDays ?? null;
  const priceSummary = offer.priceCard?.description ?? offer.priceSummary ?? "";
  const pricePerAdult = offer.price;
  const priceAmount = offer.priceAmount ?? parseInt(offer.price.replace(/\s/g, ""));
  const currency = offer.currency ?? "DZD";
  const childrenPricing = offer.childrenPricing ?? [];
  const priceCardAdults = Math.max(1, offer.priceCard?.defaultAdults ?? 1);

  const galleryImages = getOfferGalleryUrls(offer).filter(
    (image): image is string => Boolean(image),
  );
  const mainImage = getOfferMainImageUrl(offer);
  const displayGallery = galleryImages.length
    ? galleryImages
    : mainImage
      ? [mainImage]
      : [];

  const inclusionEntries = offer.inclusions?.map((inc) => ({
    label: inc.item,
    icon: inc.icon,
  })) ?? [];
  const exclusionLabels = offer.exclusions?.map((exc) => exc.item) ?? [];

  const programDays = offer.program?.map((p) => ({
    day: p.dayLabel,
    title: p.title,
    description: p.description ?? "",
    locations: p.locations?.map((l) => l.place),
    meals: p.meals?.map((m) => m.meal),
    images: resolveGalleryUrls(p.images),
    isLast: p.isLast,
  })) ?? [];

  const hasLeftContent =
    inclusionEntries.length > 0 || exclusionLabels.length > 0 || programDays.length > 0;

  const directHotels = offer.hotels ?? [];
  const hotels: HotelDisplayData[] = (directHotels.length > 0 ? directHotels : inferredHotels)
    .map((hotel) => mapHotelToDisplayData(hotel, metaDates, pricePerAdult, currency));
  const reservationHotels =
    hotels.length > 0
      ? hotels.map((h) => ({
        id: h.id,
        name: h.name,
        pricePerPerson: h.pricePerPerson,
        priceAmount: h.priceAmount,
        childPrice: h.childPrice,
        childPriceAmount: h.childPriceAmount,
        childPriceBrackets: h.childPriceBrackets?.length ? h.childPriceBrackets : childrenPricing.map(cp => ({
          label: cp.label,
          priceAmount: cp.priceAmount,
        })),
      }))
      : [
        {
          id: offer.id,
          name: "Hôtel à confirmer",
          pricePerPerson: pricePerAdult,
          priceAmount: offer.priceAmount,
          childPrice: pricePerAdult,
          childPriceAmount: offer.priceAmount,
          childPriceBrackets: childrenPricing.map(cp => ({
            label: cp.label,
            priceAmount: cp.priceAmount,
          })),
        },
      ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
      
      <nav className="flex items-center gap-2 text-sm tracking-tight mb-6">
        <a href="/" className="text-black-50 hover:text-black-80 transition-colors">
          Acceuil
        </a>
        <span className="text-black-30">&gt;</span>
        <a href="/listing" className="text-black-50 hover:text-black-80 transition-colors">
          Offres
        </a>
        <span className="text-black-30">&gt;</span>
        <span className="text-gold-100 font-medium">{destination}</span>
      </nav>

      
      <div className="mb-6">
        <h1 className="font-jakarta font-bold text-[28px] sm:text-[36px] tracking-[-1.8px] text-black-100 mb-2">
          {title}
        </h1>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gold-100" />
          <span className="text-black-60 text-sm font-medium tracking-tight">
            {country}
          </span>
        </div>
        {description && (
          <p className="text-black-50 text-[15px] leading-relaxed tracking-tight max-w-[700px] mb-5">
            {description}
          </p>
        )}

        
        {(metaDates || metaDuration || numberOfDays || departureLocation || location || time) && (
          <div className="flex flex-wrap items-center gap-5 text-sm text-black-60 tracking-tight">
            {metaDates && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-black-30" />
                <span>{metaDates}</span>
              </div>
            )}
            {metaDuration && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-black-30" />
                <span>{metaDuration}</span>
              </div>
            )}
            {numberOfDays && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-black-30" />
                <span>{numberOfDays} jour{numberOfDays > 1 ? "s" : ""}</span>
              </div>
            )}
            {departureLocation && (
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-black-30" />
                <span>{departureLocation}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <MapPinned className="w-4 h-4 text-black-30" />
                <span>{location}</span>
              </div>
            )}
            {time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-black-30" />
                <span>{time}</span>
              </div>
            )}
          </div>
        )}
      </div>

      
      {displayGallery.length > 0 && (
        <div className="mb-14">
          <OfferGallery images={displayGallery} alt={destination} />
        </div>
      )}

      
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        <div className="flex-1 min-w-0 w-full">
          
          {hasLeftContent && (
            <div className="mb-16">
              {(inclusionEntries.length > 0 || exclusionLabels.length > 0) && (
                <OfferInclusions entries={inclusionEntries} exclusions={exclusionLabels} />
              )}
              {programDays.length > 0 && (
                <div className={inclusionEntries.length > 0 || exclusionLabels.length > 0 ? "mt-14" : ""}>
                  <OfferProgram days={programDays} />
                </div>
              )}
            </div>
          )}

          
          {hotels.length > 0 && (
            <div className="mb-16">
              <h2 className="font-jakarta font-bold text-[24px] sm:text-[28px] tracking-[-1.2px] mb-8">
                <span className="text-gold-100 italic">Hôtels </span>
                <span className="text-black-100">disponibles</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {hotels.map((hotel, i) => (
                  <HotelCard
                    key={`${hotel.name}-${i}`}
                    name={hotel.name}
                    description={hotel.description}
                    stars={hotel.stars}
                    images={hotel.images}
                    dates={hotel.dates}
                    price={hotel.price}
                    currency={hotel.currency}
                    transferIncluded={hotel.transferIncluded}
                    breakfastIncluded={hotel.breakfastIncluded}
                    amenities={hotel.amenities}
                  />
                ))}
              </div>
            </div>
          )}

          
          <div id="reservation" className="border-t border-separator-90 pt-12">
            {hotels.length === 0 && (
              <p className="text-black-50 text-sm leading-relaxed tracking-tight mb-6 max-w-[620px]">
                Aucun hôtel n'est encore assigné à cette offre dans le CMS. Vous pouvez
                quand même envoyer votre demande, et notre équipe confirmera l'option
                d'hôtel avec vous.
              </p>
            )}
            <ReservationForm
              hotels={reservationHotels}
              currency={currency}
              offerTitle={title}
              offerId={offer?.id ?? id}
              onPricingChange={setPricingState}
            />
          </div>
        </div>

        
        <div className={`w-full lg:w-[340px] flex-shrink-0 ${hasLeftContent || hotels.length > 0 ? "sticky top-8" : ""}`}>
          <PriceSidebar
            summary={priceSummary}
            pricing={pricingState}
            fallbackAdults={priceCardAdults}
            fallbackPriceAmount={priceAmount}
            fallbackPriceLabel={pricePerAdult}
            currency={currency}
            travellersLabel={offer.priceCard?.travellersLabel}
            travellersText={offer.priceCard?.travellersText}
            detailsTitle={offer.priceCard?.detailsTitle}
            totalLabel={offer.priceCard?.totalLabel}
            reserveButtonLabel={offer.priceCard?.reserveButtonLabel}
            confirmationText={offer.priceCard?.confirmationText}
            onReserve={scrollToReservation}
          />
        </div>
      </div>


    </div>
  );
};

export default OfferDetailContent;
