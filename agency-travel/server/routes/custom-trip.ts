import type { Request, Response } from "express";
import type { CustomTripRequest, CustomTripResponse } from "../../shared/api";
import { processCustomTrip } from "../lib/custom-trip";

export async function handleCustomTrip(
  req: Request<unknown, CustomTripResponse, CustomTripRequest>,
  res: Response<CustomTripResponse>
) {
  const result = await processCustomTrip(req.body);
  return res.status(result.status).json(result.body);
}
