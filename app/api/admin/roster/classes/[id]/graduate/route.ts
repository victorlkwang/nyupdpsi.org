import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/rosterAdmin";

// Admin-only: graduate an entire class at once — set every ACTIVE brother in it
// to ALUMNI. Big/little links are untouched.
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const forbidden = await requireAdminApi();
  if (forbidden) return forbidden;
  const { id } = await params;

  const cls = await prisma.pledgeClass.findUnique({ where: { id } });
  if (!cls) return NextResponse.json({ error: "Class not found." }, { status: 404 });

  const result = await prisma.brother.updateMany({
    where: { classId: id, status: "ACTIVE" },
    data: { status: "ALUMNI" },
  });
  return NextResponse.json({ ok: true, graduated: result.count });
}
