// Minimal Twilio SMS sender. Uses the REST API directly (no SDK dependency) and
// no-ops with a log line when credentials aren't configured, mirroring how
// lib/email.ts behaves without a Resend key — so the messaging flow is fully
// testable locally and simply "turns on" once the TWILIO_* env vars are set in
// production.
//
// Required env vars to actually send:
//   TWILIO_ACCOUNT_SID   – starts with "AC..."
//   TWILIO_AUTH_TOKEN
//   TWILIO_FROM_NUMBER   – an SMS-capable Twilio number in E.164, e.g. +12125550123

const SID = process.env.TWILIO_ACCOUNT_SID;
const TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM = process.env.TWILIO_FROM_NUMBER;

/**
 * Best-effort E.164 normalization for the free-text phone numbers rushees type.
 * Returns null when it can't confidently produce a valid number (SMS is then
 * skipped rather than sent to a bad address).
 */
export function toE164(raw: string): string | null {
  const trimmed = raw.trim();
  if (/^\+[1-9]\d{7,14}$/.test(trimmed)) return trimmed; // already E.164
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`; // US/CA without country code
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

export type SmsResult = { ok: true } | { ok: false; reason: string };

export async function sendSms(to: string, body: string): Promise<SmsResult> {
  const normalized = toE164(to);
  if (!normalized) {
    return { ok: false, reason: `unrecognized phone number: ${to}` };
  }

  if (!SID || !TOKEN || !FROM) {
    console.log(
      `[sms] (not sent — TWILIO_* env unset) -> ${normalized}\n[sms] body: ${body}`
    );
    return { ok: false, reason: "SMS not configured" };
  }

  const params = new URLSearchParams({ To: normalized, From: FROM, Body: body });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${SID}:${TOKEN}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return { ok: false, reason: `Twilio ${res.status}: ${detail.slice(0, 200)}` };
  }
  return { ok: true };
}
