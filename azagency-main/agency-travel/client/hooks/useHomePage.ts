import { useQuery } from "@tanstack/react-query";
import { fetchGlobal, resolveImageUrl } from "../lib/payload";

interface HomeMedia {
  alt?: string;
  url?: string;
}

export interface HomePageMediaSlot {
  alt?: string;
  image?: HomeMedia | null;
  imageUrl?: string | null;
  video?: HomeMedia | null;
  videoUrl?: string | null;
}

export interface HomePageData {
  hero?: {
    sky?: HomePageMediaSlot;
    logo?: HomePageMediaSlot;
    testimonialAvatar?: HomePageMediaSlot;
    taj?: HomePageMediaSlot;
    eiffel?: HomePageMediaSlot;
    petra?: HomePageMediaSlot;
    pyramids?: HomePageMediaSlot;
    statue?: HomePageMediaSlot;
    colosseum?: HomePageMediaSlot;
    plane?: HomePageMediaSlot;
  };
}

export function useHomePage() {
  return useQuery<HomePageData | null>({
    queryKey: ["home-page"],
    queryFn: async () => {
      try {
        return await fetchGlobal<HomePageData>("home-page", { depth: 2 });
      } catch (error) {
        console.warn("Home page CMS fetch failed, using fallback media.", error);
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

export function resolveHomePageMedia(
  slot: HomePageMediaSlot | undefined,
  fallbackMedia: { src: string; alt: string; isVideo?: boolean },
) {
  const videoSrc = resolveImageUrl(slot?.video, slot?.videoUrl || "");
  const imageSrc = resolveImageUrl(slot?.image, slot?.imageUrl || fallbackMedia.src);

  if (videoSrc) {
    return {
      src: videoSrc,
      alt: slot?.alt || fallbackMedia.alt,
      isVideo: true,
    };
  }

  return {
    src: imageSrc,
    alt: slot?.alt || slot?.image?.alt || fallbackMedia.alt,
    isVideo: Boolean(fallbackMedia.isVideo),
  };
}
