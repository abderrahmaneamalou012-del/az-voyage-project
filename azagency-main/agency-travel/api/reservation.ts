import type { ReservationRequest } from "../shared/api";
import { processReservation } from "../server/lib/reservation";

type ApiRequest = {
  method?: string;
  body?: ReservationRequest | string;
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

    const result = await processReservation(parsedBody as ReservationRequest);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Error processing reservation:", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors du traitement de votre réservation.",
    });
  }
}
