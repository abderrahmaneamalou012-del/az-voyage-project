type Req = {
  method?: string;
  body?: unknown;
};

type Res = {
  status: (code: number) => Res;
  json: (data: unknown) => void;
  setHeader: (key: string, value: string) => void;
  end: () => void;
};

export default async function handler(
  req: Req,
  res: Res,
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
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {};

    const {
      fullName,
      phone,
      offerTitle,
      offerId,
      selectedHotelId,
      selectedHotel,
      adults,
      children,
      childDetails,
      totalEstimated,
      currency,
    } = body;

    if (!fullName || !phone || !selectedHotel || !adults) {
      res.status(400).json({ success: false, message: "Champs obligatoires manquants." });
      return;
    }

    // Resolve CMS URL from env
    const rawCmsUrl =
      process.env.CMS_URL?.trim() ||
      process.env.VITE_CMS_URL?.trim() ||
      "";

    if (!rawCmsUrl) {
      res.status(503).json({
        success: false,
        message: "CMS non configuré. Définissez CMS_URL dans les variables d'environnement Vercel.",
      });
      return;
    }

    const cmsOrigin = rawCmsUrl.replace(/\/$/, "");

    const cmsResponse = await fetch(`${cmsOrigin}/api/reservations`, {
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
        childDetails: childDetails || undefined,
        totalEstimated: totalEstimated || "",
        currency: currency || "DZD",
        status: "new",
      }),
    });

    let cmsPayload: unknown;
    try {
      cmsPayload = await cmsResponse.json();
    } catch {
      cmsPayload = { raw: await cmsResponse.text().catch(() => "") };
    }

    if (!cmsResponse.ok) {
      console.error("CMS reservation error:", cmsPayload);
      res.status(502).json({ success: false, message: "Erreur lors de l'enregistrement de la réservation." });
      return;
    }

    const doc =
      cmsPayload &&
      typeof cmsPayload === "object" &&
      "doc" in cmsPayload &&
      (cmsPayload as { doc: unknown }).doc;

    const reservationId =
      doc && typeof doc === "object" && "id" in doc
        ? String((doc as { id: unknown }).id)
        : undefined;

    if (!reservationId) {
      console.error("CMS returned no document ID:", cmsPayload);
      res.status(502).json({ success: false, message: "Erreur lors de l'enregistrement de la réservation." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Demande de réservation enregistrée avec succès.",
      reservationId,
    });
  } catch (error) {
    console.error("Reservation handler error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur. Veuillez réessayer.",
    });
  }
}
