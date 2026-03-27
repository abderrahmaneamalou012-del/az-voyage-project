import type { Request, Response } from "express";
import type { ReservationRequest, ReservationResponse } from "../../shared/api";
import { processReservation } from "../lib/reservation";

export async function handleReservation(
  req: Request<unknown, ReservationResponse, ReservationRequest>,
  res: Response<ReservationResponse>
) {
  const result = await processReservation(req.body);
  return res.status(result.status).json(result.body);
}
