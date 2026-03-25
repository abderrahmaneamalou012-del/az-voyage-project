import { useQuery } from "@tanstack/react-query";
import { fetchCollection } from "../lib/payload";

export interface TestimonialItem {
  id: string;
  text: string;
  author: string;
  date: string;
  rating: number;
  type: "text" | "video";
  video?: string | { url?: string };
  videoUrl?: string;
  videoImage?: { url?: string };
  videoImageUrl?: string;
  videoQuote?: string;
  order?: number;
}

export function useTestimonials() {
  return useQuery<TestimonialItem[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const res = await fetchCollection<TestimonialItem>("testimonials", {
        limit: 100,
        sort: "order",
      });
      return res.docs;
    },
  });
}
