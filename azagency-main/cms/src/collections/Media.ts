// import type { CollectionConfig } from "payload";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const Media: CollectionConfig = {
//   slug: "media",
//   access: {
//     read: () => true,
//     create: () => true,
//     update: () => true,
//     delete: () => true,
//   },
//   hooks: {
//     beforeOperation: [
//       async ({ operation, args }) => {
//         console.log("MEDIA beforeOperation operation =", operation);
//         console.log("args.req.file exists =", Boolean(args?.req?.file));
//         console.log("args.req.files exists =", Boolean((args?.req as any)?.files));

//         if (operation !== "create") {
//           return args;
//         }

//         const fileFromReqFile = args?.req?.file;
//         const fileFromReqFiles = (args?.req as any)?.files?.file;

//         console.log("fileFromReqFile =", Boolean(fileFromReqFile));
//         console.log("fileFromReqFiles =", Boolean(fileFromReqFiles));

//         const file = fileFromReqFile || fileFromReqFiles;

//         if (!file) {
//           console.log("NO FILE FOUND IN REQUEST");
//           return args;
//         }

//         console.log("file mimetype =", file.mimetype);
//         console.log("file size =", file.size);

//         const base64 = `data:${file.mimetype};base64,${file.data.toString("base64")}`;

//         const result = await cloudinary.uploader.upload(base64, {
//           folder: "agency-travel",
//           resource_type: "auto",
//         });

//         console.log("cloudinary upload success =", result.secure_url);

//         if (!args.data) args.data = {};

//         args.data.url = result.secure_url;
//         args.data.filename = result.public_id;
//         args.data.cloudinaryId = result.public_id;
//         (args.data as any).cloudinaryUrl = result.secure_url;

//         return args;
//       },
//     ],
//   },
//   upload: {
//     disableLocalStorage: true,
//     mimeTypes: ["image/*", "video/*"],
//   },
//   fields: [
//     {
//       name: "alt",
//       type: "text",
//       required: false,
//       label: "Texte alternatif",
//     },
//     {
//       name: "cloudinaryUrl",
//       type: "text",
//       admin: { readOnly: true },
//     },
//     {
//       name: "cloudinaryId",
//       type: "text",
//       admin: { hidden: true },
//     },
//   ],
// };

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
        console.log("MEDIA beforeOperation operation =", operation);
        console.log("args.req.file exists =", Boolean(args?.req?.file));
        console.log("args.req.files exists =", Boolean((args?.req as any)?.files));

        if (operation !== "create") {
          return args;
        }

        const fileFromReqFile = args?.req?.file;
        const fileFromReqFiles = (args?.req as any)?.files?.file;

        console.log("fileFromReqFile =", Boolean(fileFromReqFile));
        console.log("fileFromReqFiles =", Boolean(fileFromReqFiles));

        const file = fileFromReqFile || fileFromReqFiles;

        if (!file) {
          console.log("NO FILE FOUND IN REQUEST");
          return args;
        }

        console.log("file mimetype =", file.mimetype);
        console.log("file size =", file.size);

        const base64 = `data:${file.mimetype};base64,${file.data.toString("base64")}`;

        const result = await cloudinary.uploader.upload(base64, {
          folder: "agency-travel",
          resource_type: "auto",
        });

        console.log("cloudinary upload success =", result.secure_url);

        if (!args.data) args.data = {};

        args.data.url = result.secure_url;
        args.data.filename = result.public_id;
        args.data.cloudinaryId = result.public_id;
        (args.data as any).cloudinaryUrl = result.secure_url;

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
