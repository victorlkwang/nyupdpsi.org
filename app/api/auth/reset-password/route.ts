import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, hashToken } from "@/lib/auth";
import { ResetPasswordSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = ResetPasswordSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 }
    );
  }

  const { token, password } = parsed.data;
  const record = await prisma.verificationToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (!record || record.type !== "PASSWORD_RESET" || record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired. Please request a new one." },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({ where: { id: record.userId }, data: { passwordHash } });

  // Clean up used reset tokens and sign out everywhere for safety.
  await prisma.verificationToken.deleteMany({
    where: { userId: record.userId, type: "PASSWORD_RESET" },
  });
  await prisma.session.deleteMany({ where: { userId: record.userId } });

  return NextResponse.json({ ok: true });
}
