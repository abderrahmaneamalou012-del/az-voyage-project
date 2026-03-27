export const bookingProcessTextBlockDefaults = {
  block1: {
    title: "Choisissez votre destination",
    description:
      "Parcourez nos offres, comparez les dates et les options d'hôtel, puis sélectionnez la formule qui vous convient le mieux.",
  },
  block2: {
    title: "Envoyez votre demande",
    description:
      "Envoyez votre demande via le formulaire ou sur WhatsApp en indiquant le nombre de voyageurs et l'hôtel choisi.",
  },
  block3: {
    title: "Confirmation & préparation",
    description:
      "Nous confirmons la disponibilité, puis vous recevez les informations et les prochaines étapes pour finaliser.",
  },
} as const;

export const bookingProcessContentDefaults = {
  layoutMode: "text" as const,
  ...bookingProcessTextBlockDefaults,
  photoSlides: [] as Array<{ image?: string }>,
};

export const bookingStepsDefaults = [
  {
    num: "01.",
    order: 1,
    ...bookingProcessTextBlockDefaults.block1,
  },
  {
    num: "02.",
    order: 2,
    ...bookingProcessTextBlockDefaults.block2,
  },
  {
    num: "03.",
    order: 3,
    ...bookingProcessTextBlockDefaults.block3,
  },
] as const;
