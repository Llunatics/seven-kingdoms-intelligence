import { describe, it, expect } from "vitest";
import charactersRaw from "@/data/characters.json";
import housesRaw from "@/data/houses.json";
import summaryRaw from "@/data/summary.json";
import { Character, House, AnalyticsSummary } from "@/types/api";

const characters = charactersRaw as Character[];
const houses = housesRaw as House[];
const summary = summaryRaw as AnalyticsSummary;

describe("summary.json derived stats match the canonical dataset", () => {
  it("genderDistribution matches character genders", () => {
    const counts: Record<string, number> = { Male: 0, Female: 0, Unspecified: 0 };
    for (const c of characters) {
      if (c.gender === "Male") counts.Male++;
      else if (c.gender === "Female") counts.Female++;
      else counts.Unspecified++;
    }
    const fromSummary: Record<string, number> = {};
    for (const g of summary.genderDistribution) fromSummary[g.name] = g.value;
    expect(fromSummary).toEqual(counts);
  });

  it("greatHouseSwornCounts match house swornMemberIds", () => {
    const houseByName = new Map(houses.map((h) => [h.name, h]));
    for (const entry of summary.greatHouseSwornCounts) {
      const fullName = `House ${entry.name}`;
      const house = houseByName.get(fullName);
      expect(house, `house ${fullName} should exist`).toBeDefined();
      expect(entry.members).toBe(house!.swornMemberIds.length);
    }
    expect(summary.greatHouseSwornCounts.length).toBe(9);
  });

  it("totals match dataset sizes", () => {
    expect(summary.totalCharacters).toBe(characters.length);
    expect(summary.totalHouses).toBe(houses.length);
  });
});
