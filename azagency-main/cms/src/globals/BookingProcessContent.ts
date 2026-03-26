import type { GlobalConfig, GroupField } from "payload";
import {
  bookingProcessContentDefaults,
  bookingProcessTextBlockDefaults,
} from "../defaults/bookingProcessContent";

function createStepField(
  name: keyof typeof bookingProcessTextBlockDefaults,
  label: string,
): GroupField {
  return {
    name,
    type: "group",
    label,
    defaultValue: bookingProcessTextBlockDefaults[name],
    admin: {
      description:
        "Le numero reste fixe dans le frontend. Seuls le titre et la description sont modifiables.",
      condition: (_, data) => data?.layoutMode === "text",
    },
    fields: [
      {
        name: "title",
        type: "text",
        required: true,
        label: "Titre",
        defaultValue: bookingProcessTextBlockDefaults[name].title,
      },
      {
        name: "description",
        type: "textarea",
        required: true,
        label: "Description",
        defaultValue: bookingProcessTextBlockDefaults[name].description,
      },
    ],
  };
}

export const BookingProcessContent: GlobalConfig = {
  slug: "booking-process-content",
  label: "De la réservation au décollage",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req?.user),
  },
  fields: [
    {
      name: "layoutMode",
      type: "radio",
      label: "Type de contenu",
      required: true,
      defaultValue: "text",
      options: [
        { label: "Blocs texte", value: "text" },
        { label: "Carousel photos", value: "photos" },
      ],
      admin: {
        layout: "horizontal",
        description:
          "Choisissez entre les 3 blocs texte actuels ou un carousel photo sur la partie droite.",
      },
    },
    createStepField("block1", "Block 1"),
    createStepField("block2", "Block 2"),
    createStepField("block3", "Block 3"),
    {
      name: "photoSlides",
      type: "array",
      label: "Photos du carousel",
      defaultValue: [],
      maxRows: 6,
      admin: {
        condition: (_, data) => data?.layoutMode === "photos",
        description:
          "Ajoutez entre 1 et 6 images en format portrait / reel (ratio 9:16) pour le carousel.",
      },
      validate: (value, { siblingData }) => {
        const layoutMode = (siblingData as { layoutMode?: string } | undefined)?.layoutMode;

        if (layoutMode !== "photos") {
          return true;
        }

        if (!Array.isArray(value) || value.length < 1 || value.length > 6) {
          return "Ajoutez entre 1 et 6 photos pour le mode carousel.";
        }

        if (
          (value as Array<{ image?: unknown; imageUrl?: string }>).some(
            (item) => !item?.image && !item?.imageUrl,
          )
        ) {
          return "Chaque slide doit contenir une image uploadée ou une URL d'image.";
        }

        return true;
      },
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
      ],
    },
  ],
};
