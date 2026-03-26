import type { CollectionConfig } from "payload";

export const Features: CollectionConfig = {
  slug: "features",
  admin: {
    useAsTitle: "text",
    defaultColumns: ["text", "order"],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req?.user),
    update: ({ req }) => Boolean(req?.user),
    delete: ({ req }) => Boolean(req?.user),
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
