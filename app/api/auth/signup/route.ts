import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken, hashPassword, isAdminEmail } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { SignupSchema } from "@/lib/validation";

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = SignupSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists. Try logging in." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const role = isAdminEmail(email) ? "ADMIN" : "RANDO";
  const user = await prisma.user.create({ data: { name, email, passwordHash, role } });

  const { raw, hash } = generateToken();
  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      tokenHash: hash,
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS),
    },
  });
  await sendVerificationEmail(email, name, raw);

  return NextResponse.json({ ok: true });
}
