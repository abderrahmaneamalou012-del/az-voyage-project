import type { CollectionConfig } from "payload";

export const DestinationFilters: CollectionConfig = {
  slug: "destination-filters",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug"],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nom du filtre",
      admin: {
        description: "Par exemple: Tanzanie, Maroc, Égypte, etc.",
      },
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
      name: "description",
      type: "textarea",
      label: "Description (optionnel)",
      admin: {
        description: "Description du groupe de destinations",
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        const nameForSlug = data?.name;

        if (data && nameForSlug) {
          data.slug = String(nameForSlug)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }

        return data;
      },
    ],
  },
};
