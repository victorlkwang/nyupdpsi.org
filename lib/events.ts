import type { RushEvent } from "@prisma/client";

// The six rush events, in display order, with human labels.
export const RUSH_EVENTS: { value: RushEvent; label: string }[] = [
  { value: "SCAVENGER_HUNT", label: "Scavenger Hunt" },
  { value: "ACTIVITY_NIGHT_KAPPAS", label: "Activity Night w/ Kappas" },
  { value: "ACTIVITY_NIGHT_SIGMAS", label: "Activity Night w/ Sigmas" },
  { value: "GAME_NIGHT", label: "Game Night" },
  { value: "GENERAL_INTEREST_MEETING", label: "General Interest Meeting" },
  { value: "ACTIVITY_NIGHT_AKDPHIS", label: "Activity Night w/ aKDPhis" },
];

export const EVENT_LABEL = Object.fromEntries(
  RUSH_EVENTS.map((e) => [e.value, e.label])
) as Record<RushEvent, string>;

export const RUSH_EVENT_VALUES = RUSH_EVENTS.map((e) => e.value) as [RushEvent, ...RushEvent[]];
