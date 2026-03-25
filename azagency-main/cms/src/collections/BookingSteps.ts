import type { CollectionConfig } from "payload";

export const BookingSteps: CollectionConfig = {
  slug: "booking-steps",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["num", "title", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "num",
      type: "text",
      required: true,
      label: "Numéro",
      admin: { description: 'e.g. "01."' },
    },
    {
      name: "title",
      type: "text",
      required: true,
      label: "Titre",
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: "Description",
    },
    {
      name: "order",
      type: "number",
      label: "Ordre d'affichage",
      admin: { position: "sidebar" },
    },
  ],
};
