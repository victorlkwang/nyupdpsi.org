import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Admin-only: flag/unflag an account as spam and/or archive/unarchive it.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const { id } = await params;
  if (id === admin.id) {
    return NextResponse.json({ error: "You can't moderate your own account." }, { status: 400 });
  }

  const json = await request.json().catch(() => null);
  const data: { isSpam?: boolean; archivedAt?: Date | null } = {};
  if (typeof json?.isSpam === "boolean") data.isSpam = json.isSpam;
  if (typeof json?.archived === "boolean") data.archivedAt = json.archived ? new Date() : null;
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  await prisma.user.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

// Admin-only: permanently delete an account (cascades sessions + tokens).
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const { id } = await params;
  if (id === admin.id) {
    return NextResponse.json({ error: "You can't delete your own account." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
