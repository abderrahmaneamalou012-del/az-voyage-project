import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import type { CollectionConfig } from "payload";

const uploadDir =
  process.env.NODE_ENV === "production"
    ? "/tmp"
    : "media";

const CLOUDINARY_URL = process.env.CLOUDINARY_URL;

let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
let apiKey = process.env.CLOUDINARY_API_KEY;
let apiSecret = process.env.CLOUDINARY_API_SECRET;

if (CLOUDINARY_URL && (!cloudName || !apiKey || !apiSecret)) {
  // CLOUDINARY_URL format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
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

const authenticated = () => true;

const asString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const inferResourceType = (mimeType: string) =>
  mimeType.startsWith("video/") ? "video" : "image";

const resolveUploadedFilePath = (filename: string): string | null => {
  if (!filename) return null;

  const candidates = [
    path.join(uploadDir, filename),
    path.resolve(process.cwd(), uploadDir, filename),
    path.resolve(process.cwd(), "media", filename),
    path.join("/tmp", filename),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
};

const getRequestFile = (req: unknown):
  | {
      path?: string;
      mimetype?: string;
    }
  | null => {
  if (!req || typeof req !== "object") return null;
  const reqAny = req as { file?: unknown };
  if (!reqAny.file || typeof reqAny.file !== "object") return null;
  return reqAny.file as { path?: string; mimetype?: string };
};

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true, 
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    disableLocalStorage: true,
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 512, position: "centre" },
      { name: "hero", width: 1920, height: 1080, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
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
      name: "cloudinaryUrl",
      type: "text",
      label: "Cloudinary URL",
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: "cloudinaryPublicId",
      type: "text",
      label: "Cloudinary Public ID",
      admin: {
        readOnly: true,
        hidden: true,
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
    afterRead: [
      ({ doc }: any) => {
        const cloudUrl = asString((doc as { cloudinaryUrl?: unknown }).cloudinaryUrl);
        const externalUrl = asString((doc as { externalUrl?: unknown }).externalUrl);

        if (cloudUrl) {
          (doc as { url?: string }).url = cloudUrl;
        } else if (externalUrl) {
          (doc as { url?: string }).url = externalUrl;
        }

        return doc;
      },
    ],
    beforeChange: [
      async ({ data, req, operation }) => {
        if (!cloudinaryConfigured) return data;

        const reqFile = (req as any).file;
        const externalUrl = asString(data.externalUrl);

        try {
          if (reqFile && reqFile.data) {
            const resourceType = inferResourceType(reqFile.mimetype || "image/");
            
            const uploadResult = await new Promise<any>((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: CLOUDINARY_FOLDER, resource_type: resourceType },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              stream.end(reqFile.data);
            });

            data.cloudinaryUrl = uploadResult.secure_url;
            data.cloudinaryPublicId = uploadResult.public_id;
            data.url = uploadResult.secure_url;
            data.filename = uploadResult.original_filename || reqFile.name;
          } else if (externalUrl && externalUrl !== "") {
            const uploadResult = await cloudinary.uploader.upload(externalUrl, {
              folder: CLOUDINARY_FOLDER,
              resource_type: "auto",
            });
            data.cloudinaryUrl = uploadResult.secure_url;
            data.cloudinaryPublicId = uploadResult.public_id;
            data.url = uploadResult.secure_url;
          }
        } catch (error) {
          req.payload.logger.error({ msg: "Cloudinary stream upload failed", error });
        }

        return data;
      },
    ],
    afterDelete: [
      async ({ doc, req }: any) => {
        if (!cloudinaryConfigured) {
          return doc;
        }

        const publicId = asString((doc as { cloudinaryPublicId?: unknown }).cloudinaryPublicId);
        if (!publicId) {
          return doc;
        }

        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
            invalidate: true,
          });
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
            invalidate: true,
          });
        } catch (error) {
          req.payload.logger.error({
            msg: "Cloudinary delete failed",
            error,
            mediaId: doc.id,
            publicId,
          });
        }

        return doc;
      },
    ],
  },
};
