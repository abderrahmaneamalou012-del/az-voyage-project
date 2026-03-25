import { useQuery } from "@tanstack/react-query";
import { fetchCollection, fetchGlobal, resolveImageUrl } from "../lib/payload";

export interface FeatureItem {
  id: string;
  text: string;
  image?: { url?: string };
  imageUrl?: string;
  order?: number;
}

export interface BookingStepItem {
  id: string;
  num: string;
  title: string;
  description: string;
  order?: number;
}

export interface BookingProcessBlock {
  title?: string | null;
  description?: string | null;
}

type BookingProcessPhotoMedia =
  | string
  | {
      url?: string;
      alt?: string;
    }
  | null;

export interface BookingProcessPhotoSlide {
  id?: string;
  image?: BookingProcessPhotoMedia;
  imageUrl?: string;
}

export interface BookingProcessContent {
  layoutMode?: "text" | "photos" | null;
  block1?: BookingProcessBlock | null;
  block2?: BookingProcessBlock | null;
  block3?: BookingProcessBlock | null;
  photoSlides?: BookingProcessPhotoSlide[] | null;
}

export function useFeatures() {
  return useQuery<FeatureItem[]>({
    queryKey: ["features"],
    queryFn: async () => {
      const res = await fetchCollection<FeatureItem>("features", {
        limit: 100,
        sort: "order",
      });
      return res.docs;
    },
  });
}

export function useBookingSteps() {
  return useQuery<BookingStepItem[]>({
    queryKey: ["booking-steps"],
    queryFn: async () => {
      const res = await fetchCollection<BookingStepItem>("booking-steps", {
        limit: 100,
        sort: "order",
      });
      return res.docs;
    },
  });
}

export function useBookingProcessContent() {
  return useQuery<BookingProcessContent | null>({
    queryKey: ["booking-process-content"],
    queryFn: async () => {
      try {
        return await fetchGlobal<BookingProcessContent>("booking-process-content", {
          depth: 1,
        });
      } catch (error) {
        console.warn(
          "Booking process CMS global fetch failed, using collection fallback.",
          error,
        );
        return null;
      }
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: true,
  });
}

export function getFeatureImageSrc(feature: FeatureItem): string {
  return resolveImageUrl(feature.image, feature.imageUrl);
}
