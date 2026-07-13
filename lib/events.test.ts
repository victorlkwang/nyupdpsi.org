import { describe, it, expect } from "vitest";
import { RUSH_EVENTS, EVENT_LABEL, RUSH_EVENT_VALUES } from "./events";

describe("rush events", () => {
  it("defines all six events", () => {
    expect(RUSH_EVENTS).toHaveLength(6);
  });

  it("maps every value to a human label", () => {
    expect(EVENT_LABEL.GAME_NIGHT).toBe("Game Night");
    expect(EVENT_LABEL.ACTIVITY_NIGHT_KAPPAS).toBe("Activity Night w/ Kappas");
    for (const { value, label } of RUSH_EVENTS) {
      expect(EVENT_LABEL[value]).toBe(label);
    }
  });

  it("exposes the values in the same order", () => {
    expect(RUSH_EVENT_VALUES).toEqual(RUSH_EVENTS.map((e) => e.value));
  });
});
