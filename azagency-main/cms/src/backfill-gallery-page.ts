import "dotenv/config";
import { getPayload } from "payload";
import config from "./payload.config";

const heroBackground = {
  imageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg",
  alt: "Banniere galerie",
};

const malaisieImages = [
  { imageUrl: "/assets/figma/5a02729a3418047c872b3399e3fcaaa7fd8876e1.jpg", alt: "Food by the pool" },
  { imageUrl: "/assets/figma/cf0410856b991c188fcf3b7f24a87b6fed7eb6e8.jpg", alt: "ATV adventure" },
  { imageUrl: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg", alt: "Beach resort" },
  { imageUrl: "/assets/figma/47915728ec2c232de145d04fe195c0cf46027056.jpg", alt: "City skyline" },
  { imageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg", alt: "Beach path" },
  { imageUrl: "/assets/figma/37c823577edb4dbdc73e687407625fd87908430a.jpg", alt: "Sunset pool" },
  { imageUrl: "/assets/figma/41f508fbba5d9a76394c60f6d497d92a6820690a.jpg", alt: "City street" },
  { imageUrl: "/assets/figma/59963752338377140a89306e9be22526a08262a9.jpg", alt: "Jungle trail" },
  { imageUrl: "/assets/figma/910cc56e7171f85753f9a3f9629a2e27c588c472.jpg", alt: "Kayaking" },
];

const indonesieImages = [
  { imageUrl: "/assets/figma/37c823577edb4dbdc73e687407625fd87908430a.jpg", alt: "Night view" },
  { imageUrl: "/assets/figma/47915728ec2c232de145d04fe195c0cf46027056.jpg", alt: "City lights" },
  { imageUrl: "/assets/figma/41f508fbba5d9a76394c60f6d497d92a6820690a.jpg", alt: "Street" },
  { imageUrl: "/assets/figma/b4365b4213a1ab3ed63291bf2cf4d1f00b6c6c4e.jpg", alt: "Beach" },
  { imageUrl: "/assets/figma/d1d2e746586963a4fd04eb564c23aa979fa68946.jpg", alt: "Pool sunset" },
];

const zanzibarImages = [
  { imageUrl: "/assets/figma/37c823577edb4dbdc73e687407625fd87908430a.jpg", alt: "Pool" },
  { imageUrl: "/assets/figma/d1d2e746586963a4fd04eb564c23aa979fa68946.jpg", alt: "Beach" },
  { imageUrl: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg", alt: "Resort" },
  { imageUrl: "/assets/figma/b4365b4213a1ab3ed63291bf2cf4d1f00b6c6c4e.jpg", alt: "Tropical pool" },
  { imageUrl: "/assets/figma/47915728ec2c232de145d04fe195c0cf46027056.jpg", alt: "City tower" },
  { imageUrl: "/assets/figma/910cc56e7171f85753f9a3f9629a2e27c588c472.jpg", alt: "Night resort" },
  { imageUrl: "/assets/figma/59963752338377140a89306e9be22526a08262a9.jpg", alt: "Boat" },
  { imageUrl: "/assets/figma/41f508fbba5d9a76394c60f6d497d92a6820690a.jpg", alt: "Skyline" },
  { imageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg", alt: "Trees" },
];

const toSectionSlots = (prefix: "block" | "slide", images: Array<{ imageUrl: string; alt: string }>) =>
  Object.fromEntries(
    images.map((image, index) => [
      `${prefix}${String(index + 1).padStart(2, "0")}`,
      image,
    ]),
  );

async function run() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "gallery-page",
    data: {
      hero: {
        background: heroBackground,
      },
      malaisie: toSectionSlots("block", malaisieImages),
      indonesie: toSectionSlots("slide", indonesieImages),
      zanzibar: toSectionSlots("block", zanzibarImages),
    },
  });

  console.log("Gallery page global backfilled.");
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
