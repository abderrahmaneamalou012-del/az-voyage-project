import type { CollectionConfig } from "payload";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const Media: CollectionConfig = {
  slug: "media",

  access: {
    read: () => true,
  },

  upload: {
    disableLocalStorage: true,
    mimeTypes: ["image/*", "video/*"],
  },

  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation !== "create") return data;

        if (req.file) {
          const file = req.file;

          const base64 = `data:${file.mimetype};base64,${file.data.toString("base64")}`;

          const result = await cloudinary.uploader.upload(base64, {
            folder: "agency-travel",
          });

          return {
            ...data,
            cloudinaryUrl: result.secure_url,
            cloudinaryId: result.public_id,
          };
        }

        return data;
      },
    ],
  },

  fields: [
    {
      name: "alt",
      type: "text",
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