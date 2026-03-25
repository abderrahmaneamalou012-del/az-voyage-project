import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
} from "payload";

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

const syncHotelOnOffers = async (
  req: Parameters<CollectionAfterChangeHook>[0]["req"],
  hotelId: string,
  nextOfferIds: string[],
  previousOfferIds: string[],
) => {
  const affectedOfferIds = Array.from(new Set([...nextOfferIds, ...previousOfferIds]));

  for (const offerId of affectedOfferIds) {
    const offerResult = await req.payload.find({
      collection: "offers",
      limit: 1,
      pagination: false,
      req,
      where: {
        id: {
          equals: offerId,
        },
      },
    });

    const offer = offerResult.docs[0] as { hotels?: unknown } | undefined;

    if (!offer) {
      continue;
    }

    const currentHotelIds = normalizeRelationIds(offer.hotels);
    const shouldIncludeHotel = nextOfferIds.includes(offerId);
    const nextHotelIds = shouldIncludeHotel
      ? Array.from(new Set([...currentHotelIds, hotelId]))
      : currentHotelIds.filter((id) => id !== hotelId);

    const isUnchanged =
      currentHotelIds.length === nextHotelIds.length &&
      currentHotelIds.every((id, index) => id === nextHotelIds[index]);

    if (isUnchanged) {
      continue;
    }

    await req.payload.update({
      collection: "offers",
      data: {
        hotels: nextHotelIds,
      },
      id: offerId,
      req,
    });
  }
};

const syncOffersAfterHotelChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  await syncHotelOnOffers(
    req,
    String(doc.id),
    normalizeRelationIds((doc as { offers?: unknown }).offers),
    normalizeRelationIds((previousDoc as { offers?: unknown }).offers),
  );

  return doc;
};

const removeHotelFromOffersAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  const hotelId = String(doc.id);
  const linkedOfferIds = normalizeRelationIds((doc as { offers?: unknown }).offers);

  await syncHotelOnOffers(req, hotelId, [], linkedOfferIds);

  return doc;
};

export const Hotels: CollectionConfig = {
  slug: "hotels",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "stars", "price", "childPrice", "dates"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nom",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      admin: { description: "Description courte de l'hôtel" },
    },
    {
      name: "stars",
      type: "number",
      min: 1,
      max: 5,
      label: "Étoiles (1–5)",
      admin: { description: "Nombre d'étoiles de l'hôtel" },
    },
    {
      name: "rating",
      type: "number",
      min: 0,
      max: 5,
      label: "Note (0–5)",
    },
    {
      name: "address",
      type: "text",
      label: "Adresse",
    },
    {
      name: "city",
      type: "text",
      label: "Ville",
    },
    {
      name: "country",
      type: "text",
      label: "Pays",
    },
    {
      name: "dates",
      type: "text",
      label: "Dates affichées",
      admin: { description: 'e.g. "18-25 janvier 2026"' },
    },
    {
      name: "price",
      type: "text",
      label: "Prix affiché",
      admin: { description: 'e.g. "84 000"' },
    },
    {
      name: "priceAmount",
      type: "number",
      label: "Prix (numérique)",
    },
    {
      name: "currency",
      type: "text",
      defaultValue: "DZD",
      label: "Devise",
    },
    {
      name: "pricePerPerson",
      type: "text",
      label: "Prix / personne",
    },
    {
      name: "offers",
      type: "relationship",
      relationTo: "offers",
      hasMany: true,
      label: "Offres liées",
      admin: {
        description:
          "Sélectionnez une ou plusieurs offres où cet hôtel doit apparaître côté frontend.",
      },
    },
    {
      name: "childPrice",
      type: "text",
      label: "Prix enfant affiché (ancien)",
      admin: {
        description: "Champ obsolète — utilisez les tranches d'âge ci-dessous.",
      },
    },
    {
      name: "childPriceAmount",
      type: "number",
      label: "Prix enfant numérique (ancien)",
      admin: {
        description: "Champ obsolète — utilisez les tranches d'âge ci-dessous.",
      },
    },
    {
      name: "childPriceBrackets",
      type: "array",
      label: "Tarifs enfants par tranche d'âge",
      labels: { singular: "Tranche", plural: "Tranches" },
      admin: {
        description:
          "Définissez le prix enfant par tranche d'âge (ex: 1 mois–1 an 10 mois, 2–4 ans, 5–11 ans).",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Libellé",
          admin: { description: 'Ex: "1 mois – 1 an 10 mois"' },
        },
        {
          name: "minAge",
          type: "number",
          label: "Âge min (mois)",
          admin: { description: "Âge minimum en mois" },
        },
        {
          name: "maxAge",
          type: "number",
          label: "Âge max (mois)",
          admin: { description: "Âge maximum en mois" },
        },
        {
          name: "priceAmount",
          type: "number",
          required: true,
          label: "Prix (numérique)",
        },
        {
          name: "priceLabel",
          type: "text",
          label: "Prix affiché",
          admin: { description: 'Ex: "15 000 DA"' },
        },
      ],
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
      label: "Image principale URL (fallback)",
    },
    {
      name: "images",
      type: "array",
      label: "Photos",
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
      name: "amenities",
      type: "array",
      label: "Équipements",
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "transferIncluded",
      type: "checkbox",
      defaultValue: false,
      label: "Transfert inclus",
      admin: {
        description:
          "Oui = afficher l'icône bus et le texte \"Transfert inclus\" sur la carte hôtel.",
      },
    },
    {
      name: "breakfastIncluded",
      type: "checkbox",
      defaultValue: false,
      label: "Petit-déjeuner inclus",
    },
  ],
  hooks: {
    afterChange: [syncOffersAfterHotelChange],
    afterDelete: [removeHotelFromOffersAfterDelete],
  },
};
