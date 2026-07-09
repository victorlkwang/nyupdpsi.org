import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hasRole } from "@/lib/auth";

const COLUMNS = [
  "createdAt",
  "term",
  "fullName",
  "email",
  "nyuEmail",
  "phoneNumber",
  "year",
  "school",
  "instagramHandle",
  "isGoodKid",
] as const;

function csvEscape(value: unknown): string {
  const str = value == null ? "" : String(value);
  // Wrap in quotes and double any embedded quotes, per RFC 4180.
  return `"${str.replace(/"/g, '""')}"`;
}

// Bros and admins can download all rush applications as a CSV (opens in Excel /
// Google Sheets).
export async function GET() {
  const user = await getCurrentUser();
  if (!hasRole(user, "BRO", "ADMIN")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const applications = await prisma.rushApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  const header = COLUMNS.join(",");
  const rows = applications.map((app) =>
    COLUMNS.map((col) => csvEscape((app as Record<string, unknown>)[col])).join(",")
  );
  const csv = [header, ...rows].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="rush-applications.csv"',
    },
  });
}
