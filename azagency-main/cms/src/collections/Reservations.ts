import type { CollectionConfig } from "payload";

export const Reservations: CollectionConfig = {
  slug: "reservations",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "offerTitle", "hotel", "selectedHotel", "adults", "children", "createdAt"],
    description: "Demandes de réservation envoyées par les clients.",
  },
  access: {
    read: ({ req }) => Boolean(req?.user),
    create: () => true,
    update: ({ req }) => Boolean(req?.user),
    delete: ({ req }) => Boolean(req?.user),
  },
  fields: [
    {
      name: "fullName",
      type: "text",
      required: true,
      label: "Nom & Prénom",
    },
    {
      name: "phone",
      type: "text",
      required: true,
      label: "Téléphone",
    },
    {
      name: "offerTitle",
      type: "text",
      label: "Offre",
      admin: { description: "Titre de l'offre concernée." },
    },
    {
      name: "offerId",
      type: "text",
      label: "Offer ID",
      admin: { position: "sidebar" },
    },
    {
      name: "selectedHotel",
      type: "text",
      required: true,
      label: "Hôtel sélectionné",
      admin: {
        description: "Nom affiché de l'hôtel sélectionné.",
      },
    },
    {
      name: "hotel",
      type: "relationship",
      relationTo: "hotels",
      label: "Hôtel lié",
      admin: {
        description: "Relation vers la fiche hôtel complète.",
      },
    },
    {
      name: "adults",
      type: "number",
      required: true,
      label: "Adultes",
      min: 1,
      defaultValue: 1,
    },
    {
      name: "children",
      type: "number",
      label: "Enfants",
      min: 0,
      defaultValue: 0,
    },
    {
      name: "totalEstimated",
      type: "text",
      label: "Total estimé",
      admin: { description: "Montant total estimé affiché au client." },
    },
    {
      name: "currency",
      type: "text",
      label: "Devise",
      defaultValue: "DZD",
    },
    {
      name: "childDetails",
      type: "text",
      label: "Détails enfants",
      admin: {
        description: "Détails des tranches d'âge sélectionnées pour chaque enfant (JSON).",
      },
    },
    {
      name: "status",
      type: "select",
      label: "Statut",
      defaultValue: "new",
      options: [
        { label: "Nouvelle", value: "new" },
        { label: "En cours", value: "in-progress" },
        { label: "Confirmée", value: "confirmed" },
        { label: "Annulée", value: "cancelled" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
