/** Substitute {{name}} and {{firstName}} (case- and space-insensitive) into a
 *  message template. Kept dependency-free so it's cheap to unit-test. */
export function fillTemplate(text: string, fullName: string): string {
  const firstName = fullName.trim().split(/\s+/)[0] || fullName;
  return text
    .replace(/\{\{\s*name\s*\}\}/gi, fullName)
    .replace(/\{\{\s*firstName\s*\}\}/gi, firstName);
}
