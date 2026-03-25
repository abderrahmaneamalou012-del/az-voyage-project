import type { GlobalConfig, GroupField } from "payload";

function createMediaSlotField(
  name: string,
  label: string,
  description?: string,
): GroupField {
  return {
    name,
    type: "group",
    label,
    admin: description
      ? {
          description,
        }
      : undefined,
    fields: [
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
        name: "video",
        type: "upload",
        relationTo: "media",
        label: "Video",
      },
      {
        name: "videoUrl",
        type: "text",
        label: "Video URL (fallback)",
      },
      {
        name: "alt",
        type: "text",
        label: "Texte alternatif",
      },
    ],
  };
}

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Page d'accueil",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "hero",
      type: "group",
      label: "Hero",
      fields: [
        createMediaSlotField("sky", "Fond hero (image ou video)"),
        createMediaSlotField("logo", "Logo"),
        createMediaSlotField("testimonialAvatar", "Avatar témoignage"),
        createMediaSlotField("taj", "Taj Mahal"),
        createMediaSlotField("eiffel", "Tour Eiffel"),
        createMediaSlotField("petra", "Pétra"),
        createMediaSlotField("pyramids", "Pyramides"),
        createMediaSlotField("statue", "Statue of Liberty"),
        createMediaSlotField("colosseum", "Colisée"),
        createMediaSlotField("plane", "Avion"),
      ],
    },
  ],
};
