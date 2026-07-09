import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatName } from "@/lib/roster";
import RosterManager, {
  type ClassData,
  type BrotherOption,
} from "@/components/admin/RosterManager";

export const metadata: Metadata = { title: "Manage Roster" };
export const dynamic = "force-dynamic";

export default async function AdminRosterPage() {
  await requireRole("ADMIN");

  const classes = await prisma.pledgeClass.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      brothers: {
        orderBy: [{ crossingNumber: "asc" }, { pledgeName: "asc" }],
        include: { big: true },
      },
    },
  });

  const classData: ClassData[] = classes.map((c) => ({
    id: c.id,
    name: c.name,
    term: c.term,
    activeCount: c.brothers.filter((b) => b.status === "ACTIVE").length,
    brothers: c.brothers.map((b) => ({
      id: b.id,
      crossingNumber: b.crossingNumber,
      firstName: b.firstName,
      lastName: b.lastName,
      pledgeName: b.pledgeName,
      status: b.status,
      major: b.major,
      gradYear: b.gradYear,
      instagram: b.instagram,
      bigId: b.bigId,
      classId: b.classId,
      hasPhoto: b.photoUrl !== null,
      bigLabel: b.big ? formatName(b.big) : b.bigNameFallback,
      name: formatName(b),
    })),
  }));

  // Flat list for the "big" dropdown, most-recent first.
  const bigOptions: BrotherOption[] = classes
    .flatMap((c) => c.brothers)
    .sort((a, b) => (b.crossingNumber ?? -1) - (a.crossingNumber ?? -1))
    .map((b) => ({
      id: b.id,
      label: `${b.crossingNumber ? `#${b.crossingNumber} ` : ""}${formatName(b)}`,
    }));

  const classOptions = classData.map((c) => ({ id: c.id, name: c.name }));

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-red-600"
      >
        <span aria-hidden="true">&larr;</span> Back to admin
      </Link>
      <h1 className="text-2xl font-extrabold text-black">Manage Roster</h1>
      <p className="mt-1 mb-6 text-sm text-gray-600">
        Add brothers and pledge classes, upload photos, edit details, and graduate active brothers
        to alumni. Littles are derived automatically from each brother&rsquo;s big.
      </p>
      <RosterManager
        classes={classData}
        classOptions={classOptions}
        bigOptions={bigOptions}
      />
    </section>
  );
}
