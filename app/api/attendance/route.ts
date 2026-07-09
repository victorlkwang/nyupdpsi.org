import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { activeRushTerm } from "@/data/rush";
import { AttendanceSchema } from "@/lib/validation";
import { normalizeNyuEmail, normalizePhone, isValidNyuEmail, isValidPhone } from "@/lib/normalize";

// Public: record a check-in for whichever event is currently active. The event
// comes from the server-side setting (not the client). Attendance lives on the
// rushee's RushApplication row (created if they've never filled the interest
// form), keyed by the normalized (nyuEmail, term).
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = AttendanceSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 }
    );
  }

  const { company, name, instagramHandle } = parsed.data;
  if (company) {
    return NextResponse.json({ ok: true }); // honeypot tripped
  }

  const setting = await prisma.formSetting.findUnique({ where: { id: 1 } });
  const event = setting?.activeEvent ?? null;
  if (!event) {
    return NextResponse.json({ error: "Attendance isn't open right now." }, { status: 409 });
  }

  const nyuEmail = normalizeNyuEmail(parsed.data.nyuEmail);
  const phoneNumber = normalizePhone(parsed.data.phoneNumber);
  if (!isValidNyuEmail(nyuEmail)) {
    return NextResponse.json({ error: "Enter a valid NYU email (netid@nyu.edu)." }, { status: 400 });
  }
  if (!isValidPhone(phoneNumber)) {
    return NextResponse.json({ error: "Enter a valid 10-digit phone number." }, { status: 400 });
  }

  const handle = instagramHandle ? instagramHandle.replace(/^@/, "") : null;

  const existing = await prisma.rushApplication.findUnique({
    where: { nyuEmail_term: { nyuEmail, term: activeRushTerm } },
  });

  if (existing) {
    // Add this event (deduped) and fill in anything they hadn't given us before.
    await prisma.rushApplication.update({
      where: { id: existing.id },
      data: {
        attendedEvents: existing.attendedEvents.includes(event)
          ? existing.attendedEvents
          : { set: [...existing.attendedEvents, event] },
        instagramHandle: existing.instagramHandle ?? handle,
      },
    });
  } else {
    await prisma.rushApplication.create({
      data: {
        term: activeRushTerm,
        fullName: name,
        nyuEmail,
        phoneNumber,
        instagramHandle: handle,
        attendedEvents: [event],
      },
    });
  }

  return NextResponse.json({ ok: true });
}
