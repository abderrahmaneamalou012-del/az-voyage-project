import type { CollectionConfig } from "payload";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ operation, req, data }) => {
        const file = (req as any)?.files?.file;

        if (operation === "create" && file) {
          const base64 = `data:${file.mimetype};base64,${file.data.toString("base64")}`;

          const result = await cloudinary.uploader.upload(base64, {
            folder: "agency-travel",
            resource_type: "auto",
          });

          return {
            ...data,
            cloudinaryUrl: result.secure_url,
            cloudinaryId: result.public_id,
            filename: result.public_id,
          };
        }

        return data;
      },
    ],
  },
  upload: {
    disableLocalStorage: true,
    mimeTypes: ["image/*", "video/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: false,
      label: "Texte alternatif",
    },
    {
      name: "cloudinaryUrl",
      type: "text",
      admin: { readOnly: true },
    },
    {
      name: "cloudinaryId",
      type: "text",
      admin: { hidden: true },
    },
  ],
};