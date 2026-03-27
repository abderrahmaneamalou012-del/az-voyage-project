import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleCustomTrip } from "./routes/custom-trip";
import { handleReservation } from "./routes/reservation";

export function createServer() {
  const app = express();

  
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/custom-trip", handleCustomTrip);
  app.post("/api/reservation", handleReservation);

  return app;
}
