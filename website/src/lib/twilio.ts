import twilio from "twilio";

export function twilioConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER,
  );
}

export function getTwilioClient() {
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

/** Normalizes a phone number to its last 10 digits for loose matching (North America). */
export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "").slice(-10);
}

/**
 * Verifies a webhook request actually came from Twilio. Skips validation (and
 * warns) if TWILIO_AUTH_TOKEN isn't configured yet, since that's expected
 * before Twilio is wired up.
 */
export async function validateTwilioRequest(
  request: Request,
  params: Record<string, string>,
) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    console.warn("TWILIO_AUTH_TOKEN not set — skipping signature validation.");
    return true;
  }

  const signature = request.headers.get("x-twilio-signature") || "";
  return twilio.validateRequest(authToken, signature, request.url, params);
}

export async function formDataToParams(request: Request) {
  const formData = await request.formData();
  const params: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    params[key] = String(value);
  }
  return params;
}
