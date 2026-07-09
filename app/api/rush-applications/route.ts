import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { activeRushTerm } from "@/data/rush";
import { sendRushMessage } from "@/lib/messaging";

const RushApplicationSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  fullName: z.string().trim().min(1, "Full name is required.").max(200),
  nyuEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address.")
    .refine((value) => value.endsWith("nyu.edu"), "Enter your NYU email address."),
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

  const { company, instagramHandle, ...data } = parsed.data;
  if (company) {
    // Bot filled the honeypot; report success without writing anything.
    return NextResponse.json({ ok: true });
  }

  let application;
  try {
    application = await prisma.rushApplication.create({
      data: {
        ...data,
        instagramHandle: instagramHandle || null,
        term: activeRushTerm,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "You've already submitted an interest form for this rush cycle." },
        { status: 409 }
      );
    }
    console.error("Failed to save rush application:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  // Fire the automatic thank-you (email + SMS). Best-effort: a messaging failure
  // must not fail the submission the rushee just completed, so we only log it.
  try {
    const outcome = await sendRushMessage("THANK_YOU", application);
    if (outcome.email) {
      await prisma.rushApplication.update({
        where: { id: application.id },
        data: { thankYouSentAt: new Date() },
      });
    }
    if (!outcome.sms && outcome.smsReason) {
      console.warn(`Thank-you SMS not sent for ${application.id}: ${outcome.smsReason}`);
    }
  } catch (error) {
    console.error("Failed to send thank-you message:", error);
  }

  return NextResponse.json({ ok: true });
}
