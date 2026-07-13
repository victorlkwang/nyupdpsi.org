import { describe, it, expect } from "vitest";
import { fillTemplate } from "./template";

describe("fillTemplate", () => {
  it("substitutes the first name", () => {
    expect(fillTemplate("Hi {{firstName}}!", "Jordan Doe")).toBe("Hi Jordan!");
  });

  it("substitutes the full name", () => {
    expect(fillTemplate("Welcome, {{name}}.", "Jordan Doe")).toBe("Welcome, Jordan Doe.");
  });

  it("is case- and space-insensitive in the placeholder", () => {
    expect(fillTemplate("{{ FirstName }}", "Jordan Doe")).toBe("Jordan");
    expect(fillTemplate("{{NAME}}", "Jordan Doe")).toBe("Jordan Doe");
  });

  it("replaces every occurrence", () => {
    expect(fillTemplate("{{firstName}} {{firstName}}", "Jordan Doe")).toBe("Jordan Jordan");
  });

  it("falls back to the whole name when there's no space", () => {
    expect(fillTemplate("Hey {{firstName}}", "Cher")).toBe("Hey Cher");
  });

  it("leaves text without placeholders untouched", () => {
    expect(fillTemplate("No placeholders here", "Jordan Doe")).toBe("No placeholders here");
  });
});
