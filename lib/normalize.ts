// Normalization for the attendance "primary key" (nyuEmail, phoneNumber), so
// the same rushee is recognized no matter how they type their email or phone.

/**
 * Canonicalize an NYU email to `netid@nyu.edu`, lowercase.
 * Handles: extra spaces, any capitalization, a stray leading "@", the netid
 * alone (no domain), or a full address (the domain is forced to nyu.edu).
 * Returns "" when there's no netid to work with.
 *
 *   "  ABarry01@NYU.EDU " -> "abarry01@nyu.edu"
 *   "abarry01"            -> "abarry01@nyu.edu"
 *   "@abarry01"           -> "abarry01@nyu.edu"
 */
export function normalizeNyuEmail(raw: string): string {
  const cleaned = raw.trim().toLowerCase().replace(/\s+/g, "").replace(/^@+/, "");
  const netid = cleaned.split("@")[0];
  return netid ? `${netid}@nyu.edu` : "";
}

/**
 * Reduce a phone number to its canonical digits, dropping a US country code.
 * Handles brackets, dashes, spaces, dots, and a leading +1 / 1.
 *
 *   "(212) 555-0199"  -> "2125550199"
 *   "212-555-0199"    -> "2125550199"
 *   "+1 212.555.0199" -> "2125550199"
 */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits;
}

/** A netid@nyu.edu with a non-empty netid. */
export function isValidNyuEmail(normalized: string): boolean {
  return /^[a-z0-9._-]+@nyu\.edu$/.test(normalized);
}

/** 10-digit US number (after normalization). */
export function isValidPhone(normalized: string): boolean {
  return /^\d{10}$/.test(normalized);
}
