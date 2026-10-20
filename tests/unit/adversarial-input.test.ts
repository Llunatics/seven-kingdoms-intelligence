// deep-5 (2026-10-20): adversarial input tests — quotes, regex metachars,
// unicode, huge/negative pagination values must never throw or leak.
import { describe, it, expect } from "vitest";
import { CanonicalDataService } from "@/services/canonicalData";

const NASTY = [
  `'"--><script>alert(1)</script>`,
  `.*+?^${"$"}()[]{}|\\`,
  "\u0000\u0001\u001b[31m",
  "\u{1F525}".repeat(500),
  "a".repeat(10000),
  "\u202e\u202d",
  "\u200b\u200c\u200d\ufeff",
  "'; DROP TABLE characters; --",
  "{{constructor.constructor('alert(1)')()}}",
  "${7*7}",
  "\uD83D\uDE00".repeat(200),
  "ſẞﬁﬂ",
  "１２３",
];

describe("adversarial search input", () => {
  it.each(NASTY)("globalSearch(%j) never throws, returns array", (q) => {
    const r = CanonicalDataService.globalSearch(q, 12);
    expect(Array.isArray(r)).toBe(true);
  });
  it("globalSearch with absurd limit stays bounded", () => {
    const r = CanonicalDataService.globalSearch("a", 1e12);
    expect(r.length).toBeLessThan(100000);
  });
  it.each(NASTY)("getCharacters search=%j never throws", (q) => {
    const r = CanonicalDataService.getCharacters({ search: q, pageSize: 24 });
    expect(r.data).toBeDefined();
    expect(Array.isArray(r.data)).toBe(true);
  });
  it("pagination abuse stays sane", () => {
    for (const pageSize of [0, -1, 1e12, NaN]) {
      const r = CanonicalDataService.getCharacters({ page: -5, pageSize });
      expect(Array.isArray(r.data)).toBe(true);
      expect(r.data.length).toBeLessThanOrEqual(3000);
    }
  });
  it("unknown sortBy does not throw", () => {
    const r = CanonicalDataService.getCharacters({ sortBy: "__xss" } as never);
    expect(Array.isArray(r.data)).toBe(true);
  });
  it("culture/gender with hostile strings never throws", () => {
    const r = CanonicalDataService.getCharacters({
      culture: `x"'><img src=x onerror=alert(1)>`,
      gender: "\u0000",
    });
    expect(Array.isArray(r.data)).toBe(true);
  });
});
