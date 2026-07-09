import { NextResponse } from "next/server";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendRushMessage } from "@/lib/messaging";

export const runtime = "nodejs";

// Bros/admins can send the "good kid" follow-up message (email + SMS) to a
// flagged rushee. Records goodKidSentAt so the UI can show it was sent.
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!hasRole(user, "BRO", "ADMIN")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const { id } = await params;

  const app = await prisma.rushApplication.findUnique({ where: { id } });
  if (!app) return NextResponse.json({ error: "Application not found." }, { status: 404 });
  if (!app.isGoodKid) {
    return NextResponse.json({ error: "Flag this rushee as a good kid first." }, { status: 400 });
  }

  let outcome;
  try {
    outcome = await sendRushMessage("GOOD_KID", app);
  } catch (error) {
    console.error("Failed to send good-kid message:", error);
    return NextResponse.json({ error: "Couldn't send the message. Try again." }, { status: 500 });
  }

  await prisma.rushApplication.update({ where: { id }, data: { goodKidSentAt: new Date() } });
  return NextResponse.json({ ok: true, email: outcome.email, sms: outcome.sms, smsReason: outcome.smsReason });
}
