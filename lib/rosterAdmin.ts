import sharp from "sharp";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BrotherSchema } from "@/lib/validation";

/** 403 unless the caller is an ADMIN. Returns the response to short-circuit, or
 *  null to proceed. */
export async function requireAdminApi(): Promise<NextResponse | null> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  return null;
}

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB before processing

/**
 * Validate + normalize an uploaded image: cap dimensions and re-encode to webp
 * so stored bytes stay small and format is uniform. Throws on non-images.
 */
export async function processPhoto(file: File): Promise<Buffer> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image is too large (max 8 MB).");
  }
  const input = Buffer.from(await file.arrayBuffer());
  return sharp(input)
    .rotate() // honor EXIF orientation
    .resize(800, 800, { fit: "cover", position: "attention" })
    .webp({ quality: 82 })
    .toBuffer();
}

/**
 * Parse a multipart brother form (shared by create + update). Returns the
 * validated scalar fields plus the optional photo File.
 */
export async function parseBrotherForm(request: Request) {
  const form = await request.formData();
  const raw = Object.fromEntries(
    ["firstName", "lastName", "pledgeName", "classId", "status", "crossingNumber", "gradYear", "major", "instagram", "bigId"].map(
      (k) => [k, form.get(k) ?? undefined]
    )
  );
  const parsed = BrotherSchema.safeParse(raw);
  const photo = form.get("photo");
  return {
    parsed,
    photo: photo instanceof File && photo.size > 0 ? photo : null,
  };
}

/** Store (or replace) a brother's photo and point photoUrl at the serve route. */
export async function saveBrotherPhoto(brotherId: string, file: File): Promise<void> {
  // Prisma's Bytes maps to Uint8Array<ArrayBuffer>; wrap sharp's Node Buffer.
  const data = new Uint8Array(await processPhoto(file));
  await prisma.brotherPhoto.upsert({
    where: { brotherId },
    create: { brotherId, data, mimeType: "image/webp" },
    update: { data, mimeType: "image/webp" },
  });
  await prisma.brother.update({
    where: { id: brotherId },
    data: { photoUrl: `/api/brothers/${brotherId}/photo` },
  });
}
