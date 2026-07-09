import { NextResponse } from "next/server";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MessageTemplateSchema } from "@/lib/validation";

// Admin-only: save (create or update) a message template by kind.
export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!hasRole(user, "ADMIN")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = MessageTemplateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid template." },
      { status: 400 }
    );
  }

  const { kind, emailSubject, emailBody, smsBody } = parsed.data;
  await prisma.messageTemplate.upsert({
    where: { kind },
    create: { kind, emailSubject, emailBody, smsBody },
    update: { emailSubject, emailBody, smsBody },
  });
  return NextResponse.json({ ok: true });
}
