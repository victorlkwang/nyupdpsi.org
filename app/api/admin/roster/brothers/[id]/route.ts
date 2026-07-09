import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseBrotherForm, requireAdminApi, saveBrotherPhoto } from "@/lib/rosterAdmin";

export const runtime = "nodejs";

// Admin-only: update a brother (multipart, optional new photo).
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const forbidden = await requireAdminApi();
  if (forbidden) return forbidden;
  const { id } = await params;

  const target = await prisma.brother.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Brother not found." }, { status: 404 });

  const { parsed, photo } = await parseBrotherForm(request);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  if (data.bigId === id) {
    return NextResponse.json({ error: "A brother can't be his own big." }, { status: 400 });
  }
  if (data.crossingNumber !== null) {
    const clash = await prisma.brother.findUnique({
      where: { crossingNumber: data.crossingNumber },
    });
    if (clash && clash.id !== id) {
      return NextResponse.json(
        { error: `Crossing number #${data.crossingNumber} is already taken.` },
        { status: 400 }
      );
    }
  }

  await prisma.brother.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName ?? null,
      pledgeName: data.pledgeName,
      classId: data.classId,
      status: data.status,
      crossingNumber: data.crossingNumber,
      gradYear: data.gradYear,
      major: data.major ?? null,
      instagram: data.instagram ?? null,
      bigId: data.bigId,
    },
  });

  if (photo) {
    try {
      await saveBrotherPhoto(id, photo);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Could not process image." },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}

// Admin-only: delete a brother. Littles are detached (bigId -> null) first so
// the foreign key doesn't block the delete; their big simply becomes empty.
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const forbidden = await requireAdminApi();
  if (forbidden) return forbidden;
  const { id } = await params;

  const target = await prisma.brother.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Brother not found." }, { status: 404 });

  await prisma.brother.updateMany({ where: { bigId: id }, data: { bigId: null } });
  await prisma.brother.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
