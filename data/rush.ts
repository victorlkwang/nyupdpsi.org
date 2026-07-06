import type { RushTerm } from "./types";

// The rush cycle new interest-form submissions get tagged with. Update this
// at the start of each new rush cycle.
export const activeRushTerm = "Fall 2026";

// Term heading + graphics shown above the interest form. Set to null when
// there's nothing to show yet for the active cycle (the form still renders
// either way) — once new cover/date graphics exist, set this to
// { term: activeRushTerm, cover, date }.
export const currentRush: RushTerm | null = null;

export const rushArchive: RushTerm[] = [
  { term: "Spring 2026", cover: "/images/rush/sp26_cover.webp", date: "/images/rush/sp26_date.webp" },
  { term: "Fall 2025", cover: "/images/rush/fa25_cover.webp", date: "/images/rush/fa25_date.webp" },
  { term: "Spring 2025", cover: "/images/rush/sp25_cover.webp", date: "/images/rush/sp25_date.webp" },
  { term: "Fall 2024", cover: "/images/rush/fa24_cover.webp", date: "/images/rush/fa24_date.webp" },
  { term: "Spring 2024", cover: "/images/rush/sp24_cover.webp", date: "/images/rush/sp24_date.webp" },
  { term: "Fall 2023", cover: "/images/rush/fa23_cover.webp", date: "/images/rush/fa23_date.webp" },
];
