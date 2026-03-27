import { useQuery } from "@tanstack/react-query";
import { fetchCollection } from "../lib/payload";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order?: number;
}

export function useFAQs() {
  return useQuery<FAQItem[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await fetchCollection<FAQItem>("faqs", {
        limit: 100,
        sort: "order",
      });
      return res.docs;
    },
  });
}
