import { useQuery } from "@tanstack/react-query";
import {
  fetchByField,
  fetchCollection,
  fetchDocument,
  resolveImageUrl,
  resolveGalleryUrls,
} from "../lib/payload";

export interface HotelData {
  id: string;
  name: string;
  description?: string;
  stars?: number;
  dates?: string;
  price?: string;
  priceAmount?: number;
  currency?: string;
  pricePerPerson?: string;
  childPrice?: string;
  childPriceAmount?: number;
  childPriceBrackets?: Array<{
    label: string;
    minAge?: number;
    maxAge?: number;
    priceAmount: number;
    priceLabel?: string;
  }>;
  mainImage?: { url?: string };
  mainImageUrl?: string;
  images?: Array<{ image?: { url?: string }; imageUrl?: string }>;
  rating?: number;
  address?: string;
  city?: string;
  country?: string;
  amenities?: Array<{ item: string }>;
  transferIncluded?: boolean;
  breakfastIncluded?: boolean;
  offers?: Array<string | { id?: string; slug?: string; destination?: string }>;
}

type MediaReference = string | { url?: string } | null | undefined;
type OfferGallerySlot = {
  image?: MediaReference;
  imageUrl?: string;
};

export interface OfferDetailData {
  id: string;
  title: string;
  slug: string;
  destination: string;
  country: string;
  flag?: string;
  region?: string;
  shortDescription?: string;
  description?: any; 
  mainImage?: { url?: string };
  mainImageUrl?: string;
  detailGallery?: {
    main?: OfferGallerySlot;
    side01?: OfferGallerySlot;
    side02?: OfferGallerySlot;
    side03?: OfferGallerySlot;
  };
  galleryImages?: Array<{ image?: { url?: string }; imageUrl?: string }>;
  dates?: string;
  metaDates?: string;
  metaDuration?: string;
  duration?: string;
  durationDays?: number;
  durationNights?: number;
  numberOfDays?: number;
  price: string;
  priceAmount?: number;
  currency?: string;
  childrenPricing?: Array<{ label: string; priceAmount: number }>;
  priceSummary?: string;
  priceCard?: {
    description?: string;
    travellersLabel?: string;
    defaultAdults?: number;
    travellersText?: string;
    detailsTitle?: string;
    totalLabel?: string;
    reserveButtonLabel?: string;
    confirmationText?: string;
  };
  departureLocation?: string;
  location?: string;
  time?: string;
  tag?: string;
  badge?: string;
  badgeVariant?: string;
  status?: string;
  inclusions?: Array<{ item: string; icon?: string }>;
  exclusions?: Array<{ item: string }>;
  program?: Array<{
    dayLabel: string;
    title: string;
    description?: string;
    locations?: Array<{ place: string }>;
    meals?: Array<{ meal: string }>;
    images?: Array<{ image?: { url?: string }; imageUrl?: string }>;
    isLast?: boolean;
  }>;
  hotels?: HotelData[];
}

const hydrateMediaReference = async (
  value?: MediaReference,
): Promise<MediaReference> => {
  if (!value || typeof value !== "string") {
    return value;
  }

  try {
    return await fetchDocument<{ url?: string }>("media", value);
  } catch {
    return value;
  }
};

const hydrateGallerySlot = async (
  slot?: OfferGallerySlot,
): Promise<OfferGallerySlot | undefined> => {
  if (!slot) {
    return slot;
  }

  return {
    ...slot,
    image: await hydrateMediaReference(slot.image),
  };
};

const hydrateOfferDetailGallery = async (
  offer: OfferDetailData | null,
): Promise<OfferDetailData | null> => {
  if (!offer?.detailGallery) {
    return offer;
  }

  const [main, side01, side02, side03] = await Promise.all([
    hydrateGallerySlot(offer.detailGallery.main),
    hydrateGallerySlot(offer.detailGallery.side01),
    hydrateGallerySlot(offer.detailGallery.side02),
    hydrateGallerySlot(offer.detailGallery.side03),
  ]);

  return {
    ...offer,
    detailGallery: {
      main,
      side01,
      side02,
      side03,
    },
  };
};





export function useOffer(slugOrId: string) {
  return useQuery<OfferDetailData | null>({
    queryKey: ["offer", slugOrId],
    queryFn: async () => {
      
      const bySlug = await fetchByField<OfferDetailData>("offers", "slug", slugOrId);
      if (bySlug) return hydrateOfferDetailGallery(bySlug);
      
      const byId = await fetchByField<OfferDetailData>("offers", "id", slugOrId);
      return hydrateOfferDetailGallery(byId);
    },
    enabled: !!slugOrId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: true,
  });
}

const relationIncludesOffer = (
  hotel: HotelData,
  offerId?: string,
  offerSlug?: string,
) =>
  (hotel.offers ?? []).some((entry) => {
    if (typeof entry === "string") {
      return entry === offerId;
    }

    return entry?.id === offerId || entry?.slug === offerSlug;
  });

export function useHotelsForOffer({
  offerId,
  offerSlug,
}: {
  offerId?: string;
  offerSlug?: string;
}) {
  return useQuery<HotelData[]>({
    queryKey: ["offer-hotels", offerId, offerSlug],
    enabled: Boolean(offerId || offerSlug),
    queryFn: async () => {
      const response = await fetchCollection<HotelData>("hotels", {
        limit: 100,
        depth: 1,
        sort: "name",
      });

      const relationMatches = response.docs.filter((hotel) =>
        relationIncludesOffer(hotel, offerId, offerSlug),
      );

      return relationMatches;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: true,
  });
}




export function getOfferGalleryUrls(
  offer: OfferDetailData,
): Array<string | undefined> {
  const explicitSlots = [
    offer.detailGallery?.main,
    offer.detailGallery?.side01,
    offer.detailGallery?.side02,
    offer.detailGallery?.side03,
  ];

  const explicitUrls = explicitSlots
    .map((slot) => resolveImageUrl(slot?.image, slot?.imageUrl))
    .filter(Boolean);

  const fallbackQueue = resolveGalleryUrls(offer.galleryImages).filter(
    (url) => !explicitUrls.includes(url),
  );

  return explicitSlots.map(
    (slot) => resolveImageUrl(slot?.image, slot?.imageUrl) || fallbackQueue.shift(),
  );
}




export function getHotelImageUrls(
  hotel: OfferDetailData["hotels"] extends (infer H)[] ? H : never,
): string[] {
  return resolveGalleryUrls(hotel.images);
}




export function getOfferMainImageUrl(offer: OfferDetailData): string {
  return resolveImageUrl(offer.mainImage, offer.mainImageUrl);
}
