import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import type { CollectionConfig } from "payload";

const CLOUDINARY_URL = process.env.CLOUDINARY_URL;

let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
let apiKey = process.env.CLOUDINARY_API_KEY;
let apiSecret = process.env.CLOUDINARY_API_SECRET;

if (CLOUDINARY_URL && (!cloudName || !apiKey || !apiSecret)) {
  const regex = /cloudinary:\/\/([^:]+):([^@]+)@(.+)/;
  const match = CLOUDINARY_URL.match(regex);
  if (match) {
    apiKey = match[1];
    apiSecret = match[2];
    cloudName = match[3];
  }
}

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "azagency";

const cloudinaryConfigured = Boolean(cloudName) && Boolean(apiKey) && Boolean(apiSecret);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

const asString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const inferResourceType = (mimeType: string) =>
  mimeType.startsWith("video/") ? "video" : "image";

const readRequestFile = async (reqFile: any) => {
  if (!reqFile) return null;
  if (reqFile.data) return reqFile.data;
  if (reqFile.path) {
    const resolvedPath = path.isAbsolute(reqFile.path)
      ? reqFile.path
      : path.resolve(process.cwd(), reqFile.path);
    return fs.promises.readFile(resolvedPath);
  }
  return null;
};

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  upload: {
    disableLocalStorage: true,
    mimeTypes: ["image/*", "video/*"],
  },
  fields: [
    {
      name: "externalUrl",
      type: "text",
      label: "URL du media (optionnel)",
      admin: {
        description: "Collez une URL d'image/video si vous ne telechargez pas de fichier.",
      },
    },
    {
      name: "alt",
      type: "text",
      required: false,
      label: "Texte alternatif",
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!cloudinaryConfigured) return data;

        const reqFile = (req as any).file;
        const externalUrl = asString(data.externalUrl);

        if (!reqFile && !externalUrl) return data;

        try {
          if (reqFile) {
            const fileBuffer = await readRequestFile(reqFile);
            if (fileBuffer) {
              const resourceType = inferResourceType(reqFile.mimetype || "image/");

              const uploadResult = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { folder: CLOUDINARY_FOLDER, resource_type: resourceType },
                  (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                  }
                );

                stream.end(fileBuffer);
              });

              data.cloudinaryUrl = uploadResult.secure_url;
              data.cloudinaryPublicId = uploadResult.public_id;
              data.url = uploadResult.secure_url;
              data.filename = uploadResult.original_filename || reqFile.originalname || reqFile.filename;
            }
          } else if (externalUrl) {
            const uploadResult = await cloudinary.uploader.upload(externalUrl, {
              folder: CLOUDINARY_FOLDER,
              resource_type: "auto",
            });
            data.cloudinaryUrl = uploadResult.secure_url;
            data.cloudinaryPublicId = uploadResult.public_id;
            data.url = uploadResult.secure_url;
          }
        } catch (error) {
          req.payload.logger.error({ msg: "Cloudinary upload failed", error });
          throw new Error("Cloudinary upload failed");
        }

        return data;
      },
    ],
  },
};
