import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { RUSH_EVENTS } from "@/lib/events";

function csvEscape(value: unknown): string {
  const str = value == null ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

// Admin-only: attendance as a matrix — one row per unique rushee
// (nyuEmail, phoneNumber), with a column per event.
export async function GET() {
  const user = await getCurrentUser();
  if (!hasRole(user, "ADMIN")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const rushees = await prisma.rushApplication.findMany({
    where: { attendedEvents: { isEmpty: false }, archivedAt: null },
    orderBy: { fullName: "asc" },
  });

  const header = ["Name", "NYU Email", "Phone", "Instagram", ...RUSH_EVENTS.map((e) => e.label), "Total"];
  const rows = rushees
    .map((r) => ({ ...r, events: new Set(r.attendedEvents) }))
    .sort((a, b) => b.events.size - a.events.size)
    .map((r) =>
      [
        r.fullName,
        r.nyuEmail,
        r.phoneNumber,
        r.instagramHandle ?? "",
        ...RUSH_EVENTS.map((e) => (r.events.has(e.value) ? "Y" : "")),
        r.events.size,
      ]
        .map(csvEscape)
        .join(",")
    );

  const csv = [header.map(csvEscape).join(","), ...rows].join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="rush-attendance.csv"',
    },
  });
}
