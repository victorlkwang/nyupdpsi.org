import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendRushMessage } from "@/lib/messaging";

export const runtime = "nodejs";

const Schema = z.object({ ids: z.array(z.string().min(1)).min(1, "Select at least one rushee.") });

// Bros/admins email the follow-up message to the selected rushees.
// Best-effort per recipient; messageSentAt is stamped for each one attempted.
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!hasRole(user, "BRO", "ADMIN")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const parsed = Schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }

  const apps = await prisma.rushApplication.findMany({ where: { id: { in: parsed.data.ids } } });

  let sent = 0;
  let failed = 0;
  for (const app of apps) {
    try {
      await sendRushMessage("GOOD_KID", app);
      await prisma.rushApplication.update({
        where: { id: app.id },
        data: { messageSentAt: new Date() },
      });
      sent++;
    } catch (error) {
      console.error(`Failed to send follow-up to ${app.id}:`, error);
      failed++;
    }
  }

  return NextResponse.json({ ok: true, sent, failed });
}
