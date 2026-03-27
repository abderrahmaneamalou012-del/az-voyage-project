import { useQuery } from "@tanstack/react-query";
import { fetchCollection, resolveImageUrl } from "../lib/payload";

export interface DestinationFilterItem {
  id: string;
  name: string;
  slug?: string;
  description?: string;
}

export function useDestinationFilters() {
  return useQuery<DestinationFilterItem[]>({
    queryKey: ["destination-filters"],
    queryFn: async () => {
      const res = await fetchCollection<DestinationFilterItem>("destination-filters", { limit: 100 });
      return res.docs;
    },
  });
}
