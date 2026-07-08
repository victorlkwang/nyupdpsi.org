import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { ForgotPasswordSchema } from "@/lib/validation";

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = ForgotPasswordSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 }
    );
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Only send if the account exists, but always respond the same way so we
  // don't reveal which emails are registered.
  if (user) {
    const { raw, hash } = generateToken();
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        tokenHash: hash,
        type: "PASSWORD_RESET",
        expiresAt: new Date(Date.now() + RESET_TTL_MS),
      },
    });
    await sendPasswordResetEmail(email, user.name, raw);
  }

  return NextResponse.json({ ok: true });
}
