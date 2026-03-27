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

  upload: false,

  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        console.log("🔥 MEDIA HOOK TRIGGERED");

        if (operation !== "create") return doc;

        try {
          const fileUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/file/${doc.filename}`;

          const result = await cloudinary.uploader.upload(fileUrl, {
            folder: "agency-travel",
          });

          await req.payload.update({
            collection: "media",
            id: doc.id,
            data: {
              cloudinaryUrl: result.secure_url,
              cloudinaryId: result.public_id,
            },
          });

          return doc;
        } catch (err) {
          console.error("Cloudinary upload failed:", err);
          return doc;
        }
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