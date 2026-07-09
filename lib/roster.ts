import type { Brother, BrotherStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { RosterByClass, RosterMember } from "@/data/types";

/** "Daniel *GENTLE MONSTER* Sun" — the display format the gallery expects. */
export function formatName(b: {
  firstName: string;
  lastName: string | null;
  pledgeName: string;
}): string {
  return [b.firstName, b.pledgeName ? `*${b.pledgeName}*` : "", b.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function numberLabel(n: number | null): string {
  return n === null ? "" : `#${n}`;
}

type BrotherWithLinks = Brother & {
  big: Brother | null;
  littles: Brother[];
};

function toMember(b: BrotherWithLinks): RosterMember {
  const littles = b.littles
    .slice()
    .sort((a, c) => (a.crossingNumber ?? 1e9) - (c.crossingNumber ?? 1e9))
    .map(formatName);

  return {
    src: b.photoUrl || "/images/alums/incompetent.webp",
    number: numberLabel(b.crossingNumber),
    name: formatName(b),
    major: b.major ?? undefined,
    year: b.gradYear ? String(b.gradYear) : undefined,
    instagram: b.instagram ?? undefined,
    big: b.big ? formatName(b.big) : b.bigNameFallback || "N/A",
    little: littles.length ? littles.join(", ") : "N/A",
  };
}

/**
 * Roster for one status (ACTIVE / ALUMNI), grouped by pledge class in
 * chronological (sortOrder) order. Only classes that actually have a member of
 * that status are included, so the page's class tabs stay meaningful. Littles
 * are always derived from the big/little relation, regardless of the little's
 * own status.
 */
export async function getRosterByStatus(status: BrotherStatus): Promise<RosterByClass> {
  const classes = await prisma.pledgeClass.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      brothers: {
        where: { status },
        orderBy: [{ crossingNumber: "asc" }],
        include: { big: true, littles: true },
      },
    },
  });

  const roster: RosterByClass = {};
  for (const c of classes) {
    if (c.brothers.length === 0) continue;
    roster[c.name] = c.brothers.map(toMember);
  }
  return roster;
}
