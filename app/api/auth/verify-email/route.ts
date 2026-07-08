import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth";

// Target of the link in the verification email. On success it marks the email
// verified, deletes the token, and sends the user to the login page.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const redirectTo = (query: string) => NextResponse.redirect(new URL(`/login${query}`, request.url));

  if (!token) return redirectTo("?error=invalid-link");

  const record = await prisma.verificationToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (!record || record.type !== "EMAIL_VERIFICATION" || record.expiresAt < new Date()) {
    return redirectTo("?error=expired-link");
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerifiedAt: new Date() },
  });
  await prisma.verificationToken.deleteMany({
    where: { userId: record.userId, type: "EMAIL_VERIFICATION" },
  });

  return redirectTo("?verified=1");
}
