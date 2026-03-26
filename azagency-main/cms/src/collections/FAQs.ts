import type { CollectionConfig } from "payload";

const canManageFaqs = ({ req }: { req: { user: unknown } }) => {
  const user = req.user as { role?: string } | null;

  
  if (!user) return false;
  if (!user.role) return true;

  return user.role === "admin" || user.role === "editor";
};

export const FAQs: CollectionConfig = {
  slug: "faqs",
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "order"],
    description:
      "Modifiez ici uniquement les questions et les reponses de la FAQ. Le slider visuel du passeport reste fixe dans le frontend et n'est pas editable depuis le CMS.",
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "question",
      type: "text",
      required: true,
      label: "Question",
    },
    {
      name: "answer",
      type: "textarea",
      required: true,
      label: "Réponse",
    },
    {
      name: "order",
      type: "number",
      label: "Ordre d'affichage",
      admin: { position: "sidebar" },
    },
  ],
};
