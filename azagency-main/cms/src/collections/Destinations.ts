import type { CollectionConfig } from "payload";

export const Destinations: CollectionConfig = {
  slug: "destinations",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "offers"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Titre",
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: "offers",
      type: "relationship",
      relationTo: "offers",
      hasMany: true,
      label: "Offres associées",
      admin: {
        description:
          "Sélectionnez les offres existantes à afficher quand l'utilisateur ouvre cette destination.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Image (photo)",
      required: true,
    },
    {
      name: "imageUrl",
      type: "text",
      label: "Image URL (fallback)",
      admin: {
        hidden: true,
      },
    },
    {
      name: "href",
      type: "text",
      label: "Lien",
      admin: {
        hidden: true,
      },
    },
    {
      name: "destinationFilter",
      type: "relationship",
      relationTo: "destination-filters",
      label: "Groupe de destination",
      admin: {
        description: "Sélectionnez le groupe de destination auquel cette destination appartient (ex: Tanzanie, Maroc)",
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        const titleForSlug = data?.title;

        if (data && titleForSlug) {
          data.slug = String(titleForSlug)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }

        if (data && data.slug) {
          data.href = `/listing?destination=${encodeURIComponent(String(data.slug))}`;
        }

        return data;
      },
    ],
  },
};
