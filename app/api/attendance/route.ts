import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AttendanceSchema } from "@/lib/validation";
import { normalizeNyuEmail, normalizePhone, isValidNyuEmail, isValidPhone } from "@/lib/normalize";

// Public: record a check-in for whichever event is currently active. The event
// is taken from the server-side setting (not the client) so attendance always
// lands on the open sheet. Deduped on the normalized (event, nyuEmail, phone).
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
    return NextResponse.json(
      { error: "Attendance isn't open right now." },
      { status: 409 }
    );
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

  // Upsert on the composite identity so a rushee checking in twice is a no-op
  // (their latest name/handle just refresh).
  await prisma.eventAttendance.upsert({
    where: { event_nyuEmail_phoneNumber: { event, nyuEmail, phoneNumber } },
    create: { event, name, nyuEmail, phoneNumber, instagramHandle: handle },
    // Re-check-in refreshes the name; only overwrite the handle if a new one was
    // given, so a blank second sign-in doesn't wipe an earlier handle.
    update: { name, ...(handle ? { instagramHandle: handle } : {}) },
  });

  return NextResponse.json({ ok: true });
}
