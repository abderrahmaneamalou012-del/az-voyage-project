import "dotenv/config";
import { getPayload } from "payload";
import config from "./payload.config";
import { offerDetailSidebarTestOffers } from "./defaults/offerDetailSidebarTestOffers";

async function upsertTestOffer(
  payload: Awaited<ReturnType<typeof getPayload>>,
  offer: (typeof offerDetailSidebarTestOffers)[number],
) {
  const existing = await payload.find({
    collection: "offers",
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: offer.slug,
      },
    },
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: "offers",
      id: existing.docs[0].id,
      data: offer as never,
    });
    console.log(`Updated offer: ${offer.slug}`);
    return;
  }

  await payload.create({
    collection: "offers",
    data: offer as never,
  });
  console.log(`Created offer: ${offer.slug}`);
}

async function run() {
  const payload = await getPayload({ config });

  for (const offer of offerDetailSidebarTestOffers) {
    await upsertTestOffer(payload, offer);
  }

  console.log("Offer detail sidebar test offers synced.");
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
