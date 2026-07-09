import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { activeRushTerm } from "@/data/rush";
import { sendRushMessage } from "@/lib/messaging";
import { normalizeNyuEmail, isValidNyuEmail } from "@/lib/normalize";

const RushApplicationSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  fullName: z.string().trim().min(1, "Full name is required.").max(200),
  // Kept loose: normalized to netid@nyu.edu below (a bare netid is fine).
  nyuEmail: z.string().trim().min(1, "Enter your NYU email address.").max(200),
  phoneNumber: z.string().trim().min(7, "Enter a valid phone number.").max(20),
  year: z.enum(["FRESHMAN", "SOPHOMORE", "JUNIOR", "SENIOR"]),
  school: z.enum(["STERN", "STEINHARDT", "CAS", "GALLATIN", "TANDON", "TISCH", "OTHER"]),
  instagramHandle: z.string().trim().max(60).optional().or(z.literal("")),
  // Honeypot: real users never see or fill this field. Accepted loosely here
  // so a bot that fills it in still gets a fake "success" instead of a 400
  // that would tip it off.
  company: z.string().optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = RushApplicationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 }
    );
  }

  const { company, instagramHandle, nyuEmail: rawNyuEmail, ...data } = parsed.data;
  if (company) {
    // Bot filled the honeypot; report success without writing anything.
    return NextResponse.json({ ok: true });
  }

  // Accept a bare netid and append @nyu.edu before storing.
  const nyuEmail = normalizeNyuEmail(rawNyuEmail);
  if (!isValidNyuEmail(nyuEmail)) {
    return NextResponse.json({ error: "Enter a valid NYU email." }, { status: 400 });
  }

  // One row per (nyuEmail, term). If an attendance-only row already exists for
  // this rushee, this interest form fills in its application details; if they've
  // already applied, it's a duplicate.
  const existing = await prisma.rushApplication.findUnique({
    where: { nyuEmail_term: { nyuEmail, term: activeRushTerm } },
  });
  if (existing && existing.year !== null) {
    return NextResponse.json(
      { error: "You've already submitted an interest form for this rush cycle." },
      { status: 409 }
    );
  }

  const fields = {
    ...data,
    nyuEmail,
    instagramHandle: instagramHandle || existing?.instagramHandle || null,
    term: activeRushTerm,
  };
  const application = existing
    ? await prisma.rushApplication.update({ where: { id: existing.id }, data: fields })
    : await prisma.rushApplication.create({ data: fields });

  // Fire the automatic thank-you email. Best-effort: a send failure must not
  // fail the submission the rushee just completed, so we only log it.
  try {
    const outcome = await sendRushMessage("THANK_YOU", application);
    if (outcome.email) {
      await prisma.rushApplication.update({
        where: { id: application.id },
        data: { thankYouSentAt: new Date() },
      });
    }
  } catch (error) {
    console.error("Failed to send thank-you email:", error);
  }

  return NextResponse.json({ ok: true });
}
