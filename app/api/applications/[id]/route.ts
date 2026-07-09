import { NextResponse } from "next/server";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Bros/admins can flag or unflag a rushee as a "good kid".
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!hasRole(user, "BRO", "ADMIN")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const { id } = await params;

  const json = await request.json().catch(() => null);
  if (typeof json?.isGoodKid !== "boolean") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const app = await prisma.rushApplication.findUnique({ where: { id } });
  if (!app) return NextResponse.json({ error: "Application not found." }, { status: 404 });

  await prisma.rushApplication.update({ where: { id }, data: { isGoodKid: json.isGoodKid } });
  return NextResponse.json({ ok: true });
}
