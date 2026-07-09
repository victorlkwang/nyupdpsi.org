import type { MessageKind, RushApplication } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendBasicEmail } from "@/lib/email";
import { sendSms } from "@/lib/sms";

export type TemplateContent = {
  emailSubject: string;
  emailBody: string;
  smsBody: string;
};

// Built-in defaults. Used verbatim until an admin customizes a template, and as
// a fallback if a template row is somehow missing — so messaging never breaks.
export const DEFAULT_TEMPLATES: Record<MessageKind, TemplateContent> = {
  THANK_YOU: {
    emailSubject: "Thanks for your interest in NYU Pi Delta Psi!",
    emailBody:
      "Hi {{firstName}},\n\nThanks for filling out our interest form — we're stoked you're interested in rushing NYU Pi Delta Psi! Keep an eye on your inbox and phone; we'll be in touch soon with details about our upcoming rush events.\n\n— The Brothers of Pi Delta Psi, Zeta Chapter",
    smsBody:
      "Hey {{firstName}}, thanks for your interest in NYU Pi Delta Psi! We'll reach out soon with rush event details. — PDPsi Zeta",
  },
  GOOD_KID: {
    emailSubject: "We'd love to see you at rush 👀",
    emailBody:
      "Hi {{firstName}},\n\nWe really enjoyed getting to know you and think you'd be a great fit here. We'd love to see you at our upcoming events — keep an eye out, and don't be a stranger!\n\n— The Brothers of Pi Delta Psi, Zeta Chapter",
    smsBody:
      "Hey {{firstName}}, we loved meeting you and hope to see you at our next event! — PDPsi Zeta",
  },
};

export async function getTemplate(kind: MessageKind): Promise<TemplateContent> {
  const row = await prisma.messageTemplate.findUnique({ where: { kind } });
  return row ?? DEFAULT_TEMPLATES[kind];
}

/** Substitute {{name}} and {{firstName}} into a template string. */
export function fillTemplate(text: string, app: Pick<RushApplication, "fullName">): string {
  const firstName = app.fullName.trim().split(/\s+/)[0] || app.fullName;
  return text.replace(/\{\{\s*name\s*\}\}/gi, app.fullName).replace(/\{\{\s*firstName\s*\}\}/gi, firstName);
}

export type SendOutcome = { email: boolean; sms: boolean; smsReason?: string };

/**
 * Render and send one message kind to a rushee over both channels. Best-effort:
 * a failure on one channel doesn't stop the other, and the caller decides how to
 * record the result. Email errors propagate (they're actionable); SMS failures
 * are returned as a reason since bad phone numbers are expected.
 */
export async function sendRushMessage(
  kind: MessageKind,
  app: Pick<RushApplication, "fullName" | "email" | "phoneNumber">
): Promise<SendOutcome> {
  const tpl = await getTemplate(kind);

  const email = await sendBasicEmail(
    app.email,
    fillTemplate(tpl.emailSubject, app),
    fillTemplate(tpl.emailBody, app)
  );

  const sms = await sendSms(app.phoneNumber, fillTemplate(tpl.smsBody, app));

  return { email, sms: sms.ok, smsReason: sms.ok ? undefined : sms.reason };
}
