import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RUSH_EVENT_VALUES } from "@/lib/events";

// null activeEvent = show the normal rush interest form.
const Schema = z.object({ activeEvent: z.enum(RUSH_EVENT_VALUES).nullable() });

// Admin-only: choose what the public /rush form shows — the interest form, or
// one of the six event attendance sheets.
export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!hasRole(user, "ADMIN")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const parsed = Schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid selection." }, { status: 400 });
  }

  await prisma.formSetting.upsert({
    where: { id: 1 },
    create: { id: 1, activeEvent: parsed.data.activeEvent },
    update: { activeEvent: parsed.data.activeEvent },
  });
  return NextResponse.json({ ok: true });
}
