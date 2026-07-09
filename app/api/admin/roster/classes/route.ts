import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/rosterAdmin";
import { PledgeClassSchema } from "@/lib/validation";

// Admin-only: create a new pledge class. sortOrder is assigned automatically as
// the next value so the newest class sorts last (chronological tab order).
export async function POST(request: Request) {
  const forbidden = await requireAdminApi();
  if (forbidden) return forbidden;

  const json = await request.json().catch(() => null);
  const parsed = PledgeClassSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 }
    );
  }

  const existing = await prisma.pledgeClass.findUnique({ where: { name: parsed.data.name } });
  if (existing) {
    return NextResponse.json({ error: "A class with that name already exists." }, { status: 400 });
  }

  const last = await prisma.pledgeClass.findFirst({ orderBy: { sortOrder: "desc" } });
  const cls = await prisma.pledgeClass.create({
    data: {
      name: parsed.data.name,
      term: parsed.data.term ?? null,
      sortOrder: (last?.sortOrder ?? 0) + 1,
    },
  });
  return NextResponse.json({ ok: true, id: cls.id });
}
