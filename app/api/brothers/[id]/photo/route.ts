import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Serves a brother's uploaded photo straight from the database. Referenced by
// Brother.photoUrl (= /api/brothers/{id}/photo) for admin-uploaded images.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const photo = await prisma.brotherPhoto.findUnique({ where: { brotherId: id } });
  if (!photo) {
    return new Response("Not found", { status: 404 });
  }

  const body = new Uint8Array(photo.data);
  return new Response(body, {
    headers: {
      "Content-Type": photo.mimeType,
      // Bytes are immutable per upload; updatedAt busts the URL via ?v= if we
      // ever add it. Cache aggressively but allow revalidation.
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Length": String(body.byteLength),
    },
  });
}
