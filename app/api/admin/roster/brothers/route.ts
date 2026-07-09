import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseBrotherForm, requireAdminApi, saveBrotherPhoto } from "@/lib/rosterAdmin";

export const runtime = "nodejs";

// Admin-only: create a new brother, with an optional photo upload (multipart).
export async function POST(request: Request) {
  const forbidden = await requireAdminApi();
  if (forbidden) return forbidden;

  const { parsed, photo } = await parseBrotherForm(request);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const cls = await prisma.pledgeClass.findUnique({ where: { id: data.classId } });
  if (!cls) return NextResponse.json({ error: "Class not found." }, { status: 400 });

  if (data.crossingNumber !== null) {
    const clash = await prisma.brother.findUnique({
      where: { crossingNumber: data.crossingNumber },
    });
    if (clash) {
      return NextResponse.json(
        { error: `Crossing number #${data.crossingNumber} is already taken.` },
        { status: 400 }
      );
    }
  }

  const brother = await prisma.brother.create({
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
      await saveBrotherPhoto(brother.id, photo);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Could not process image." },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ ok: true, id: brother.id });
}
