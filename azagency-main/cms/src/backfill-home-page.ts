import "dotenv/config";
import { getPayload } from "payload";
import config from "./payload.config";

async function run() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "home-page",
    data: {
      hero: {
        sky: {
          imageUrl: "/assets/figma/sky.png",
          alt: "Ciel",
        },
        logo: {
          imageUrl: "/assets/figma/logo.png",
          alt: "AZ Voyage",
        },
        testimonialAvatar: {
          imageUrl: "/assets/figma/testimonial.png",
          alt: "Voyageur",
        },
        taj: {
          imageUrl: "/assets/figma/taj.png",
          alt: "Taj Mahal",
        },
        eiffel: {
          imageUrl: "/assets/figma/eiffel.png",
          alt: "Tour Eiffel",
        },
        petra: {
          imageUrl: "/assets/figma/petra.png",
          alt: "Pétra",
        },
        pyramids: {
          imageUrl: "/assets/figma/pyramids.png",
          alt: "Pyramides",
        },
        statue: {
          imageUrl: "/assets/figma/statue.png",
          alt: "Statue of Liberty",
        },
        colosseum: {
          imageUrl: "/assets/figma/colosseum.png",
          alt: "Colisée",
        },
        plane: {
          imageUrl: "/assets/figma/plane.png",
          alt: "Avion",
        },
      },
    },
  });

  console.log("Home page global backfilled.");
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
