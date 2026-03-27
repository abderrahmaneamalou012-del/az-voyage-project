import { useQuery } from "@tanstack/react-query";
import { fetchCollection, resolveImageUrl } from "../lib/payload";

export interface OfferItem {
  id: string;
  title: string;
  slug?: string;
  destination: string;
  country: string;
  flag?: string; 
  flagMedia?: { url?: string };
  flagUrl?: string;
  region?: string;
  shortDescription?: string;
  mainImage?: { url?: string };
  mainImageUrl?: string;
  dates?: string;
  startDate?: string;
  duration?: string;
  durationDays?: number;
  price: string;
  tag?: string;
  badge?: string;
  badgeVariant?: "info" | "warning" | "danger";
  status?: string;
  inclusions?: Array<{ item: string; icon?: string }>;
  hotels?: Array<string | { id?: string; name?: string }>;
}





export function useOffers(region?: string, opts?: { homepage?: boolean }) {
  return useQuery<OfferItem[]>({
    queryKey: ["offers", region, opts?.homepage ? "homepage" : "all"],
    queryFn: async () => {
      const baseParams: Record<string, string | number> = {
        limit: 100,
        depth: 1,
        sort: "createdAt",
      };

      const params: Record<string, string | number> = { ...baseParams };
      if (region && region !== "Tout") {
        params["where[region][equals]"] = region;
      }
      if (opts?.homepage) {
        params["where[showOnHomepage][equals]"] = "true";
      }

      const res = await fetchCollection<OfferItem>("offers", params);

      
      if (opts?.homepage && res.docs.length === 0) {
        const fallbackParams: Record<string, string | number> = { ...baseParams };
        if (region && region !== "Tout") {
          fallbackParams["where[region][equals]"] = region;
        }

        const fallbackRes = await fetchCollection<OfferItem>("offers", fallbackParams);
        return fallbackRes.docs;
      }

      return res.docs;
    },
  });
}




export function getOfferImageSrc(offer: OfferItem): string {
  return resolveImageUrl(offer.mainImage, offer.mainImageUrl);
}




export function getOfferFlagSrc(offer: OfferItem): string {
  return resolveImageUrl(offer.flagMedia, offer.flagUrl);
}
