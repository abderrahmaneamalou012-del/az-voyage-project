











import "dotenv/config";
import { getPayload } from "payload";
import config from "./payload.config";
import {
  bookingProcessContentDefaults,
  bookingStepsDefaults,
} from "./defaults/bookingProcessContent";
import { offerDetailSidebarTestOffers } from "./defaults/offerDetailSidebarTestOffers";



const hotelsData = [
  {
    name: "Hermanos Hotel",
    description: "Hôtel 4 étoiles en plein centre-ville avec vue panoramique sur le Bosphore. Petit-déjeuner buffet inclus.",
    stars: 4,
    dates: "18-25 janvier 2026",
    price: "84 000",
    pricePerPerson: "84 000",
    currency: "DZD",
    address: "Sultanahmet, Istanbul",
    city: "Istanbul",
    country: "Turquie",
    transferIncluded: true,
    breakfastIncluded: true,
    amenities: [
      { item: "Wi-Fi gratuit" },
      { item: "Piscine" },
      { item: "Spa" },
      { item: "Restaurant" },
      { item: "Room service" },
    ],
    images: [
      { imageUrl: "/assets/figma/37c823577edb4dbdc73e687407625fd87908430a.jpg" },
      { imageUrl: "/assets/figma/b4365b4213a1ab3ed63291bf2cf4d1f00b6c6c4e.jpg" },
      { imageUrl: "/assets/figma/d1d2e746586963a4fd04eb564c23aa979fa68946.jpg" },
      { imageUrl: "/assets/figma/59963752338377140a89306e9be22526a08262a9.jpg" },
      { imageUrl: "/assets/figma/910cc56e7171f85753f9a3f9629a2e27c588c472.jpg" },
      { imageUrl: "/assets/figma/47915728ec2c232de145d04fe195c0cf46027056.jpg" },
      { imageUrl: "/assets/figma/41f508fbba5d9a76394c60f6d497d92a6820690a.jpg" },
    ],
  },
  {
    name: "All Seasons Hotel",
    description: "Hôtel moderne et confortable situé à proximité des principaux sites touristiques d'Istanbul.",
    stars: 3,
    dates: "18-25 janvier 2026",
    price: "72 000",
    pricePerPerson: "72 000",
    currency: "DZD",
    address: "Beyoğlu, Istanbul",
    city: "Istanbul",
    country: "Turquie",
    transferIncluded: true,
    breakfastIncluded: false,
    amenities: [
      { item: "Wi-Fi gratuit" },
      { item: "Restaurant" },
      { item: "Climatisation" },
    ],
    images: [
      { imageUrl: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg" },
      { imageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg" },
      { imageUrl: "/assets/figma/cf0410856b991c188fcf3b7f24a87b6fed7eb6e8.jpg" },
    ],
  },
  {
    name: "Grand Palace Hotel",
    description: "Hôtel de luxe 5 étoiles avec service premium, spa et vue imprenable sur la Corne d'Or.",
    stars: 5,
    dates: "18-25 janvier 2026",
    price: "120 000",
    pricePerPerson: "120 000",
    currency: "DZD",
    address: "Fatih, Istanbul",
    city: "Istanbul",
    country: "Turquie",
    transferIncluded: true,
    breakfastIncluded: true,
    amenities: [
      { item: "Wi-Fi gratuit" },
      { item: "Piscine intérieure" },
      { item: "Spa & Hammam" },
      { item: "Restaurant gastronomique" },
      { item: "Room service 24h" },
      { item: "Salle de sport" },
    ],
    images: [
      { imageUrl: "/assets/figma/b4365b4213a1ab3ed63291bf2cf4d1f00b6c6c4e.jpg" },
      { imageUrl: "/assets/figma/5a02729a3418047c872b3399e3fcaaa7fd8876e1.jpg" },
      { imageUrl: "/assets/figma/d1d2e746586963a4fd04eb564c23aa979fa68946.jpg" },
      { imageUrl: "/assets/figma/37c823577edb4dbdc73e687407625fd87908430a.jpg" },
      { imageUrl: "/assets/figma/47915728ec2c232de145d04fe195c0cf46027056.jpg" },
    ],
  },
];

const offersData = [
  {
    title: "Cappadoce – Turquie",
    destination: "Cappadoce",
    country: "Turquie",
    flag: "🇹🇷",
    region: "Turquie",
    dates: "12–19 avril",
    duration: "7 Jours",
    durationDays: 7,
    price: "145 000",
    priceAmount: 145000,
    tag: "Coup de coeur",
    mainImageUrl: "/assets/figma/5a02729a3418047c872b3399e3fcaaa7fd8876e1.jpg",
    shortDescription:
      "Explorez les paysages lunaires de la Cappadoce, ses cheminées de fées et ses vols en montgolfière.",
    status: "available",
    showOnHomepage: true,
  },
  {
    title: "Petra – Jordanie",
    destination: "Petra",
    country: "Jordanie",
    flag: "🇯🇴",
    region: "Moyen-Orient",
    dates: "01–07 mai",
    duration: "7 Jours",
    durationDays: 7,
    price: "168 000",
    priceAmount: 168000,
    tag: "Nouveau",
    mainImageUrl: "/assets/figma/cf0410856b991c188fcf3b7f24a87b6fed7eb6e8.jpg",
    shortDescription:
      "Découvrez l'ancienne cité nabatéenne taillée dans le grès rose.",
    status: "available",
    showOnHomepage: true,
  },
  {
    title: "Maldives – Océan",
    destination: "Maldives",
    country: "Maldives",
    flag: "🇲🇻",
    region: "Asie",
    dates: "20–27 juin",
    duration: "7 Jours",
    durationDays: 7,
    price: "320 000",
    priceAmount: 320000,
    mainImageUrl: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg",
    shortDescription:
      "Plages de sable blanc et eaux turquoise cristallines des Maldives.",
    status: "available",
    showOnHomepage: true,
  },
  {
    title: "Istanbul – City Break",
    destination: "Istanbul",
    country: "Turquie",
    flag: "🇹🇷",
    region: "Turquie",
    dates: "05–09 juillet",
    duration: "4 Jours",
    durationDays: 4,
    price: "95 000",
    priceAmount: 95000,
    mainImageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg",
    shortDescription:
      "Entre Orient et Occident, laissez-vous charmer par la magie d'Istanbul.",
    departureLocation: "Départ aéroport Houari Boumediene, Alger",
    location: "Istanbul, Turquie",
    time: "08:00 – Départ matinal",
    metaDates: "05-09 juillet 2026",
    metaDuration: "4 nuits",
    durationNights: 4,
    numberOfDays: 4,
    priceSummary:
      "Séjour incluant vol aller-retour, hébergement à l'hôtel et transfert aéroport-hôtel selon l'option choisie.",
    status: "available",
    showOnHomepage: true,
    inclusions: [
      { item: "Vol aller-retour" },
      { item: "Hébergement hôtel" },
      { item: "Petit-déjeuner" },
      { item: "Transfert aéroport" },
      { item: "Assistance 24h/24" },
    ],
    exclusions: [
      { item: "Déjeuner et dîner" },
      { item: "Excursions optionnelles" },
      { item: "Assurance voyage" },
    ],
    program: [
      {
        dayLabel: "JOUR 1",
        title: "Arrivée à Istanbul",
        description:
          "Arrivée à l'aéroport, accueil et transfert vers votre hôtel. Installation et temps libre.",
        locations: [{ place: "Aéroport Istanbul" }, { place: "Hôtel" }],
        meals: [{ meal: "Dîner" }],
      },
      {
        dayLabel: "JOUR 2",
        title: "Découverte historique",
        description:
          "Visite libre de la Mosquée Bleue, Sainte-Sophie et du Palais de Topkapi. Temps libre au Grand Bazar.",
        locations: [{ place: "Mosquée Bleue" }, { place: "Sainte-Sophie" }, { place: "Palais de Topkapi" }, { place: "Grand Bazar" }],
        meals: [{ meal: "Petit-déjeuner" }],
      },
      {
        dayLabel: "JOUR 3",
        title: "Croisière sur le Bosphore",
        description:
          "Excursion optionnelle en bateau sur le Bosphore et découverte des quartiers emblématiques.",
        locations: [{ place: "Bosphore" }, { place: "Ortaköy" }],
        meals: [{ meal: "Petit-déjeuner" }],
      },
      {
        dayLabel: "JOUR 4",
        title: "Retour",
        description:
          "Transfert vers l'aéroport et vol retour vers Alger.",
        locations: [{ place: "Aéroport Istanbul" }],
        meals: [{ meal: "Petit-déjeuner" }],
        isLast: true,
      },
    ],
    galleryImages: [
      { imageUrl: "/assets/figma/5a02729a3418047c872b3399e3fcaaa7fd8876e1.jpg" },
      { imageUrl: "/assets/figma/cf0410856b991c188fcf3b7f24a87b6fed7eb6e8.jpg" },
      { imageUrl: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg" },
      { imageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg" },
    ],
  },
  
  {
    title: "Istanbul – Turquie",
    destination: "Istanbul",
    country: "Turquie",
    flag: "🇹🇷",
    region: "Turquie",
    dates: "18-25 janvier",
    duration: "7 jours",
    durationDays: 7,
    price: "80 000",
    priceAmount: 80000,
    badge: "Bientôt complet",
    badgeVariant: "warning",
    mainImageUrl: "/assets/figma/5a02729a3418047c872b3399e3fcaaa7fd8876e1.jpg",
    shortDescription:
      "Entre Orient et Occident, laissez-vous charmer par la magie d'Istanbul. Mosquées majestueuses, bazars animés et gastronomie unique vous attendent.",
    departureLocation: "Départ aéroport Houari Boumediene, Alger",
    location: "Istanbul, Turquie",
    time: "06:00 – Départ matinal",
    metaDates: "18-25 janvier 2026",
    metaDuration: "7 nuits",
    durationNights: 7,
    numberOfDays: 8,
    priceSummary:
      "Séjour incluant vol aller-retour, hébergement à l'hôtel et transfert aéroport-hôtel selon l'option choisie.",
    status: "almost-full",
    inclusions: [
      { item: "Vol aller-retour" },
      { item: "Hébergement hôtel" },
      { item: "Petit-déjeuner" },
      { item: "Transfert aéroport" },
      { item: "Assistance 24h/24" },
    ],
    exclusions: [
      { item: "Déjeuner et dîner" },
      { item: "Excursions optionnelles" },
      { item: "Assurance voyage" },
      { item: "Dépenses personnelles" },
    ],
    program: [
      {
        dayLabel: "JOUR 1",
        title: "Arrivée à Istanbul",
        description:
          "Arrivée à l'aéroport, accueil et transfert vers votre hôtel. Installation et temps libre.",
        locations: [{ place: "Aéroport Istanbul" }, { place: "Hôtel" }],
        meals: [{ meal: "Dîner" }],
      },
      {
        dayLabel: "JOUR 2",
        title: "Découverte historique",
        description:
          "Visite libre de la Mosquée Bleue, Sainte-Sophie et du Palais de Topkapi. Temps libre au Grand Bazar.",
        locations: [{ place: "Mosquée Bleue" }, { place: "Sainte-Sophie" }, { place: "Grand Bazar" }],
        meals: [{ meal: "Petit-déjeuner" }],
      },
      {
        dayLabel: "JOUR 3",
        title: "Croisière sur le Bosphore",
        description:
          "Excursion optionnelle en bateau sur le Bosphore et découverte des quartiers emblématiques.",
        locations: [{ place: "Bosphore" }, { place: "Ortaköy" }, { place: "Beşiktaş" }],
        meals: [{ meal: "Petit-déjeuner" }],
      },
      {
        dayLabel: "JOUR 4",
        title: "Journée libre",
        description:
          "Profitez de la ville à votre rythme : shopping, cafés, balades.",
        meals: [{ meal: "Petit-déjeuner" }],
      },
      {
        dayLabel: "JOUR 5 À 7",
        title: "Séjour libre",
        description: "Temps libre pour explorer Istanbul selon vos envies.",
        meals: [{ meal: "Petit-déjeuner" }],
      },
      {
        dayLabel: "JOUR 8",
        title: "Retour",
        description: "Transfert vers l'aéroport et vol retour vers Alger.",
        locations: [{ place: "Aéroport Istanbul" }],
        meals: [{ meal: "Petit-déjeuner" }],
        isLast: true,
      },
    ],
    galleryImages: [
      { imageUrl: "/assets/figma/5a02729a3418047c872b3399e3fcaaa7fd8876e1.jpg" },
      { imageUrl: "/assets/figma/cf0410856b991c188fcf3b7f24a87b6fed7eb6e8.jpg" },
      { imageUrl: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg" },
      { imageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg" },
      { imageUrl: "/assets/figma/47915728ec2c232de145d04fe195c0cf46027056.jpg" },
      { imageUrl: "/assets/figma/37c823577edb4dbdc73e687407625fd87908430a.jpg" },
      { imageUrl: "/assets/figma/41f508fbba5d9a76394c60f6d497d92a6820690a.jpg" },
      { imageUrl: "/assets/figma/59963752338377140a89306e9be22526a08262a9.jpg" },
      { imageUrl: "/assets/figma/910cc56e7171f85753f9a3f9629a2e27c588c472.jpg" },
      { imageUrl: "/assets/figma/b4365b4213a1ab3ed63291bf2cf4d1f00b6c6c4e.jpg" },
      { imageUrl: "/assets/figma/d1d2e746586963a4fd04eb564c23aa979fa68946.jpg" },
    ],
  },
  {
    title: "Paris – France",
    destination: "Paris",
    country: "France",
    flag: "🇫🇷",
    region: "Europe",
    dates: "18-25 janvier",
    duration: "7 jours",
    durationDays: 7,
    price: "80 000",
    priceAmount: 80000,
    mainImageUrl: "/assets/figma/cf0410856b991c188fcf3b7f24a87b6fed7eb6e8.jpg",
    status: "available",
  },
  {
    title: "Le Caire – Égypte",
    destination: "Le Caire",
    country: "Égypte",
    flag: "🇪🇬",
    region: "Moyen-Orient",
    dates: "18-25 janvier",
    duration: "7 jours",
    durationDays: 7,
    price: "80 000",
    priceAmount: 80000,
    mainImageUrl: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg",
    status: "available",
  },
  {
    title: "Moscou – Russie",
    destination: "Moscou",
    country: "Russie",
    flag: "🇷🇺",
    region: "Europe",
    dates: "18-25 janvier",
    duration: "7 jours",
    durationDays: 7,
    price: "80 000",
    priceAmount: 80000,
    mainImageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg",
    status: "available",
  },
  {
    title: "New York – USA",
    destination: "New York",
    country: "USA",
    flag: "🇺🇸",
    region: "Europe",
    dates: "18-25 janvier",
    duration: "7 jours",
    durationDays: 7,
    price: "80 000",
    priceAmount: 80000,
    mainImageUrl: "/assets/figma/47915728ec2c232de145d04fe195c0cf46027056.jpg",
    status: "available",
  },
  {
    title: "Istanbul Sold Out",
    destination: "Istanbul",
    country: "Turquie",
    flag: "🇹🇷",
    region: "Turquie",
    dates: "18-25 janvier",
    duration: "7 jours",
    durationDays: 7,
    price: "80 000",
    priceAmount: 80000,
    badge: "Sold out",
    badgeVariant: "danger",
    mainImageUrl: "/assets/figma/37c823577edb4dbdc73e687407625fd87908430a.jpg",
    status: "sold-out",
  },
  {
    title: "Nairobi – Kenya",
    destination: "Nairobi",
    country: "Kenya",
    flag: "🇰🇪",
    region: "Afrique",
    dates: "18-25 janvier",
    duration: "7 jours",
    durationDays: 7,
    price: "80 000",
    priceAmount: 80000,
    mainImageUrl: "/assets/figma/41f508fbba5d9a76394c60f6d497d92a6820690a.jpg",
    status: "available",
  },
  {
    title: "Bali – Indonésie",
    destination: "Bali",
    country: "Indonésie",
    flag: "🇮🇩",
    region: "Asie",
    dates: "18-25 janvier",
    duration: "7 jours",
    durationDays: 7,
    price: "80 000",
    priceAmount: 80000,
    mainImageUrl: "/assets/figma/59963752338377140a89306e9be22526a08262a9.jpg",
    status: "available",
  },
  {
    title: "Dubaï – Émirats",
    destination: "Dubaï",
    country: "Émirats Arabes Unis",
    flag: "🇦🇪",
    region: "Moyen-Orient",
    dates: "18-25 janvier",
    duration: "7 jours",
    durationDays: 7,
    price: "80 000",
    priceAmount: 80000,
    mainImageUrl: "/assets/figma/910cc56e7171f85753f9a3f9629a2e27c588c472.jpg",
    status: "available",
  },
];

const destinationsData = [
  {
    name: "Cappadoce",
    country: "Turquie",
    imageUrl: "/assets/figma/5a02729a3418047c872b3399e3fcaaa7fd8876e1.jpg",
    category: "turquie",
    cardDescription:
      "Entre mosquées majestueuses, ruelles animées et vues sur le Bosphore, un séjour parfait pour city break, shopping et découvertes",
    cardTags: [{ label: "Famille" }, { label: "Histoire" }],
  },
  {
    name: "Rome",
    country: "Italie",
    imageUrl: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg",
    category: "europe",
    cardDescription:
      "Un patrimoine unique, des places mythiques et une ambiance méditerranéenne idéale pour une escapade culturelle.",
    cardTags: [{ label: "Culture" }, { label: "City Break" }],
  },
  {
    name: "Le Caire",
    country: "Egypte",
    imageUrl: "/assets/figma/cf0410856b991c188fcf3b7f24a87b6fed7eb6e8.jpg",
    category: "afrique",
    cardDescription:
      "Des pyramides aux souks vibrants, vivez un voyage entre histoire antique et énergie orientale.",
    cardTags: [{ label: "Histoire" }, { label: "Aventure" }],
  },
  {
    name: "Agra",
    country: "Inde",
    imageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg",
    category: "asie",
    cardDescription:
      "Le Taj Mahal et des sites emblématiques pour un séjour riche en émotions et en découvertes.",
    cardTags: [{ label: "Monuments" }, { label: "Famille" }],
  },
];

const testimonialsData = [
  {
    text: "Très sérieux. Ils répondent vite sur WhatsApp et expliquent tout (inclus / non inclus)",
    author: "Flown Marketing",
    date: "Septembre 2025",
    rating: 5,
    type: "text",
    order: 1,
  },
  {
    text: "Franchement, expérience très rassurante du début à la fin. J'avais peur de réserver en ligne, mais tout était expliqué clairement : les dates, ce qui est inclus, les options d'hôtel, et même les détails du transfert.",
    author: "Flown Marketing",
    date: "Septembre 2025",
    rating: 5,
    type: "text",
    order: 2,
  },
  {
    text: "On a réservé une option d'hôtel, ils ont confirmé la disponibilité rapidement. Très pro",
    author: "Flown Marketing",
    date: "Septembre 2025",
    rating: 5,
    type: "text",
    order: 3,
  },
  {
    text: "Bon rapport qualité/prix et surtout un suivi vraiment rassurant.",
    author: "Flown Marketing",
    date: "Septembre 2025",
    rating: 5,
    type: "text",
    order: 4,
  },
  {
    text: "Organisation au top, tout était clair dès le départ. On a reçu les infos et l'assistance quand il fallait.",
    author: "Flown Marketing",
    date: "Septembre 2025",
    rating: 5,
    type: "video",
    videoImageUrl: "/assets/figma/testimonial.png",
    videoQuote:
      "Organisation au top, tout était clair dès le départ. On a reçu les infos et l'assistance quand il fallait.",
    order: 5,
  },
];

const faqsData = [
  {
    question: "Que comprend une offre ?",
    answer:
      "Chaque offre indique clairement ce qui est inclus (vol, hôtel, transferts, etc.). Les inclusions peuvent varier selon la destination et l'option choisie — tout est précisé dans la fiche de l'offre.",
    order: 1,
  },
  {
    question: "Les prix sont-ils fixes ?",
    answer:
      "Oui, les prix affichés sont fixes au moment de la réservation. Ils peuvent varier selon la saison et la disponibilité.",
    order: 2,
  },
  {
    question: "Puis-je choisir mon hôtel ?",
    answer:
      "Absolument ! Chaque offre propose plusieurs options d'hôtels que vous pouvez sélectionner selon vos préférences et budget.",
    order: 3,
  },
  {
    question: "Combien de temps pour avoir une réponse ?",
    answer:
      "Notre équipe répond généralement dans les 24 heures. Pour les demandes urgentes, contactez-nous sur WhatsApp.",
    order: 4,
  },
  {
    question: "Proposez-vous des voyages sur mesure ?",
    answer:
      "Oui ! Nous proposons des voyages complètement personnalisés selon vos dates, budget et destinations préférées.",
    order: 5,
  },
  {
    question: "Les transferts sont-ils inclus ?",
    answer:
      "Cela dépend de l'offre sélectionnée. Certaines offres incluent les transferts aéroport-hôtel, d'autres non. Vérifiez les détails de chaque offre.",
    order: 6,
  },
  {
    question: "Y a-t-il une assistance pendant le voyage ?",
    answer:
      "Oui, notre équipe est disponible via WhatsApp avant, pendant et après votre voyage pour vous aider.",
    order: 7,
  },
  {
    question: "Que se passe-t-il si l'offre n'est plus disponible ?",
    answer:
      "Nous vous proposons des alternatives similaires ou vous remboursons intégralement.",
    order: 8,
  },
];

const featuresData = [
  { text: "Hôtel", imageUrl: "/assets/figma/taj-garden.png", order: 1 },
  { text: "Transferts", imageUrl: "/assets/figma/airport.png", order: 2 },
  { text: "Hôtels au choix", imageUrl: "/assets/figma/petra-canyon.png", order: 3 },
  { text: "Départs disponibles", imageUrl: "/assets/figma/cappadocia.png", order: 4 },
  { text: "Assistance", imageUrl: "/assets/figma/island.png", order: 5 },
  { text: "Lune de miel", imageUrl: "/assets/figma/colosseum-garden.png", order: 6 },
  { text: "Musées", imageUrl: "/assets/figma/pyramids-oasis.png", order: 7 },
];

const bookingStepsData = bookingStepsDefaults;
const bookingProcessContentData = bookingProcessContentDefaults;

const seededOffersData = [...offersData.slice(0, 10), ...offerDetailSidebarTestOffers];
const seededFaqsData = faqsData.slice(0, 7);




async function seed() {
  console.log("🌱 Starting seed…");

  const payload = await getPayload({ config });

  
  const collections = [
    "offers",
    "hotels",
    "destinations",
    "testimonials",
    "faqs",
    "features",
    "booking-steps",
  ] as const;

  for (const slug of collections) {
    const existing = await payload.find({ collection: slug, limit: 1 });
    if (existing.totalDocs > 0) {
      console.log(`  Deleting existing ${slug}…`);
      const all = await payload.find({ collection: slug, limit: 1000 });
      for (const doc of all.docs) {
        await payload.delete({ collection: slug, id: doc.id });
      }
    }
  }

  
  const existingUsers = await payload.find({ collection: "users", limit: 1 });
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: "users",
      data: {
        email: "admin@agencytravel.com",
        password: "admin123",
        role: "admin",
      },
    });
    console.log("  ✓ Admin user created (admin@agencytravel.com / admin123)");
  }

  
  const hotelIds: string[] = [];
  for (const hotel of hotelsData) {
    const created = await payload.create({
      collection: "hotels",
      data: hotel as any,
    });
    hotelIds.push(String(created.id));
  }
  console.log(`  ✓ ${hotelIds.length} hotels created`);

  
  let offerCount = 0;
  for (const offer of seededOffersData) {
    
    const data: any = { ...offer };
    if (offer.destination === "Istanbul" && offer.program?.length) {
      data.hotels = hotelIds;
    }
    await payload.create({ collection: "offers", data });
    offerCount++;
  }
  console.log(`  ✓ ${offerCount} offers created`);

  
  for (const dest of destinationsData) {
    await payload.create({ collection: "destinations", data: dest as any });
  }
  console.log(`  ✓ ${destinationsData.length} destinations created`);

  
  for (const t of testimonialsData) {
    await payload.create({ collection: "testimonials", data: t as any });
  }
  console.log(`  ✓ ${testimonialsData.length} testimonials created`);

  
  for (const faq of seededFaqsData) {
    await payload.create({ collection: "faqs", data: faq as any });
  }
  console.log(`  ✓ ${seededFaqsData.length} FAQs created`);

  
  for (const f of featuresData) {
    await payload.create({ collection: "features", data: f as any });
  }
  console.log(`  ✓ ${featuresData.length} features created`);

  
  for (const s of bookingStepsData) {
    await payload.create({ collection: "booking-steps", data: s as any });
  }
  console.log(`  ✓ ${bookingStepsData.length} booking steps created`);

  await payload.updateGlobal({
    slug: "booking-process-content",
    data: bookingProcessContentData as any,
  });
  console.log("  ✓ booking process content global updated");

  console.log("\n✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
