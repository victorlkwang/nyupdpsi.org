import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { RoleUpdateSchema } from "@/lib/validation";

// Admin-only: change another user's role (e.g. promote a RANDO to BRO).
export async function PATCH(request: Request) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = RoleUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 }
    );
  }

  const { userId, role } = parsed.data;
  if (userId === admin.id) {
    return NextResponse.json(
      { error: "You can't change your own role." },
      { status: 400 }
    );
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  return NextResponse.json({ ok: true });
}
