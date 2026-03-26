import { Resend } from "resend";
import type { CustomTripRequest, CustomTripResponse } from "../../shared/api.js";

interface HandlerResult<T> {
  status: number;
  body: T;
}

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const MAX_CHILD_AGE = 100;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatChildAge(age: number): string {
  return `${age} ${age === 1 ? "an" : "ans"}`;
}

function resolveEmailConfig() {
  return {
    resendApiKey:
      process.env.RESEND_API_KEY?.trim() || process.env.API_RESEND?.trim() || "",
    recipientEmail: process.env.TRIP_RECIPIENT_EMAIL?.trim() || "",
    fromEmail: process.env.RESEND_FROM_EMAIL?.trim() || "",
  };
}

export async function processCustomTrip(
  request: CustomTripRequest,
): Promise<HandlerResult<CustomTripResponse>> {
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
    childAges,
  } = request;

  if (!fullName || !phone || !email || !destinations?.length) {
    return {
      status: 400,
      body: { success: false, message: "Missing required fields." },
    };
  }

  const normalizedChildAges = Array.isArray(childAges) ? childAges : [];
  const childAgesAreValid =
    normalizedChildAges.length === children &&
    normalizedChildAges.every(
      (age) => Number.isInteger(age) && age >= 0 && age <= MAX_CHILD_AGE,
    );

  if (!childAgesAreValid) {
    return {
      status: 400,
      body: {
        success: false,
        message:
          "Les âges des enfants sont obligatoires et doivent correspondre au nombre d'enfants.",
      },
    };
  }

  const { resendApiKey, recipientEmail, fromEmail } = resolveEmailConfig();

  if (!resendApiKey || !recipientEmail || !fromEmail) {
    const missingConfig = {
      RESEND_API_KEY: !resendApiKey,
      TRIP_RECIPIENT_EMAIL: !recipientEmail,
      RESEND_FROM_EMAIL: !fromEmail,
    };

    if (!IS_PRODUCTION) {
      console.warn("Custom trip email skipped in local mode. Missing config:", missingConfig);
      console.log("Custom trip request:", JSON.stringify(request, null, 2));

      return {
        status: 200,
        body: {
          success: true,
          message:
            "Demande enregistrée localement. La configuration email sera fournie en production.",
        },
      };
    }

    return {
      status: 503,
      body: {
        success: false,
        message:
          "Le service email n'est pas configuré. Définissez RESEND_API_KEY, TRIP_RECIPIENT_EMAIL et RESEND_FROM_EMAIL.",
      },
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
    const resend = new Resend(resendApiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      subject: `Voyage sur mesure - ${fullName}`,
      html,
      reply_to: email,
    });

    if (error) {
      console.error("Custom trip email provider error:", {
        error,
        config: { from: fromEmail, to: recipientEmail },
      });

      return {
        status: 502,
        body: {
          success: false,
          message: `Erreur Resend: ${error.message || "Problème d'envoi"}`,
        },
      };
    }

    return {
      status: 200,
      body: { success: true, message: "Demande envoyée avec succès." },
    };
  } catch (err) {
    console.error("Custom trip email error:", err);

    return {
      status: 500,
      body: { success: false, message: "Erreur serveur lors de l'envoi." },
    };
  }
}
