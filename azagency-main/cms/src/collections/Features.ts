import type { CollectionConfig } from "payload";

export const Features: CollectionConfig = {
  slug: "features",
  admin: {
    useAsTitle: "text",
    defaultColumns: ["text", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "text",
      type: "text",
      required: true,
      label: "Texte",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Image",
    },
    {
      name: "imageUrl",
      type: "text",
      label: "Image URL (fallback)",
    },
    {
      name: "order",
      type: "number",
      label: "Ordre d'affichage",
      admin: { position: "sidebar" },
    },
  ],
};
