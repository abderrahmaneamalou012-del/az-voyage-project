import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
} from "payload";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const normalizeRelationIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (typeof entry === "string" || typeof entry === "number") {
        return String(entry);
      }

      if (entry && typeof entry === "object" && "id" in entry) {
        const id = (entry as { id?: string | number | null }).id;
        return id == null ? null : String(id);
      }

      return null;
    })
    .filter((id): id is string => Boolean(id));
};

const createOfferGallerySlot = (name: string, label: string) => ({
  name,
  type: "group" as const,
  label,
  fields: [
    {
      name: "image",
      type: "upload" as const,
      relationTo: "media" as const,
      label: "Image",
    },
    {
      name: "imageUrl",
      type: "text" as const,
      label: "Image URL (fallback)",
    },
  ],
});

const inclusionIconOptions = [
  { label: "Check", value: "check" },
  { label: "Avion", value: "plane" },
  { label: "Hôtel", value: "hotel" },
  { label: "Transfert", value: "transfer" },
  { label: "Assistance", value: "assistance" },
  { label: "Repas", value: "meal" },
  { label: "Lieu", value: "map" },
  { label: "Calendrier", value: "calendar" },
];

const syncOfferOnHotels = async (
  req: Parameters<CollectionAfterChangeHook>[0]["req"],
  offerId: string,
  nextHotelIds: string[],
  previousHotelIds: string[],
) => {
  const affectedHotelIds = Array.from(new Set([...nextHotelIds, ...previousHotelIds]));

  for (const hotelId of affectedHotelIds) {
    const hotelResult = await req.payload.find({
      collection: "hotels",
      limit: 1,
      pagination: false,
      req,
      where: {
        id: {
          equals: hotelId,
        },
      },
    });

    const hotel = hotelResult.docs[0] as { offers?: unknown } | undefined;

    if (!hotel) {
      continue;
    }

    const currentOfferIds = normalizeRelationIds(hotel.offers);
    const shouldIncludeOffer = nextHotelIds.includes(hotelId);
    const nextOfferIds = shouldIncludeOffer
      ? Array.from(new Set([...currentOfferIds, offerId]))
      : currentOfferIds.filter((id) => id !== offerId);

    const isUnchanged =
      currentOfferIds.length === nextOfferIds.length &&
      currentOfferIds.every((id, index) => id === nextOfferIds[index]);

    if (isUnchanged) {
      continue;
    }

    await req.payload.update({
      collection: "hotels",
      data: {
        offers: nextOfferIds,
      },
      id: hotelId,
      req,
    });
  }
};

const syncHotelsAfterOfferChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  await syncOfferOnHotels(
    req,
    String(doc.id),
    normalizeRelationIds((doc as { hotels?: unknown }).hotels),
    normalizeRelationIds((previousDoc as { hotels?: unknown }).hotels),
  );

  return doc;
};

const removeOfferFromHotelsAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  const offerId = String(doc.id);
  const linkedHotelIds = normalizeRelationIds((doc as { hotels?: unknown }).hotels);

  await syncOfferOnHotels(req, offerId, [], linkedHotelIds);

  return doc;
};

export const Offers: CollectionConfig = {
  slug: "offers",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "destination", "country", "price", "status"],
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
        position: "sidebar",
        description: "Auto-generated from title if left blank",
      },
    },
    {
      name: "destination",
      type: "text",
      required: true,
      label: "Destination",
    },
    {
      name: "country",
      type: "text",
      required: true,
      label: "Pays",
    },
    {
      name: "flag",
      type: "text",
      label: "Emoji drapeau (Obsolète)",
      admin: { description: "Ancien champ emoji. Utilisez plutôt 'Image du drapeau' ci-dessous." },
    },
    {
      name: "flagMedia",
      type: "upload",
      relationTo: "media",
      label: "Image du drapeau",
    },
    {
      name: "flagUrl",
      type: "text",
      label: "URL du drapeau (fallback)",
      admin: { description: "URL de l'image si vous n'uploadez pas de fichier" },
    },
    {
      name: "region",
      type: "text",
      label: "Région",
      admin: {
        description:
          "Filtre parent sur la page listing. Valeur libre (ex: Europe, Asie, Moyen-Orient).",
      },
    },

    
    {
      name: "shortDescription",
      type: "textarea",
      label: "Description courte",
    },
    {
      name: "description",
      type: "richText",
      label: "Description complète",
    },

    
    {
      name: "mainImage",
      type: "upload",
      relationTo: "media",
      label: "Image principale",
    },
    {
      name: "mainImageUrl",
      type: "text",
      label: "Image URL (fallback)",
      admin: { description: "Used when no uploaded image is available" },
    },
    {
      name: "detailGallery",
      type: "group",
      label: "Galerie detail de l'offre (4 images)",
      admin: {
        description:
          "Les 4 images affichees sur la page detail de l'offre : 1 grande image + 3 images laterales.",
      },
      fields: [
        createOfferGallerySlot("main", "Image principale"),
        createOfferGallerySlot("side01", "Image laterale 1"),
        createOfferGallerySlot("side02", "Image laterale 2"),
        createOfferGallerySlot("side03", "Image laterale 3"),
      ],
    },
    {
      name: "galleryImages",
      type: "array",
      label: "Galerie photos (fallback)",
      admin: {
        description:
          "Utilisee seulement en fallback si la galerie detail ci-dessus n'est pas remplie.",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "imageUrl",
          type: "text",
          label: "Image URL (fallback)",
        },
      ],
    },

    
    {
      name: "dates",
      type: "text",
      label: "Dates affichées",
      admin: { description: 'e.g. "18-25 janvier"' },
    },
    {
      name: "startDate",
      type: "date",
      label: "Date de début",
    },
    {
      name: "endDate",
      type: "date",
      label: "Date de fin",
    },
    {
      name: "durationDays",
      type: "number",
      label: "Durée (jours)",
    },
    {
      name: "durationNights",
      type: "number",
      label: "Durée (nuits)",
    },
    {
      name: "duration",
      type: "text",
      label: "Durée affichée",
      admin: { description: 'e.g. "7 Jours"' },
    },

    
    {
      name: "price",
      type: "text",
      required: true,
      label: "Prix par adulte (Affiché)",
      admin: { description: 'e.g. "84 000"' },
    },
    {
      name: "priceAmount",
      type: "number",
      label: "Prix par adulte (Numérique)",
    },
    {
      name: "currency",
      type: "text",
      defaultValue: "DZD",
      label: "Devise",
    },
    {
      name: "childrenPricing",
      type: "array",
      label: "Tarification enfants (par tranche d'âge)",
      admin: {
        description: "Définissez les différentes tranches d'âge et leurs tarifs respectifs. Ex: '5 ans — 11 ans — 60 000 DA'",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Label de la tranche d'âge",
          admin: { description: "Ex: '5 ans — 11 ans — 60 000 DA'" },
        },
        {
          name: "priceAmount",
          type: "number",
          required: true,
          label: "Prix (numérique)",
          admin: { description: "Ex: 60000" },
        },
      ],
    },

    
    {
      name: "tag",
      type: "text",
      label: "Tag",
      admin: { description: 'e.g. "Coup de coeur", "Nouveau"' },
    },
    {
      name: "badge",
      type: "text",
      label: "Badge",
      admin: { description: 'e.g. "Bientôt complet", "Sold out"' },
    },
    {
      name: "badgeVariant",
      type: "select",
      label: "Badge variante",
      options: [
        { label: "Info", value: "info" },
        { label: "Warning", value: "warning" },
        { label: "Danger", value: "danger" },
      ],
    },

    
    {
      name: "status",
      type: "select",
      defaultValue: "available",
      label: "Statut",
      options: [
        { label: "Disponible", value: "available" },
        { label: "Bientôt complet", value: "almost-full" },
        { label: "Complet", value: "sold-out" },
      ],
      admin: { position: "sidebar" },
    },

    
    {
      name: "showOnHomepage",
      type: "checkbox",
      defaultValue: true,
      label: "Afficher sur la page d'accueil",
      admin: {
        position: "sidebar",
        description: "Cochez pour afficher cette offre dans la section Offres du moment",
      },
    },

    
    {
      name: "departureLocation",
      type: "text",
      label: "Lieu de départ",
      admin: { description: 'e.g. "Départ aéroport Houari Boumediene, Alger"' },
    },
    {
      name: "location",
      type: "text",
      label: "Lieu / Adresse",
      admin: { description: 'e.g. "Istanbul, Turquie"' },
    },
    {
      name: "time",
      type: "text",
      label: "Heure",
      admin: { description: 'e.g. "08:00 - Départ" or "Matin"' },
    },
    {
      name: "metaDates",
      type: "text",
      label: "Dates détaillées",
      admin: { description: 'e.g. "18-25 janvier 2026"' },
    },
    {
      name: "metaDuration",
      type: "text",
      label: "Durée détaillée",
      admin: { description: 'e.g. "7 nuits"' },
    },
    {
      name: "priceSummary",
      type: "textarea",
      label: "Résumé du prix",
      admin: {
        description: "Text shown in the price sidebar",
      },
    },
    {
      name: "priceCard",
      type: "group",
      label: "Carte tarifaire (sidebar)",
      admin: {
        description:
          "Controle les textes affiches dans la carte de reservation a droite sur la page detail de l'offre.",
      },
      fields: [
        {
          name: "description",
          type: "textarea",
          label: "Description en haut de la carte",
          admin: {
            description:
              "Texte affiché dans la zone supérieure de la carte tarifaire, au-dessus de 'Voyageurs'.",
          },
        },
        {
          name: "travellersLabel",
          type: "text",
          label: "Titre voyageurs",
          defaultValue: "Voyageurs",
        },
        {
          name: "defaultAdults",
          type: "number",
          label: "Nombre d'adultes par défaut",
          defaultValue: 1,
          min: 1,
        },
        {
          name: "travellersText",
          type: "text",
          label: "Texte voyageurs",
          admin: {
            description: 'Ex: "1 adulte". Si vide, il sera genere depuis le nombre d\'adultes.',
          },
        },
        {
          name: "detailsTitle",
          type: "text",
          label: "Titre détails prix",
          defaultValue: "Détails du prix",
        },
        {
          name: "totalLabel",
          type: "text",
          label: "Libellé total",
          defaultValue: "Total estimé",
        },
        {
          name: "reserveButtonLabel",
          type: "text",
          label: "Texte bouton",
          defaultValue: "Réserver cette offre",
        },
        {
          name: "confirmationText",
          type: "text",
          label: "Texte confirmation",
          defaultValue: "Disponibilité confirmée avant validation",
        },
      ],
    },
    {
      name: "numberOfDays",
      type: "number",
      label: "Nombre de jours",
      admin: { description: "Nombre de jours du programme (affiché sur la page détails)" },
    },

    
    {
      name: "inclusions",
      type: "array",
      label: "Inclusions",
      admin: {
        description:
          "Chaque ligne peut definir le texte affiche dans 'Ce qui est inclus' ainsi que son icone.",
      },
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
          label: "Texte",
        },
        {
          name: "icon",
          type: "select",
          label: "Icône",
          defaultValue: "check",
          options: inclusionIconOptions,
        },
      ],
    },
    {
      name: "exclusions",
      type: "array",
      label: "Exclusions",
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
        },
      ],
    },

    
    {
      name: "program",
      type: "array",
      label: "Programme",
      labels: {
        singular: "Jour du programme",
        plural: "Jours du programme",
      },
      admin: {
        description:
          "Ajoutez ici le programme specifique de cette offre : jour, titre, description, lieux, repas et photos.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "dayLabel",
          type: "text",
          required: true,
          label: "Jour",
          admin: { description: 'e.g. "JOUR 1"' },
        },
        {
          name: "title",
          type: "text",
          required: true,
          label: "Titre du jour",
        },
        {
          name: "description",
          type: "textarea",
          label: "Description du jour",
        },
        {
          name: "locations",
          type: "array",
          label: "Lieux visités",
          fields: [
            {
              name: "place",
              type: "text",
              required: true,
            },
          ],
        },
        {
          name: "meals",
          type: "array",
          label: "Repas inclus",
          fields: [
            {
              name: "meal",
              type: "text",
              required: true,
              admin: { description: 'e.g. "Petit-déjeuner", "Dîner"' },
            },
          ],
        },
        {
          name: "images",
          type: "array",
          label: "Photos du jour",
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "imageUrl",
              type: "text",
              label: "Image URL (fallback)",
            },
          ],
        },
        {
          name: "isLast",
          type: "checkbox",
          defaultValue: false,
          label: "Dernier jour ?",
        },
      ],
    },

    
    {
      name: "hotels",
      type: "relationship",
      relationTo: "hotels",
      hasMany: true,
      label: "Hôtels disponibles",
      admin: {
        description:
          "Sélectionnez uniquement des hôtels déjà créés dans la collection Hotels. Si aucun hôtel n'existe encore, laissez ce champ vide.",
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.slug) {
          data.slug = toSlug(data.slug);
        } else if (data?.title) {
          data.slug = toSlug(data.title);
        }
        return data;
      },
    ],
    afterChange: [syncHotelsAfterOfferChange],
    afterDelete: [removeOfferFromHotelsAfterDelete],
  },
};
