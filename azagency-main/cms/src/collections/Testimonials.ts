import type { CollectionConfig } from "payload";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "author",
    defaultColumns: ["author", "date", "rating", "type"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "text",
      type: "textarea",
      required: true,
      label: "Texte",
    },
    {
      name: "author",
      type: "text",
      required: true,
      label: "Auteur",
    },
    {
      name: "date",
      type: "text",
      label: "Date affichée",
      admin: { description: 'e.g. "Septembre 2025"' },
    },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
      label: "Note",
    },
    {
      name: "type",
      type: "select",
      defaultValue: "text",
      label: "Type",
      options: [
        { label: "Texte", value: "text" },
        { label: "Vidéo", value: "video" },
      ],
    },
    {
      name: "videoImage",
      type: "upload",
      relationTo: "media",
      label: "Image vidéo",
      admin: {
        condition: (_, siblingData) => siblingData?.type === "video",
      },
    },
    {
      name: "video",
      type: "upload",
      relationTo: "media",
      label: "Fichier vidéo",
      admin: {
        condition: (_, siblingData) => siblingData?.type === "video",
      },
    },
    {
      name: "videoUrl",
      type: "text",
      label: "Video URL (fallback)",
      admin: {
        condition: (_, siblingData) => siblingData?.type === "video",
      },
    },
    {
      name: "videoImageUrl",
      type: "text",
      label: "Video image URL (fallback)",
    },
    {
      name: "videoQuote",
      type: "textarea",
      label: "Citation vidéo",
      admin: {
        condition: (_, siblingData) => siblingData?.type === "video",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Ordre d'affichage",
      admin: { position: "sidebar" },
    },
  ],
};
