import { useEffect } from "react";

const SITE_NAME = "AZ Voyage";

interface PageMetaOptions {
  title: string;
  description?: string;
  
  appendSiteName?: boolean;
}





export function usePageMeta({ title, description, appendSiteName = true }: PageMetaOptions) {
  useEffect(() => {
    const prevTitle = document.title;

    document.title = appendSiteName ? `${title} | ${SITE_NAME}` : title;

    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = metaDesc?.content;
    if (description) {
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc !== undefined) {
        metaDesc.content = prevDesc;
      }
    };
  }, [title, description, appendSiteName]);
}
