import { describe, it, expect } from "vitest";
import { normalizeNyuEmail, normalizePhone, isValidNyuEmail, isValidPhone } from "./normalize";

describe("normalizeNyuEmail", () => {
  it("lowercases and trims a full address", () => {
    expect(normalizeNyuEmail("  ABarry01@NYU.EDU ")).toBe("abarry01@nyu.edu");
  });

  it("appends the domain to a bare netid", () => {
    expect(normalizeNyuEmail("abarry01")).toBe("abarry01@nyu.edu");
  });

  it("strips a stray leading @", () => {
    expect(normalizeNyuEmail("@abarry01")).toBe("abarry01@nyu.edu");
  });

  it("removes internal spaces", () => {
    expect(normalizeNyuEmail("ab arry01")).toBe("abarry01@nyu.edu");
  });

  it("forces the nyu.edu domain even if another is given", () => {
    expect(normalizeNyuEmail("abarry01@gmail.com")).toBe("abarry01@nyu.edu");
  });

  it("keeps dotted netids", () => {
    expect(normalizeNyuEmail("first.last@nyu.edu")).toBe("first.last@nyu.edu");
  });

  it("returns empty when there is no netid", () => {
    expect(normalizeNyuEmail("")).toBe("");
    expect(normalizeNyuEmail("@")).toBe("");
  });
});

describe("normalizePhone", () => {
  it("strips brackets, spaces, and dashes", () => {
    expect(normalizePhone("(212) 555-0199")).toBe("2125550199");
    expect(normalizePhone("212-555-0199")).toBe("2125550199");
  });

  it("drops a leading US country code and dots/plus", () => {
    expect(normalizePhone("+1 212.555.0199")).toBe("2125550199");
    expect(normalizePhone("12125550199")).toBe("2125550199");
  });

  it("passes through an already-clean 10-digit number", () => {
    expect(normalizePhone("2125550199")).toBe("2125550199");
  });
});

describe("validation", () => {
  it("accepts a proper NYU email", () => {
    expect(isValidNyuEmail("abarry01@nyu.edu")).toBe(true);
    expect(isValidNyuEmail("first.last@nyu.edu")).toBe(true);
  });

  it("rejects non-NYU or empty-netid addresses", () => {
    expect(isValidNyuEmail("abarry01@gmail.com")).toBe(false);
    expect(isValidNyuEmail("@nyu.edu")).toBe(false);
    expect(isValidNyuEmail("")).toBe(false);
  });

  it("accepts exactly ten digits", () => {
    expect(isValidPhone("2125550199")).toBe(true);
  });

  it("rejects wrong-length numbers", () => {
    expect(isValidPhone("212555019")).toBe(false); // 9
    expect(isValidPhone("12125550199")).toBe(false); // 11
    expect(isValidPhone("")).toBe(false);
  });

  it("round-trips: normalize then validate", () => {
    expect(isValidNyuEmail(normalizeNyuEmail("ABarry01"))).toBe(true);
    expect(isValidPhone(normalizePhone("(212) 555-0199"))).toBe(true);
  });
});
