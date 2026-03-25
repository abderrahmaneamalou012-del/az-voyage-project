import "dotenv/config";
import { getPayload } from "payload";
import config from "./payload.config";
import { bookingProcessContentDefaults } from "./defaults/bookingProcessContent";

async function run() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "booking-process-content",
    data: bookingProcessContentDefaults,
  });

  console.log("Booking process content global backfilled.");
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
