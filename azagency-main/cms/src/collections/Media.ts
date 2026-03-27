import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true, 
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "externalUrl",
      type: "text",
      label: "URL du media (optionnel)",
      admin: {
        description: "Collez une URL d'image/video si vous ne telechargez pas de fichier.",
      },
    },
    {
      name: "alt",
      type: "text",
      required: false,
      label: "Texte alternatif",
    },
  ],
};
