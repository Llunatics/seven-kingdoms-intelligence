import { describe, it, expect } from "vitest";
import { CanonicalDataService } from "@/services/canonicalData";
import { IntelligenceService } from "@/services/intelligenceService";

describe("CanonicalDataService pagination & filters", () => {
  it("clamps out-of-range pages instead of returning empty", () => {
    const far = CanonicalDataService.getCharacters({ page: 99999, pageSize: 24 });
    expect(far.data.length).toBeGreaterThan(0);
    expect(far.meta.page).toBe(far.meta.totalPages);
    expect(far.meta.hasNext).toBe(false);
  });

  it("handles page 0 / negative page as page 1", () => {
    const p = CanonicalDataService.getCharacters({ page: 0, pageSize: 10 });
    expect(p.meta.page).toBe(1);
    expect(p.data.length).toBe(10);
  });

  it("filters by isAlive=false to only dead characters", () => {
    const dead = CanonicalDataService.getCharacters({ isAlive: false, pageSize: 50 });
    expect(dead.data.length).toBeGreaterThan(0);
    for (const c of dead.data) expect(c.died).not.toBe("");
  });

  it("filters houses by region exactly", () => {
    const north = CanonicalDataService.getHouses({ region: "The North", pageSize: 100 });
    expect(north.data.length).toBeGreaterThan(0);
    for (const h of north.data) expect(h.region).toBe("The North");
  });

  it("returns null for unknown ids", () => {
    expect(CanonicalDataService.getCharacterById(999999)).toBeNull();
    expect(CanonicalDataService.getHouseById(999999)).toBeNull();
    expect(CanonicalDataService.getBookById(999999)).toBeNull();
  });
});

describe("Trivia generator", () => {
  it("produces 4 unique choices including the correct name", () => {
    for (let i = 0; i < 5; i++) {
      const q = CanonicalDataService.getTriviaQuestion();
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices).size).toBe(4);
      expect(q.choices).toContain(q.correctName);
      expect(q.characterId).toBe(q.correctId);
    }
  });
});

describe("Graph data", () => {
  it("builds a focused house graph with nodes and edges", () => {
    const g = CanonicalDataService.getGraphData({ focusHouseId: 362 });
    expect(g.nodes.length).toBeGreaterThan(0);
    expect(g.edges.length).toBeGreaterThan(0);
    expect(g.nodes.some((n) => n.id === "house-362")).toBe(true);
    for (const e of g.edges) {
      expect(g.nodes.some((n) => n.id === e.source)).toBe(true);
      expect(g.nodes.some((n) => n.id === e.target)).toBe(true);
    }
  });

  it("returns empty graph for unknown focus ids (no crash)", () => {
    const g = CanonicalDataService.getGraphData({ focusHouseId: 999999 });
    expect(g.nodes).toEqual([]);
    expect(g.edges).toEqual([]);
  });

  it("builds the default great-houses ecosystem", () => {
    const g = CanonicalDataService.getGraphData({});
    expect(g.nodes.length).toBeGreaterThan(5);
  });
});

describe("IntelligenceService passthrough", () => {
  it("search returns capped results", async () => {
    const r = await IntelligenceService.search("a", 5);
    expect(r.length).toBeLessThanOrEqual(5);
  });

  it("getRandomCharacter returns a named character", async () => {
    const c = await IntelligenceService.getRandomCharacter();
    expect(c.name.length).toBeGreaterThan(0);
  });
});
