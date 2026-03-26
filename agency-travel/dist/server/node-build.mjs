import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
const MAX_CHILD_AGE = 100;
const RESEND_API_URL = "https://api.resend.com/emails";
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function formatChildAge(age) {
  return `${age} ${age === 1 ? "an" : "ans"}`;
}
function resolveEmailConfig() {
  return {
    resendApiKey: process.env.RESEND_API_KEY?.trim() || process.env.API_RESEND?.trim() || "",
    recipientEmail: process.env.TRIP_RECIPIENT_EMAIL?.trim() || "",
    fromEmail: process.env.RESEND_FROM_EMAIL?.trim() || ""
  };
}
async function processCustomTrip(request) {
  const {
    fullName,
    phone,
    email,
    destinations,
    startDate,
    endDate,
    budget,
    adults,
    children,
    childAges
  } = request;
  if (!fullName || !phone || !email || !destinations?.length) {
    return {
      status: 400,
      body: { success: false, message: "Missing required fields." }
    };
  }
  const normalizedChildAges = Array.isArray(childAges) ? childAges : [];
  const childAgesAreValid = normalizedChildAges.length === children && normalizedChildAges.every(
    (age) => Number.isInteger(age) && age >= 0 && age <= MAX_CHILD_AGE
  );
  if (!childAgesAreValid) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Les âges des enfants sont obligatoires et doivent correspondre au nombre d'enfants."
      }
    };
  }
  const { resendApiKey, recipientEmail, fromEmail } = resolveEmailConfig();
  if (!resendApiKey || !recipientEmail || !fromEmail) {
    return {
      status: 503,
      body: {
        success: false,
        message: "Le service email n'est pas configuré. Définissez RESEND_API_KEY, TRIP_RECIPIENT_EMAIL et RESEND_FROM_EMAIL."
      }
    };
  }
  const html = `
    <h2>Nouvelle demande de voyage sur mesure</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:sans-serif;">
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Nom</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(fullName)}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Téléphone</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(phone)}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(email)}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Destinations</td><td style="padding:8px;border:1px solid #ddd;">${destinations.map(escapeHtml).join(", ")}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Date de départ</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(startDate || "Non spécifiée")}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Date de retour</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(endDate || "Non spécifiée")}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Budget</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(budget || "Non spécifié")} DZD</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Adultes</td><td style="padding:8px;border:1px solid #ddd;">${adults}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Enfants</td><td style="padding:8px;border:1px solid #ddd;">${children}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Âges des enfants</td><td style="padding:8px;border:1px solid #ddd;">${normalizedChildAges.length > 0 ? normalizedChildAges.map((age) => escapeHtml(formatChildAge(age))).join(", ") : "Aucun"}</td></tr>
    </table>
  `;
  try {
    const providerResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipientEmail,
        subject: `Voyage sur mesure - ${fullName}`,
        html,
        reply_to: email
      })
    });
    const providerPayload = await providerResponse.json().catch(async () => ({
      raw: await providerResponse.text().catch(() => "")
    }));
    const emailId = providerPayload && typeof providerPayload === "object" && "id" in providerPayload && typeof providerPayload.id === "string" ? providerPayload.id : void 0;
    if (!providerResponse.ok || !emailId) {
      console.error("Custom trip email provider error:", providerPayload);
      return {
        status: 502,
        body: { success: false, message: "Erreur lors de l'envoi." }
      };
    }
    return {
      status: 200,
      body: { success: true, message: "Demande envoyée avec succès." }
    };
  } catch (error) {
    console.error("Custom trip email error:", error);
    return {
      status: 500,
      body: { success: false, message: "Erreur lors de l'envoi." }
    };
  }
}
async function handleCustomTrip(req, res) {
  const result = await processCustomTrip(req.body);
  return res.status(result.status).json(result.body);
}
function hasProtocol(value) {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value);
}
function normalizeOrigin(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withProtocol = hasProtocol(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}
function resolveCmsBaseUrl() {
  const configured = process.env.CMS_URL?.trim() || process.env.VITE_CMS_URL?.trim() || "";
  const normalizedConfigured = configured ? normalizeOrigin(configured) : null;
  if (normalizedConfigured) {
    return normalizedConfigured;
  }
  return null;
}
async function processReservation(request) {
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
    currency
  } = request;
  if (!fullName || !phone || !selectedHotel || !adults) {
    return {
      status: 400,
      body: { success: false, message: "Champs obligatoires manquants." }
    };
  }
  const cmsUrl = resolveCmsBaseUrl();
  if (!cmsUrl) {
    return {
      status: 503,
      body: {
        success: false,
        message: "Le CMS n'est pas configuré. Définissez CMS_URL en production."
      }
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
        ...offerId ? { offer: offerId } : {},
        ...selectedHotelId ? { hotel: selectedHotelId } : {},
        selectedHotel,
        adults,
        children: children ?? 0,
        totalEstimated: totalEstimated || "",
        currency: currency || "DZD",
        status: "new"
      })
    });
    const cmsPayload = await cmsResponse.json().catch(async () => ({
      raw: await cmsResponse.text().catch(() => "")
    }));
    if (!cmsResponse.ok) {
      console.error("CMS reservation create error:", cmsPayload);
      return {
        status: 502,
        body: { success: false, message: "Erreur lors de l'enregistrement." }
      };
    }
    const reservationId = typeof cmsPayload === "object" && cmsPayload && "doc" in cmsPayload && cmsPayload.doc && typeof cmsPayload.doc === "object" && "id" in cmsPayload.doc ? String(cmsPayload.doc.id) : void 0;
    if (!reservationId) {
      console.error("CMS reservation create returned no document ID:", cmsPayload);
      return {
        status: 502,
        body: { success: false, message: "Erreur lors de l'enregistrement." }
      };
    }
    return {
      status: 200,
      body: {
        success: true,
        message: "Demande de réservation enregistrée avec succès.",
        reservationId
      }
    };
  } catch (error) {
    console.error("Reservation route error:", error);
    return {
      status: 500,
      body: { success: false, message: "Erreur serveur." }
    };
  }
}
async function handleReservation(req, res) {
  const result = await processReservation(req.body);
  return res.status(result.status).json(result.body);
}
function createServer() {
  const app2 = express__default();
  app2.use(cors());
  app2.use(express__default.json());
  app2.use(express__default.urlencoded({ extended: true }));
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app2.get("/api/demo", handleDemo);
  app2.post("/api/custom-trip", handleCustomTrip);
  app2.post("/api/reservation", handleReservation);
  return app2;
}
const app = createServer();
const port = process.env.PORT || 3e3;
const __dirname$1 = import.meta.dirname;
const distPath = path.join(__dirname$1, "../spa");
app.use(express.static(distPath));
app.get("/{*splat}", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
//# sourceMappingURL=node-build.mjs.map
