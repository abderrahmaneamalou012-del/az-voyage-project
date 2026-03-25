import "dotenv/config";
import { getPayload } from "payload";
import config from "./payload.config";

type DestinationDoc = {
  id: string | number;
  name?: string;
  country?: string;
  cardDescription?: string;
  cardTags?: Array<{ label?: string }>;
  href?: string;
};

const defaults: Record<string, { country: string; cardDescription: string; cardTags: string[] }> = {
  cappadoce: {
    country: "Turquie",
    cardDescription:
      "Entre mosquées majestueuses, ruelles animées et vues sur le Bosphore, un séjour parfait pour city break, shopping et découvertes",
    cardTags: ["Famille", "Histoire"],
  },
  rome: {
    country: "Italie",
    cardDescription:
      "Un patrimoine unique, des places mythiques et une ambiance méditerranéenne idéale pour une escapade culturelle.",
    cardTags: ["Culture", "City Break"],
  },
  "le-caire": {
    country: "Egypte",
    cardDescription:
      "Des pyramides aux souks vibrants, vivez un voyage entre histoire antique et énergie orientale.",
    cardTags: ["Histoire", "Aventure"],
  },
  agra: {
    country: "Inde",
    cardDescription:
      "Le Taj Mahal et des sites emblématiques pour un séjour riche en émotions et en découvertes.",
    cardTags: ["Monuments", "Famille"],
  },
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function run() {
  const payload = await getPayload({ config });
  const destinations = await payload.find({
    collection: "destinations",
    limit: 1000,
    pagination: false,
  });

  let updated = 0;

  for (const doc of destinations.docs as DestinationDoc[]) {
    const key = toSlug(doc.name || "");
    const fallback = defaults[key];

    const country = doc.country || fallback?.country || doc.name || "";
    const cardDescription = doc.cardDescription || fallback?.cardDescription || "";
    const cardTags =
      doc.cardTags && doc.cardTags.length > 0
        ? doc.cardTags
        : (fallback?.cardTags || []).map((label) => ({ label }));

    const href = `/listing?country=${encodeURIComponent(country)}`;

    await payload.update({
      collection: "destinations",
      id: doc.id,
      data: {
        country,
        cardDescription,
        cardTags,
        href,
      },
    });

    updated += 1;
  }

  console.log(`Destinations backfilled: ${updated}`);
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
