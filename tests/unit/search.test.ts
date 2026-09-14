import { describe, it, expect } from "vitest";
import { CanonicalDataService } from "@/services/canonicalData";

describe("Global Search", () => {
  it("should return empty array for empty string", () => {
    const results = CanonicalDataService.globalSearch("");
    expect(results).toEqual([]);
  });

  it("should find characters, houses, and books by keyword", () => {
    const starkResults = CanonicalDataService.globalSearch("Stark");
    expect(starkResults.length).toBeGreaterThan(0);
    const types = starkResults.map((r) => r.type);
    expect(types).toContain("house");
    expect(types).toContain("character");
  });

  it("should find book by title", () => {
    const results = CanonicalDataService.globalSearch("Thrones");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.type === "book" && r.name === "A Game of Thrones")).toBe(true);
  });

  it("should match aliases", () => {
    const results = CanonicalDataService.globalSearch("Hodor");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.type === "character" && (r.name === "Walder" || r.subtitle.includes("Hodor")))).toBe(true);
  });
});
