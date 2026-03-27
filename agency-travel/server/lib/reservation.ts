import type { ReservationRequest, ReservationResponse } from "../../shared/api";

interface HandlerResult<T> {
  status: number;
  body: T;
}

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const DEV_CMS_URL = "http://localhost:3001";

function hasProtocol(value: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value);
}

function normalizeOrigin(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withProtocol = hasProtocol(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

function resolveCmsBaseUrl(): string | null {
  const configured =
    process.env.CMS_URL?.trim() ||
    process.env.VITE_CMS_URL?.trim() ||
    "";

  const normalizedConfigured = configured ? normalizeOrigin(configured) : null;
  if (normalizedConfigured) {
    return normalizedConfigured;
  }

  if (!IS_PRODUCTION) {
    return DEV_CMS_URL;
  }

  return null;
}

export async function processReservation(
  request: ReservationRequest,
): Promise<HandlerResult<ReservationResponse>> {
  const {
    fullName,
    phone,
    offerTitle,
    offerId,
    selectedHotelId,
    selectedHotel,
    adults,
    children,
    totalEstimated,
    currency,
  } = request;

  if (!fullName || !phone || !selectedHotel || !adults) {
    return {
      status: 400,
      body: { success: false, message: "Champs obligatoires manquants." },
    };
  }

  const cmsUrl = resolveCmsBaseUrl();
  if (!cmsUrl) {
    return {
      status: 503,
      body: {
        success: false,
        message: "Le CMS n'est pas configuré. Définissez CMS_URL en production.",
      },
    };
  }

  try {
    const cmsResponse = await fetch(`${cmsUrl}/api/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        phone,
        offerTitle: offerTitle || "",
        offerId: offerId || "",
        ...(offerId ? { offer: offerId } : {}),
        ...(selectedHotelId ? { hotel: selectedHotelId } : {}),
        selectedHotel,
        adults,
        children: children ?? 0,
        totalEstimated: totalEstimated || "",
        currency: currency || "DZD",
        status: "new",
      }),
    });

    const cmsPayload = await cmsResponse.json().catch(async () => ({
      raw: await cmsResponse.text().catch(() => ""),
    }));

    if (!cmsResponse.ok) {
      console.error("CMS reservation create error:", cmsPayload);

      return {
        status: 502,
        body: { success: false, message: "Erreur lors de l'enregistrement." },
      };
    }

    const reservationId =
      typeof cmsPayload === "object" &&
      cmsPayload &&
      "doc" in cmsPayload &&
      cmsPayload.doc &&
      typeof cmsPayload.doc === "object" &&
      "id" in cmsPayload.doc
        ? String(cmsPayload.doc.id)
        : undefined;

    if (!reservationId) {
      console.error("CMS reservation create returned no document ID:", cmsPayload);

      return {
        status: 502,
        body: { success: false, message: "Erreur lors de l'enregistrement." },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Demande de réservation enregistrée avec succès.",
        reservationId,
      },
    };
  } catch (error) {
    console.error("Reservation route error:", error);

    return {
      status: 500,
      body: { success: false, message: "Erreur serveur." },
    };
  }
}
