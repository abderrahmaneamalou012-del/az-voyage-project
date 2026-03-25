import type { GlobalConfig, GroupField } from "payload";

function createImageSlotField(
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
        name: "alt",
        type: "text",
        label: "Texte alternatif",
      },
    ],
  };
}

const malaisieFields: GroupField[] = [
  createImageSlotField("block01", "Bloc 1", "Haut gauche"),
  createImageSlotField("block02", "Bloc 2", "Grand bloc central"),
  createImageSlotField("block03", "Bloc 3", "Haut droite"),
  createImageSlotField("block04", "Bloc 4", "Bas gauche"),
  createImageSlotField("block05", "Bloc 5", "Bas droite"),
  createImageSlotField("block06", "Bloc 6", "Grand bloc bas gauche"),
  createImageSlotField("block07", "Bloc 7", "Bas centre haut"),
  createImageSlotField("block08", "Bloc 8", "Grand bloc bas droite"),
  createImageSlotField("block09", "Bloc 9", "Bas centre bas"),
];

const indonesieFields: GroupField[] = [
  createImageSlotField("slide01", "Slide 1"),
  createImageSlotField("slide02", "Slide 2"),
  createImageSlotField("slide03", "Slide 3"),
  createImageSlotField("slide04", "Slide 4"),
  createImageSlotField("slide05", "Slide 5"),
];

const zanzibarFields: GroupField[] = [
  createImageSlotField("block01", "Bloc 1", "Colonne gauche haut"),
  createImageSlotField("block02", "Bloc 2", "Colonne centre haut"),
  createImageSlotField("block03", "Bloc 3", "Colonne droite haut"),
  createImageSlotField("block04", "Bloc 4", "Colonne centre milieu"),
  createImageSlotField("block05", "Bloc 5", "Colonne gauche milieu"),
  createImageSlotField("block06", "Bloc 6", "Colonne droite milieu"),
  createImageSlotField("block07", "Bloc 7", "Colonne centre bas"),
  createImageSlotField("block08", "Bloc 8", "Colonne gauche bas"),
  createImageSlotField("block09", "Bloc 9", "Colonne droite bas"),
];

export const GalleryPage: GlobalConfig = {
  slug: "gallery-page",
  label: "Page galerie",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "hero",
      type: "group",
      label: "Banniere",
      fields: [
        createImageSlotField(
          "background",
          "Image de fond",
          "Image utilisee dans la banniere en haut de la page galerie.",
        ),
      ],
    },
    {
      name: "malaisie",
      type: "group",
      label: "Section Malaisie",
      admin: {
        description: "Chaque bloc correspond a un emplacement visible dans la grille de la section Malaisie.",
      },
      fields: malaisieFields,
    },
    {
      name: "indonesie",
      type: "group",
      label: "Section Indonesie",
      admin: {
        description: "Chaque image correspond a un slide du carousel horizontal.",
      },
      fields: indonesieFields,
    },
    {
      name: "zanzibar",
      type: "group",
      label: "Section Zanzibar",
      admin: {
        description: "Chaque bloc correspond a un emplacement visible dans la grille de la section Zanzibar.",
      },
      fields: zanzibarFields,
    },
  ],
};
