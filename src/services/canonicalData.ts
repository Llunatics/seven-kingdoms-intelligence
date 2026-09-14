import charactersRaw from "@/data/characters.json";
import housesRaw from "@/data/houses.json";
import booksRaw from "@/data/books.json";
import summaryRaw from "@/data/summary.json";
import {
  Character,
  House,
  Book,
  PaginatedResponse,
  SearchResult,
  AnalyticsSummary,
  TriviaQuestion,
  GraphData,
  GraphNode,
  GraphEdge,
} from "@/types/api";

const characters = charactersRaw as Character[];
const houses = housesRaw as House[];
const books = booksRaw as Book[];
const summary = summaryRaw as AnalyticsSummary;

// Indexes for O(1) lookup
const characterMap = new Map<number, Character>();
for (const c of characters) characterMap.set(c.id, c);

const houseMap = new Map<number, House>();
for (const h of houses) houseMap.set(h.id, h);

const bookMap = new Map<number, Book>();
for (const b of books) bookMap.set(b.id, b);

export interface CharacterFilterOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  culture?: string;
  gender?: string;
  isAlive?: boolean | string;
  isPov?: boolean;
  hasAllegiance?: boolean;
  sortBy?: "name" | "culture" | "booksCount" | "id";
  sortOrder?: "asc" | "desc";
}

export interface HouseFilterOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  region?: string;
  hasWords?: boolean;
  hasWeapons?: boolean;
  sortBy?: "name" | "region" | "swornCount" | "id";
  sortOrder?: "asc" | "desc";
}

export class CanonicalDataService {
  /**
   * Filter and paginate characters
   */
  static getCharacters(options: CharacterFilterOptions = {}): PaginatedResponse<Character> {
    const {
      page = 1,
      pageSize = 24,
      search = "",
      culture = "",
      gender = "",
      isAlive,
      isPov,
      hasAllegiance,
      sortBy = "name",
      sortOrder = "asc",
    } = options;

    let filtered = characters;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.aliases.some((a) => a.toLowerCase().includes(q)) ||
          c.titles.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Culture filter
    if (culture.trim()) {
      const cLower = culture.toLowerCase().trim();
      filtered = filtered.filter((c) => c.culture.toLowerCase() === cLower);
    }

    // Gender filter
    if (gender.trim()) {
      filtered = filtered.filter((c) => c.gender.toLowerCase() === gender.toLowerCase());
    }

    // Living status filter
    if (isAlive !== undefined && isAlive !== "") {
      const aliveBool = typeof isAlive === "string" ? isAlive === "true" : Boolean(isAlive);
      filtered = filtered.filter((c) => (aliveBool ? c.died === "" : c.died !== ""));
    }

    // POV Filter
    if (isPov) {
      filtered = filtered.filter((c) => c.povBookIds.length > 0);
    }

    // Allegiance filter
    if (hasAllegiance) {
      filtered = filtered.filter((c) => c.allegianceIds.length > 0);
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        // Prioritize characters that have an actual name over unnamed
        if (!a.name && b.name) return 1;
        if (a.name && !b.name) return -1;
        comparison = (a.name || a.aliases[0] || "").localeCompare(b.name || b.aliases[0] || "");
      } else if (sortBy === "culture") {
        comparison = (a.culture || "zzz").localeCompare(b.culture || "zzz");
      } else if (sortBy === "booksCount") {
        comparison = a.bookIds.length - b.bookIds.length;
      } else {
        comparison = a.id - b.id;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const validPage = Math.max(1, Math.min(page, Math.max(totalPages, 1)));
    const offset = (validPage - 1) * pageSize;
    const paginatedData = filtered.slice(offset, offset + pageSize);

    return {
      data: paginatedData,
      meta: {
        page: validPage,
        pageSize,
        total,
        totalPages,
        hasNext: validPage < totalPages,
        hasPrev: validPage > 1,
      },
    };
  }

  /**
   * Lookup single character by ID
   */
  static getCharacterById(id: number): Character | null {
    return characterMap.get(id) || null;
  }

  /**
   * Filter and paginate houses
   */
  static getHouses(options: HouseFilterOptions = {}): PaginatedResponse<House> {
    const {
      page = 1,
      pageSize = 24,
      search = "",
      region = "",
      hasWords,
      hasWeapons,
      sortBy = "name",
      sortOrder = "asc",
    } = options;

    let filtered = houses;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.words.toLowerCase().includes(q) ||
          h.seats.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Region filter
    if (region.trim()) {
      const rLower = region.toLowerCase().trim();
      filtered = filtered.filter((h) => h.region.toLowerCase() === rLower);
    }

    // Words filter
    if (hasWords) {
      filtered = filtered.filter((h) => h.words.length > 0);
    }

    // Ancestral weapons filter
    if (hasWeapons) {
      filtered = filtered.filter((h) => h.ancestralWeapons.length > 0);
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "region") {
        comparison = (a.region || "zzz").localeCompare(b.region || "zzz");
      } else if (sortBy === "swornCount") {
        comparison = a.swornMemberIds.length - b.swornMemberIds.length;
      } else {
        comparison = a.id - b.id;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const validPage = Math.max(1, Math.min(page, Math.max(totalPages, 1)));
    const offset = (validPage - 1) * pageSize;
    const paginatedData = filtered.slice(offset, offset + pageSize);

    return {
      data: paginatedData,
      meta: {
        page: validPage,
        pageSize,
        total,
        totalPages,
        hasNext: validPage < totalPages,
        hasPrev: validPage > 1,
      },
    };
  }

  /**
   * Lookup single house by ID
   */
  static getHouseById(id: number): House | null {
    return houseMap.get(id) || null;
  }

  /**
   * Get all books
   */
  static getBooks(): Book[] {
    return [...books].sort((a, b) => a.id - b.id);
  }

  /**
   * Lookup single book by ID
   */
  static getBookById(id: number): Book | null {
    return bookMap.get(id) || null;
  }

  /**
   * Global command search
   */
  static globalSearch(query: string, limit = 12): SearchResult[] {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search books
    for (const b of books) {
      if (b.name.toLowerCase().includes(q) || b.isbn.includes(q)) {
        results.push({
          id: b.id,
          type: "book",
          name: b.name,
          subtitle: `${b.numberOfPages} pages · Released ${b.released.substring(0, 4) || "Unknown"}`,
          details: b.authors.join(", "),
          url: `/books/${b.id}`,
        });
      }
    }

    // Search houses
    for (const h of houses) {
      if (
        h.name.toLowerCase().includes(q) ||
        h.words.toLowerCase().includes(q) ||
        h.seats.some((s) => s.toLowerCase().includes(q))
      ) {
        results.push({
          id: h.id,
          type: "house",
          name: h.name,
          subtitle: h.region ? `Region: ${h.region}` : "Noble House",
          details: h.words ? `"${h.words}"` : undefined,
          url: `/houses/${h.id}`,
        });
      }
    }

    // Search characters
    for (const c of characters) {
      if (
        c.name.toLowerCase().includes(q) ||
        c.aliases.some((a) => a.toLowerCase().includes(q)) ||
        c.titles.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push({
          id: c.id,
          type: "character",
          name: c.name || c.aliases[0] || `Character #${c.id}`,
          subtitle: c.culture ? `Culture: ${c.culture}` : c.gender ? `Gender: ${c.gender}` : "Personage",
          details: c.titles[0] || (c.aliases.length > 0 ? `Alias: ${c.aliases[0]}` : undefined),
          url: `/characters/${c.id}`,
        });
      }
    }

    return results.slice(0, limit);
  }

  /**
   * Analytics summary
   */
  static getAnalyticsSummary(): AnalyticsSummary {
    return summary;
  }

  /**
   * Random character generator
   */
  static getRandomCharacter(namedOnly = true): Character {
    const candidates = namedOnly ? characters.filter((c) => c.name.length > 0) : characters;
    const index = Math.floor(Math.random() * candidates.length);
    return candidates[index];
  }

  /**
   * Trivia Game Question Generator
   */
  static getTriviaQuestion(): TriviaQuestion {
    // Pick characters that have rich lore: name + culture + (allegiance or titles or books)
    const richCandidates = characters.filter(
      (c) =>
        c.name.length > 2 &&
        (c.culture.length > 0 || c.allegianceIds.length > 0 || c.titles.length > 0 || c.aliases.length > 0) &&
        c.bookIds.length > 0
    );

    const target = richCandidates[Math.floor(Math.random() * richCandidates.length)];

    const allegianceNames = target.allegianceIds
      .map((id) => houseMap.get(id)?.name)
      .filter((n): n is string => Boolean(n));

    // Generate 3 believable wrong choices from other characters
    const wrongChoices: string[] = [];
    const pool = richCandidates.filter((c) => c.id !== target.id && c.name !== target.name);

    while (wrongChoices.length < 3 && pool.length > 0) {
      const randIdx = Math.floor(Math.random() * pool.length);
      const chosen = pool.splice(randIdx, 1)[0];
      if (!wrongChoices.includes(chosen.name)) {
        wrongChoices.push(chosen.name);
      }
    }

    // Shuffle choices
    const choices = [target.name, ...wrongChoices].sort(() => Math.random() - 0.5);

    return {
      characterId: target.id,
      clues: {
        culture: target.culture || "Unknown Realm",
        gender: target.gender || "Unknown",
        allegianceNames,
        titles: target.titles.slice(0, 2),
        aliases: target.aliases.slice(0, 2),
        bookAppearancesCount: target.bookIds.length,
        actor: target.playedBy[0] || undefined,
      },
      choices,
      correctName: target.name,
      correctId: target.id,
    };
  }

  /**
   * Graph data generator for React Flow
   */
  static getGraphData(params: {
    focusHouseId?: number;
    focusCharacterId?: number;
    includeHouses?: boolean;
    includeCharacters?: boolean;
    includeBooks?: boolean;
  } = {}): GraphData {
    const {
      focusHouseId,
      focusCharacterId,
      includeHouses = true,
      includeCharacters = true,
      includeBooks = true,
    } = params;

    const nodesMap = new Map<string, GraphNode>();
    const edges: GraphEdge[] = [];

    // Helper to add nodes safely
    const addNode = (
      id: string,
      type: "character" | "house" | "book",
      entityId: number,
      label: string,
      subtitle: string,
      meta: Record<string, unknown> = {}
    ) => {
      if (!nodesMap.has(id)) {
        nodesMap.set(id, {
          id,
          type: `${type}Node`,
          data: {
            label,
            entityId,
            type,
            subtitle,
            ...meta,
          },
          position: { x: 0, y: 0 },
        });
      }
    };

    // If a specific character is focused
    if (focusCharacterId) {
      const c = characterMap.get(focusCharacterId);
      if (c) {
        const cNodeId = `char-${c.id}`;
        addNode(cNodeId, "character", c.id, c.name || c.aliases[0] || `Character #${c.id}`, c.culture || "Westeros", {
          culture: c.culture,
          titles: c.titles,
        });

        // Add allegiances (Houses)
        if (includeHouses) {
          for (const hid of c.allegianceIds.slice(0, 5)) {
            const h = houseMap.get(hid);
            if (h) {
              const hNodeId = `house-${h.id}`;
              addNode(hNodeId, "house", h.id, h.name, h.region || "Noble House", {
                region: h.region,
                words: h.words,
              });
              edges.push({
                id: `e-${cNodeId}-${hNodeId}`,
                source: cNodeId,
                target: hNodeId,
                label: "ALLEGIANCE",
              });
            }
          }
        }

        // Add Books
        if (includeBooks) {
          for (const bid of c.bookIds.slice(0, 6)) {
            const b = bookMap.get(bid);
            if (b) {
              const bNodeId = `book-${b.id}`;
              addNode(bNodeId, "book", b.id, b.name, `${b.numberOfPages} pp`, {});
              const isPov = c.povBookIds.includes(bid);
              edges.push({
                id: `e-${cNodeId}-${bNodeId}`,
                source: cNodeId,
                target: bNodeId,
                label: isPov ? "POV_IN" : "APPEARS_IN",
              });
            }
          }
        }

        // Family: Father, Mother, Spouse
        if (includeCharacters) {
          if (c.fatherId) {
            const f = characterMap.get(c.fatherId);
            if (f) {
              const fId = `char-${f.id}`;
              addNode(fId, "character", f.id, f.name, f.culture || "Father");
              edges.push({ id: `e-${fId}-${cNodeId}`, source: fId, target: cNodeId, label: "FATHER_OF" });
            }
          }
          if (c.motherId) {
            const m = characterMap.get(c.motherId);
            if (m) {
              const mId = `char-${m.id}`;
              addNode(mId, "character", m.id, m.name, m.culture || "Mother");
              edges.push({ id: `e-${mId}-${cNodeId}`, source: mId, target: cNodeId, label: "MOTHER_OF" });
            }
          }
          if (c.spouseId) {
            const s = characterMap.get(c.spouseId);
            if (s) {
              const sId = `char-${s.id}`;
              addNode(sId, "character", s.id, s.name, s.culture || "Spouse");
              edges.push({ id: `e-${cNodeId}-${sId}`, source: cNodeId, target: sId, label: "SPOUSE" });
            }
          }
        }
      }
    } else if (focusHouseId) {
      // If a specific house is focused
      const h = houseMap.get(focusHouseId);
      if (h) {
        const hNodeId = `house-${h.id}`;
        addNode(hNodeId, "house", h.id, h.name, h.region || "Noble House", {
          region: h.region,
          words: h.words,
        });

        // Current Lord
        if (h.currentLordId && includeCharacters) {
          const cl = characterMap.get(h.currentLordId);
          if (cl) {
            const clId = `char-${cl.id}`;
            addNode(clId, "character", cl.id, cl.name, "Current Lord");
            edges.push({ id: `e-${clId}-${hNodeId}`, source: clId, target: hNodeId, label: "CURRENT_LORD" });
          }
        }

        // Founder
        if (h.founderId && includeCharacters) {
          const fd = characterMap.get(h.founderId);
          if (fd) {
            const fdId = `char-${fd.id}`;
            addNode(fdId, "character", fd.id, fd.name, "Founder");
            edges.push({ id: `e-${fdId}-${hNodeId}`, source: fdId, target: hNodeId, label: "FOUNDER" });
          }
        }

        // Overlord House
        if (h.overlordId && includeHouses) {
          const ov = houseMap.get(h.overlordId);
          if (ov) {
            const ovId = `house-${ov.id}`;
            addNode(ovId, "house", ov.id, ov.name, ov.region);
            edges.push({ id: `e-${hNodeId}-${ovId}`, source: hNodeId, target: ovId, label: "OVERLORD" });
          }
        }

        // Sworn members (sample top 8)
        if (includeCharacters) {
          for (const mid of h.swornMemberIds.slice(0, 8)) {
            const member = characterMap.get(mid);
            if (member && member.name) {
              const mNodeId = `char-${member.id}`;
              addNode(mNodeId, "character", member.id, member.name, member.culture || "Sworn Member");
              edges.push({ id: `e-${mNodeId}-${hNodeId}`, source: mNodeId, target: hNodeId, label: "ALLEGIANCE" });
            }
          }
        }
      }
    } else {
      // Default Great Houses Universe Ecosystem
      // Great Houses IDs: Stark (362), Targaryen (378), Lannister (229), Baratheon (17), Greyjoy (169), Martell (285), Arryn (7), Tyrell (398), Tully (395)
      const majorHouses = [362, 378, 229, 17, 169, 285, 7, 398, 395]
        .map((id) => houseMap.get(id))
        .filter((h): h is House => Boolean(h));

      for (const h of majorHouses) {
        if (includeHouses) {
          const hNodeId = `house-${h.id}`;
          addNode(hNodeId, "house", h.id, h.name, h.region || "Great House", {
            region: h.region,
            words: h.words,
          });

          // Sample notable sworn member for each
          if (includeCharacters) {
            for (const mid of h.swornMemberIds.slice(0, 2)) {
              const m = characterMap.get(mid);
              if (m && m.name) {
                const mNodeId = `char-${m.id}`;
                addNode(mNodeId, "character", m.id, m.name, m.culture || h.region);
                edges.push({ id: `e-${mNodeId}-${hNodeId}`, source: mNodeId, target: hNodeId, label: "ALLEGIANCE" });

                // Connect to a book if available
                if (includeBooks && m.bookIds[0]) {
                  const b = bookMap.get(m.bookIds[0]);
                  if (b) {
                    const bNodeId = `book-${b.id}`;
                    addNode(bNodeId, "book", b.id, b.name, `${b.numberOfPages} pp`);
                    edges.push({ id: `e-${mNodeId}-${bNodeId}`, source: mNodeId, target: bNodeId, label: "APPEARS_IN" });
                  }
                }
              }
            }
          }
        }
      }
    }

    // Auto-layout coordinates in a radial/grid distribution for crisp initial render
    const nodes = Array.from(nodesMap.values());
    const count = nodes.length;
    const radius = Math.max(300, count * 35);
    const angleStep = (2 * Math.PI) / (count || 1);

    nodes.forEach((node, i) => {
      const angle = i * angleStep;
      // Slight jitter based on node type
      const r = node.data.type === "house" ? radius * 0.7 : node.data.type === "book" ? radius * 1.15 : radius;
      node.position = {
        x: Math.round(500 + r * Math.cos(angle)),
        y: Math.round(400 + r * Math.sin(angle)),
      };
    });

    return { nodes, edges };
  }
}
