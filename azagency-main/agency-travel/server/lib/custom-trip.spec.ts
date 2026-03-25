import { afterEach, describe, expect, it, vi } from "vitest";
import { processCustomTrip } from "./custom-trip";

const sendEmail = vi.fn();

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: sendEmail,
    },
  })),
}));

const validRequest = {
  fullName: "Amine Benali",
  phone: "+213600000000",
  email: "amine@example.com",
  destinations: ["Istanbul"],
  startDate: "2026-05-10",
  endDate: "2026-05-17",
  budget: "120000",
  adults: 2,
  children: 1,
  childAges: [4],
};

describe("processCustomTrip", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("returns 503 when RESEND_API_KEY is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("API_RESEND", "");
    vi.stubEnv("TRIP_RECIPIENT_EMAIL", "sales@example.com");

    const result = await processCustomTrip(validRequest);

    expect(result.status).toBe(503);
    expect(result.body.success).toBe(false);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("sends the request to the default recipient email when TRIP_RECIPIENT_EMAIL is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("API_RESEND", "");
    vi.stubEnv("TRIP_RECIPIENT_EMAIL", "");
    vi.stubEnv("RESEND_FROM_EMAIL", "AZ Voyage <devis@az-voyage.com>");
    sendEmail.mockResolvedValue({
      data: { id: "email_123" },
      error: null,
      headers: null,
    });

    const result = await processCustomTrip(validRequest);

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "AZ Voyage <devis@az-voyage.com>",
        to: "devisaz.off@gmail.com",
        replyTo: "amine@example.com",
      }),
    );
  });

  it("returns 400 when child ages do not match the number of children", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("API_RESEND", "");
    vi.stubEnv("TRIP_RECIPIENT_EMAIL", "sales@example.com");

    const result = await processCustomTrip({
      ...validRequest,
      childAges: [],
    });

    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 400 when a child age is higher than 100", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("API_RESEND", "");
    vi.stubEnv("TRIP_RECIPIENT_EMAIL", "sales@example.com");

    const result = await processCustomTrip({
      ...validRequest,
      childAges: [101],
    });

    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 502 when Resend reports a provider error", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("API_RESEND", "");
    vi.stubEnv("TRIP_RECIPIENT_EMAIL", "sales@example.com");
    sendEmail.mockResolvedValue({
      data: null,
      error: {
        statusCode: 401,
        name: "validation_error",
        message: "API key is invalid",
      },
      headers: null,
    });

    const result = await processCustomTrip(validRequest);

    expect(result.status).toBe(502);
    expect(result.body.success).toBe(false);
  });

  it("sends the request to the configured recipient email", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("API_RESEND", "");
    vi.stubEnv("TRIP_RECIPIENT_EMAIL", "devis@example.com");
    vi.stubEnv("RESEND_FROM_EMAIL", "AZ Voyage <devis@az-voyage.com>");
    sendEmail.mockResolvedValue({
      data: { id: "email_123" },
      error: null,
      headers: null,
    });

    const result = await processCustomTrip(validRequest);

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "AZ Voyage <devis@az-voyage.com>",
        to: "devis@example.com",
        replyTo: "amine@example.com",
        subject: "Voyage sur mesure - Amine Benali",
        html: expect.stringContaining("4 ans"),
      }),
    );
  });
});
