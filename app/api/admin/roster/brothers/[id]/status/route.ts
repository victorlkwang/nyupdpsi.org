import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/rosterAdmin";
import { StatusUpdateSchema } from "@/lib/validation";

// Admin-only: flip a single brother between ACTIVE and ALUMNI (the "graduate"
// action). Kept separate from the full edit form so it's a one-click toggle.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const forbidden = await requireAdminApi();
  if (forbidden) return forbidden;
  const { id } = await params;

  const json = await request.json().catch(() => null);
  const parsed = StatusUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const target = await prisma.brother.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Brother not found." }, { status: 404 });

  await prisma.brother.update({ where: { id }, data: { status: parsed.data.status } });
  return NextResponse.json({ ok: true });
}
