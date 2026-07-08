import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// The "from" address must be on a domain you've verified in Resend. Until you
// verify nyupdpsi.org, Resend's shared "onboarding@resend.dev" only delivers to
// your own account email — fine for testing, not for real users.
const FROM = process.env.EMAIL_FROM ?? "NYU PDPsi <onboarding@resend.dev>";

// Base URL used to build links in emails. Set APP_URL to your production domain
// (e.g. https://nyupdpsi.org) in DigitalOcean.
const APP_URL = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

function layout(heading: string, body: string, buttonLabel: string, buttonUrl: string): string {
  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111">
    <h1 style="font-size:20px;margin:0 0 16px">${heading}</h1>
    <p style="font-size:14px;line-height:1.6;color:#374151;margin:0 0 24px">${body}</p>
    <a href="${buttonUrl}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:9999px">${buttonLabel}</a>
    <p style="font-size:12px;line-height:1.6;color:#6b7280;margin:24px 0 0">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${buttonUrl}" style="color:#dc2626;word-break:break-all">${buttonUrl}</a>
    </p>
  </div>`;
}

async function send(to: string, subject: string, html: string, devLink: string): Promise<void> {
  if (!resend) {
    // No API key configured (e.g. local dev). Log the link so the flow is still
    // testable without actually sending anything.
    console.log(`[email] (not sent — RESEND_API_KEY unset) ${subject} -> ${to}\n[email] link: ${devLink}`);
    return;
  }
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) {
    throw new Error(`Resend failed to send email: ${error.message}`);
  }
}

export async function sendVerificationEmail(to: string, name: string, rawToken: string): Promise<void> {
  const link = `${APP_URL}/api/auth/verify-email?token=${rawToken}`;
  const html = layout(
    "Verify your email",
    `Hi ${name}, welcome to NYU Pi Delta Psi. Click the button below to verify your email address and activate your account.`,
    "Verify email",
    link
  );
  await send(to, "Verify your email — NYU Pi Delta Psi", html, link);
}

export async function sendPasswordResetEmail(to: string, name: string, rawToken: string): Promise<void> {
  const link = `${APP_URL}/reset-password?token=${rawToken}`;
  const html = layout(
    "Reset your password",
    `Hi ${name}, we received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour. If you didn't request this, you can safely ignore this email.`,
    "Reset password",
    link
  );
  await send(to, "Reset your password — NYU Pi Delta Psi", html, link);
}
