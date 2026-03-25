import { useQuery } from "@tanstack/react-query";
import { fetchGlobal, resolveImageUrl } from "../lib/payload";

interface GalleryMedia {
  alt?: string;
  url?: string;
}

export interface GalleryImageSlot {
  alt?: string;
  image?: GalleryMedia | null;
  imageUrl?: string | null;
}

export interface GalleryPageData {
  hero?: {
    background?: GalleryImageSlot;
  };
  indonesie?: Record<string, GalleryImageSlot | undefined>;
  malaisie?: Record<string, GalleryImageSlot | undefined>;
  zanzibar?: Record<string, GalleryImageSlot | undefined>;
}

export function useGalleryPage() {
  return useQuery<GalleryPageData | null>({
    queryKey: ["gallery-page"],
    queryFn: async () => {
      try {
        return await fetchGlobal<GalleryPageData>("gallery-page", { depth: 2 });
      } catch (error) {
        console.warn("Gallery page CMS fetch failed, using fallback images.", error);
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

export function resolveGalleryImage(
  slot: GalleryImageSlot | undefined,
  fallbackImage: { alt: string; src: string },
) {
  return {
    src: resolveImageUrl(slot?.image, slot?.imageUrl || fallbackImage.src),
    alt: slot?.alt || slot?.image?.alt || fallbackImage.alt,
  };
}

export function resolveGallerySlotImages(
  section: Record<string, GalleryImageSlot | undefined> | undefined,
  slotKeys: string[],
  fallbackImages: Array<{ alt: string; src: string }>,
) {
  return slotKeys.map((slotKey, index) =>
    resolveGalleryImage(section?.[slotKey], fallbackImages[index]),
  );
}
