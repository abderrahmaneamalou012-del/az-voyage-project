export const stickySidebarTestOffer = {
  title: "[TEST] Sidebar Sticky — Istanbul",
  slug: "test-sidebar-sticky",
  destination: "Istanbul Test Sticky",
  country: "Turquie",
  flag: "🇹🇷",
  region: "Turquie",
  dates: "10-14 octobre",
  duration: "4 jours",
  durationDays: 4,
  durationNights: 4,
  numberOfDays: 4,
  price: "99 000",
  priceAmount: 99000,
  tag: "Test Sticky",
  mainImageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg",
  shortDescription:
    "Offre de test avec assez de contenu avant le formulaire pour vérifier que la sidebar devient sticky puis s'arrête avant la réservation.",
  departureLocation: "Départ aéroport Houari Boumediene, Alger",
  location: "Istanbul, Turquie",
  time: "08:30 – Départ matinal",
  metaDates: "10-14 octobre 2026",
  metaDuration: "4 nuits",
  priceSummary:
    "Cas de test pour la sidebar sticky avec contenu détaillé avant le formulaire.",
  status: "available",
  showOnHomepage: false,
  inclusions: [
    { item: "Vol aller-retour" },
    { item: "Hébergement hôtel" },
    { item: "Petit-déjeuner" },
    { item: "Transfert aéroport" },
  ],
  exclusions: [
    { item: "Déjeuner et dîner" },
    { item: "Excursions optionnelles" },
  ],
  program: [
    {
      dayLabel: "JOUR 1",
      title: "Arrivée et installation",
      description:
        "Accueil à l'aéroport, transfert et installation à l'hôtel avec temps libre le soir.",
      locations: [{ place: "Aéroport Istanbul" }, { place: "Hôtel" }],
      meals: [{ meal: "Dîner" }],
    },
    {
      dayLabel: "JOUR 2",
      title: "Découverte du centre historique",
      description:
        "Parcours libre dans Sultanahmet avec arrêts autour de Sainte-Sophie, de la Mosquée Bleue et des ruelles commerçantes.",
      locations: [{ place: "Sainte-Sophie" }, { place: "Mosquée Bleue" }],
      meals: [{ meal: "Petit-déjeuner" }],
    },
    {
      dayLabel: "JOUR 3",
      title: "Bosphore et quartiers iconiques",
      description:
        "Balade sur le Bosphore puis temps libre pour découvrir Ortaköy et les cafés en bord de mer.",
      locations: [{ place: "Bosphore" }, { place: "Ortaköy" }],
      meals: [{ meal: "Petit-déjeuner" }],
    },
    {
      dayLabel: "JOUR 4",
      title: "Retour",
      description: "Check-out, transfert vers l'aéroport et vol retour.",
      locations: [{ place: "Aéroport Istanbul" }],
      meals: [{ meal: "Petit-déjeuner" }],
      isLast: true,
    },
  ],
  galleryImages: [
    { imageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg" },
    { imageUrl: "/assets/figma/5a02729a3418047c872b3399e3fcaaa7fd8876e1.jpg" },
    { imageUrl: "/assets/figma/cf0410856b991c188fcf3b7f24a87b6fed7eb6e8.jpg" },
    { imageUrl: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg" },
  ],
} as const;

export const staticSidebarTestOffer = {
  title: "[TEST] Sidebar Static — Paris",
  slug: "test-sidebar-static",
  destination: "Paris Test Static",
  country: "France",
  flag: "🇫🇷",
  region: "Europe",
  dates: "18-21 novembre",
  duration: "3 jours",
  durationDays: 3,
  durationNights: 3,
  numberOfDays: 3,
  price: "89 000",
  priceAmount: 89000,
  tag: "Test Static",
  mainImageUrl: "/assets/figma/cf0410856b991c188fcf3b7f24a87b6fed7eb6e8.jpg",
  shortDescription:
    "Offre de test avec contenu minimal avant le formulaire pour vérifier que la sidebar reste statique.",
  departureLocation: "Départ aéroport Houari Boumediene, Alger",
  location: "Paris, France",
  time: "09:00 – Départ matinal",
  metaDates: "18-21 novembre 2026",
  metaDuration: "3 nuits",
  priceSummary:
    "Cas de test pour la sidebar non sticky lorsqu'il n'y a pas de contenu avant le formulaire.",
  status: "available",
  showOnHomepage: false,
  galleryImages: [
    { imageUrl: "/assets/figma/cf0410856b991c188fcf3b7f24a87b6fed7eb6e8.jpg" },
    { imageUrl: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg" },
    { imageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg" },
    { imageUrl: "/assets/figma/47915728ec2c232de145d04fe195c0cf46027056.jpg" },
  ],
} as const;

export const offerDetailSidebarTestOffers = [
  stickySidebarTestOffer,
  staticSidebarTestOffer,
] as const;
