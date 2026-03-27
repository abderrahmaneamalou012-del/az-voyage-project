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
    beforeOperation: [
      async ({ operation, args }) => {
        if (operation === "create" && args?.req?.file) {
          const file = args.req.file;
          const base64 = `data:${file.mimetype};base64,${file.data.toString("base64")}`;
          const result = await cloudinary.uploader.upload(base64, {
            folder: "agency-travel",
            resource_type: "auto",
          });
          args.req.file = undefined;
          if (!args.data) args.data = {};
          args.data.url = result.secure_url;
          args.data.filename = result.public_id;
          args.data.cloudinaryId = result.public_id;
        }
        return args;
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
      name: "cloudinaryId",
      type: "text",
      admin: { hidden: true },
    },
  ],
};