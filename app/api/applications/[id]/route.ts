import { NextResponse } from "next/server";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Bros/admins can archive (soft-hide) or unarchive a response.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!hasRole(user, "BRO", "ADMIN")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const { id } = await params;

  const json = await request.json().catch(() => null);
  if (typeof json?.archived !== "boolean") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const app = await prisma.rushApplication.findUnique({ where: { id } });
  if (!app) return NextResponse.json({ error: "Response not found." }, { status: 404 });

  await prisma.rushApplication.update({
    where: { id },
    data: { archivedAt: json.archived ? new Date() : null },
  });
  return NextResponse.json({ ok: true });
}

// Bros/admins can permanently delete a response.
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!hasRole(user, "BRO", "ADMIN")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const { id } = await params;

  const app = await prisma.rushApplication.findUnique({ where: { id } });
  if (!app) return NextResponse.json({ error: "Response not found." }, { status: 404 });

  await prisma.rushApplication.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
