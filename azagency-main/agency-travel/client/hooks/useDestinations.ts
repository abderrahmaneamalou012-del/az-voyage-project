import { useQuery } from "@tanstack/react-query";
import { fetchCollection, resolveImageUrl } from "../lib/payload";

export interface DestinationItem {
  id: string;
  title?: string;
  description?: string;
  offers?: Array<string | { id?: string; title?: string; slug?: string }>;
  destinationFilter?: string | { id?: string; name?: string; slug?: string };
  
  cardTitle?: string;
  cardDescription?: string;
  name?: string;
  slug?: string;
  image?: { url?: string };
  imageUrl?: string;
  href?: string;
}

export function useDestinations() {
  return useQuery<DestinationItem[]>({
    queryKey: ["destinations"],
    queryFn: async () => {
      const res = await fetchCollection<DestinationItem>("destinations", { limit: 100 });
      return res.docs;
    },
  });
}

export function getDestinationImageSrc(dest: DestinationItem): string {
  return resolveImageUrl(dest.image, dest.imageUrl);
}
