import type { CustomTripRequest } from "../shared/api.js";
import { processCustomTrip } from "../server/lib/custom-trip.js";

type ApiRequest = {
  method?: string;
  body?: CustomTripRequest | string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (data: unknown) => void;
  setHeader: (key: string, value: string) => void;
  end: () => void;
};

export default async function handler(
  req: ApiRequest,
  res: ApiResponse,
): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  try {
    const parsedBody =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body ?? {};

    const result = await processCustomTrip(parsedBody as CustomTripRequest);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Error processing custom trip:", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors du traitement de votre demande.",
    });
  }
}
