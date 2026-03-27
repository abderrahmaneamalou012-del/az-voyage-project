import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Offers } from "./collections/Offers";
import { Destinations } from "./collections/Destinations";
import { DestinationFilters } from "./collections/DestinationFilters";
import { Hotels } from "./collections/Hotels";
import { Testimonials } from "./collections/Testimonials";
import { FAQs } from "./collections/FAQs";
import { Features } from "./collections/Features";
import { BookingSteps } from "./collections/BookingSteps";
import { Reservations } from "./collections/Reservations";
import { GalleryPage } from "./globals/GalleryPage";
import { HomePage } from "./globals/HomePage";
import { BookingProcessContent } from "./globals/BookingProcessContent";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const DEV_PAYLOAD_SECRET = "local-dev-secret";
const DEV_MONGODB_URI = "mongodb://127.0.0.1:27017/agency-travel";
const envOrigins = [
  process.env.CMS_PUBLIC_URL,
  process.env.NEXT_PUBLIC_CMS_URL,
  process.env.FRONTEND_URL,
  process.env.NEXT_PUBLIC_FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

const localOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:3003",
  "http://127.0.0.1:3003",
];

const allowedOrigins = Array.from(new Set([...localOrigins, ...envOrigins]));

function requireEnv(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value || fallback;
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Offers,
    Destinations,
    DestinationFilters,
    Hotels,
    Testimonials,
    FAQs,
    Features,
    BookingSteps,
    Reservations,
  ],
  globals: [GalleryPage, HomePage, BookingProcessContent],
  editor: lexicalEditor(),
  secret: requireEnv("PAYLOAD_SECRET", DEV_PAYLOAD_SECRET),
  db: mongooseAdapter({
    url: requireEnv("MONGODB_URI", DEV_MONGODB_URI),
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  cors: "*",
  csrf: allowedOrigins,
});