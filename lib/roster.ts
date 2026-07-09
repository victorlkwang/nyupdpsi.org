import type { Brother, BrotherStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { RosterByClass, RosterMember } from "@/data/types";

/** Shown for any brother who hasn't submitted a photo. */
export const NO_PHOTO_SRC = "/images/alums/no-photo.webp";

/**
 * Alumni pages collapse every class older than this one into a single
 * "Bones & Fossils" tab to keep the tab bar manageable (there are 40+ classes
 * before it). The boundary class itself and everything newer stay as their own
 * tabs.
 */
export const ARCHIVE_BEFORE_CLASS = "Alpha Phi";
export const ARCHIVE_LABEL = "Bones & Fossils";

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
    src: b.photoUrl || NO_PHOTO_SRC,
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
export async function getRosterByStatus(
  status: BrotherStatus,
  options: { archiveAncient?: boolean } = {}
): Promise<RosterByClass> {
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

  // When archiving, every class older than ARCHIVE_BEFORE_CLASS is merged into
  // one "Bones & Fossils" bucket. Because classes are already in ascending
  // sortOrder, that bucket ends up first and accumulates in chronological order.
  const boundary = options.archiveAncient
    ? classes.find((c) => c.name === ARCHIVE_BEFORE_CLASS)?.sortOrder ?? null
    : null;

  const roster: RosterByClass = {};
  for (const c of classes) {
    if (c.brothers.length === 0) continue;
    const key = boundary !== null && c.sortOrder < boundary ? ARCHIVE_LABEL : c.name;
    roster[key] = (roster[key] ?? []).concat(c.brothers.map(toMember));
  }
  return roster;
}

export type DirectoryBrother = {
  id: string;
  number: number | null;
  name: string;
  firstName: string;
  lastName: string | null;
  pledgeName: string;
  className: string;
  status: BrotherStatus;
  gradYear: number | null;
  major: string | null;
  instagram: string | null;
  bigId: string | null;
  bigLabel: string | null;
};

/**
 * Every brother in a flat, compact shape for the searchable directory. The
 * whole roster is small (a few hundred rows), so the client receives it in one
 * payload and computes search + lineage locally.
 */
export async function getDirectory(): Promise<DirectoryBrother[]> {
  const brothers = await prisma.brother.findMany({
    orderBy: [{ crossingNumber: "asc" }, { pledgeName: "asc" }],
    include: { big: true, pledgeClass: { select: { name: true, sortOrder: true } } },
  });

  return brothers
    .slice()
    .sort((a, b) => a.pledgeClass.sortOrder - b.pledgeClass.sortOrder || (a.crossingNumber ?? 1e9) - (b.crossingNumber ?? 1e9))
    .map((b) => ({
      id: b.id,
      number: b.crossingNumber,
      name: formatName(b),
      firstName: b.firstName,
      lastName: b.lastName,
      pledgeName: b.pledgeName,
      className: b.pledgeClass.name,
      status: b.status,
      gradYear: b.gradYear,
      major: b.major,
      instagram: b.instagram,
      bigId: b.bigId,
      bigLabel: b.big ? formatName(b.big) : b.bigNameFallback,
    }));
}
