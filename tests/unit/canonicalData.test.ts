import { describe, it, expect } from "vitest";
import { CanonicalDataService } from "@/services/canonicalData";

describe("CanonicalDataService", () => {
  it("should have exactly 12 canonical books", () => {
    const books = CanonicalDataService.getBooks();
    expect(books).toHaveLength(12);
    expect(books[0].name).toBe("A Game of Thrones");
    expect(books[0].numberOfPages).toBeGreaterThan(600);
  });

  it("should find Jon Snow with correct allegiances and books", () => {
    const jon = CanonicalDataService.getCharacterById(583);
    expect(jon).toBeDefined();
    expect(jon?.name).toBe("Jon Snow");
    expect(jon?.gender).toBe("Male");
    expect(jon?.culture).toBe("Northmen");
    expect(jon?.aliases).toContain("Lord Snow");
    expect(jon?.allegianceIds).toContain(362); // House Stark
  });

  it("should find House Stark with correct motto and seats", () => {
    const stark = CanonicalDataService.getHouseById(362);
    expect(stark).toBeDefined();
    expect(stark?.name).toBe("House Stark of Winterfell");
    expect(stark?.words).toBe("Winter is Coming");
    expect(stark?.region).toBe("The North");
    expect(stark?.seats.some((s) => s.includes("Winterfell"))).toBe(true);
    expect(stark?.ancestralWeapons).toContain("Ice");
  });

  it("should filter characters by culture", () => {
    const res = CanonicalDataService.getCharacters({ culture: "Valyrian", pageSize: 50 });
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data.every((c) => c.culture === "Valyrian")).toBe(true);
  });

  it("should search characters by keyword (e.g. Stark, Jon)", () => {
    const res = CanonicalDataService.getCharacters({ search: "Stark", pageSize: 24 });
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.meta.total).toBeGreaterThan(0);
    expect(res.data.some((c) => c.name.includes("Stark"))).toBe(true);
  });

  it("should search houses by keyword (e.g. Stark, Winterfell)", () => {
    const res = CanonicalDataService.getHouses({ search: "Stark", pageSize: 24 });
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.meta.total).toBeGreaterThan(0);
    expect(res.data.some((h) => h.name.includes("Stark"))).toBe(true);
  });

  it("should filter houses by region", () => {
    const res = CanonicalDataService.getHouses({ region: "Dorne", pageSize: 50 });
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data.every((h) => h.region === "Dorne")).toBe(true);
  });

  it("should generate graph data with connected nodes and edges", () => {
    const graph = CanonicalDataService.getGraphData({ focusHouseId: 362 });
    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(graph.edges.length).toBeGreaterThan(0);
    expect(graph.nodes.some((n) => n.data.label.includes("Stark"))).toBe(true);
  });

  it("should generate a valid trivia question with 4 choices", () => {
    const trivia = CanonicalDataService.getTriviaQuestion();
    expect(trivia.characterId).toBeGreaterThan(0);
    expect(trivia.choices).toHaveLength(4);
    expect(trivia.choices).toContain(trivia.correctName);
    expect(trivia.clues.culture).toBeDefined();
  });
});
