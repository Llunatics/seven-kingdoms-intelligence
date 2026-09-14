import { cache } from "@/lib/cache";
import { CanonicalDataService } from "./canonicalData";
import { Character, House, Book, PaginatedResponse } from "@/types/api";

const BASE_URL = process.env.ICE_AND_FIRE_API_URL || "https://anapioficeandfire.com/api";
const TIMEOUT_MS = 3500; // 3.5s timeout for fast failover

export class IceAndFireClient {
  private static async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "User-Agent": "SevenKingdomsIntelligence/1.0",
          Accept: "application/json",
          ...(options.headers || {}),
        },
      });
      return response;
    } finally {
      clearTimeout(id);
    }
  }

  /**
   * Fetch paginated characters from external API or fallback to canonical data
   */
  static async getCharacters(params: {
    page?: number;
    pageSize?: number;
    name?: string;
    culture?: string;
    gender?: string;
    isAlive?: boolean | string;
    isPov?: boolean;
    hasAllegiance?: boolean;
    sortBy?: "name" | "culture" | "booksCount" | "id";
    sortOrder?: "asc" | "desc";
  } = {}): Promise<PaginatedResponse<Character>> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 24;
    const cacheKey = `api:characters:${JSON.stringify(params)}`;

    const cached = cache.get<PaginatedResponse<Character>>(cacheKey);
    if (cached) return cached;

    // If searching by keyword or using any filters, use CanonicalDataService directly.
    // The external Ice and Fire API only supports strict exact equality for ?name=
    // (meaning searching "Stark" or "Jon" returns [] on external API because full names are "Eddard Stark", "Jon Snow").
    if (
      params.name ||
      params.culture ||
      params.gender ||
      params.isAlive !== undefined ||
      params.isPov ||
      params.hasAllegiance ||
      params.sortBy
    ) {
      const result = CanonicalDataService.getCharacters({
        page,
        pageSize,
        search: params.name,
        culture: params.culture,
        gender: params.gender,
        isAlive: params.isAlive,
        isPov: params.isPov,
        hasAllegiance: params.hasAllegiance,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      });

      cache.set(cacheKey, result, 3600);
      return result;
    }

    // High-performance canonical engine fallback
    const result = CanonicalDataService.getCharacters({
      page,
      pageSize,
      search: params.name,
      culture: params.culture,
      gender: params.gender,
      isAlive: params.isAlive,
      isPov: params.isPov,
      hasAllegiance: params.hasAllegiance,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    });

    cache.set(cacheKey, result, 3600);
    return result;
  }

  /**
   * Fetch single character by ID
   */
  static async getCharacterById(id: number): Promise<Character | null> {
    const cacheKey = `api:character:${id}`;
    const cached = cache.get<Character>(cacheKey);
    if (cached) return cached;

    const canonical = CanonicalDataService.getCharacterById(id);

    try {
      const res = await this.fetchWithTimeout(`${BASE_URL}/characters/${id}`);
      if (res.ok) {
        const item = await res.json();
        const fatherId = item.father
          ? parseInt(item.father.split("/").pop() || "0", 10)
          : (canonical?.fatherId ?? null);
        const motherId = item.mother
          ? parseInt(item.mother.split("/").pop() || "0", 10)
          : (canonical?.motherId ?? null);
        const spouseId = item.spouse
          ? parseInt(item.spouse.split("/").pop() || "0", 10)
          : (canonical?.spouseId ?? null);

        const character: Character = {
          ...canonical,
          ...item,
          id,
          father: item.father || (fatherId ? `${BASE_URL}/characters/${fatherId}` : ""),
          fatherId,
          mother: item.mother || (motherId ? `${BASE_URL}/characters/${motherId}` : ""),
          motherId,
          spouse: item.spouse || (spouseId ? `${BASE_URL}/characters/${spouseId}` : ""),
          spouseId,
          allegianceIds: (item.allegiances && item.allegiances.length > 0)
            ? item.allegiances.map((u: string) => parseInt(u.split("/").pop() || "0", 10))
            : (canonical?.allegianceIds || []),
          bookIds: (item.books && item.books.length > 0)
            ? item.books.map((u: string) => parseInt(u.split("/").pop() || "0", 10))
            : (canonical?.bookIds || []),
          povBookIds: (item.povBooks && item.povBooks.length > 0)
            ? item.povBooks.map((u: string) => parseInt(u.split("/").pop() || "0", 10))
            : (canonical?.povBookIds || []),
        };
        cache.set(cacheKey, character, 86400);
        return character;
      }
    } catch {
      // Remote timeout or network drop - fallback
    }

    if (canonical) {
      cache.set(cacheKey, canonical, 86400);
      return canonical;
    }
    return null;
  }

  /**
   * Fetch paginated houses
   */
  static async getHouses(params: {
    page?: number;
    pageSize?: number;
    name?: string;
    region?: string;
    hasWords?: boolean;
    hasWeapons?: boolean;
    sortBy?: "name" | "region" | "swornCount" | "id";
    sortOrder?: "asc" | "desc";
  } = {}): Promise<PaginatedResponse<House>> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 24;
    const cacheKey = `api:houses:${JSON.stringify(params)}`;

    const cached = cache.get<PaginatedResponse<House>>(cacheKey);
    if (cached) return cached;

    // If searching by keyword or using any filters, use CanonicalDataService directly.
    // The external API only supports exact equality on ?name=, meaning searching "Stark"
    // returns [] on external API because full name is "House Stark of Winterfell".
    if (params.name || params.region || params.hasWords || params.hasWeapons || params.sortBy) {
      const result = CanonicalDataService.getHouses({
        page,
        pageSize,
        search: params.name,
        region: params.region,
        hasWords: params.hasWords,
        hasWeapons: params.hasWeapons,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      });

      cache.set(cacheKey, result, 3600);
      return result;
    }

    const result = CanonicalDataService.getHouses({
      page,
      pageSize,
      search: params.name,
      region: params.region,
      hasWords: params.hasWords,
      hasWeapons: params.hasWeapons,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    });

    cache.set(cacheKey, result, 3600);
    return result;
  }

  /**
   * Fetch single house by ID
   */
  static async getHouseById(id: number): Promise<House | null> {
    const cacheKey = `api:house:${id}`;
    const cached = cache.get<House>(cacheKey);
    if (cached) return cached;

    const canonical = CanonicalDataService.getHouseById(id);

    try {
      const res = await this.fetchWithTimeout(`${BASE_URL}/houses/${id}`);
      if (res.ok) {
        const item = await res.json();
        const currentLordId = item.currentLord
          ? parseInt(item.currentLord.split("/").pop() || "0", 10)
          : (canonical?.currentLordId ?? null);
        const heirId = item.heir
          ? parseInt(item.heir.split("/").pop() || "0", 10)
          : (canonical?.heirId ?? null);
        const overlordId = item.overlord
          ? parseInt(item.overlord.split("/").pop() || "0", 10)
          : (canonical?.overlordId ?? null);
        const founderId = item.founder
          ? parseInt(item.founder.split("/").pop() || "0", 10)
          : (canonical?.founderId ?? null);

        const house: House = {
          ...canonical,
          ...item,
          id,
          words: item.words || canonical?.words || "",
          coatOfArms: item.coatOfArms || canonical?.coatOfArms || "",
          currentLordId,
          heirId,
          overlordId,
          founderId,
          cadetBranchIds: (item.cadetBranches && item.cadetBranches.length > 0)
            ? item.cadetBranches.map((u: string) => parseInt(u.split("/").pop() || "0", 10))
            : (canonical?.cadetBranchIds || []),
          swornMemberIds: (item.swornMembers && item.swornMembers.length > 0)
            ? item.swornMembers.map((u: string) => parseInt(u.split("/").pop() || "0", 10))
            : (canonical?.swornMemberIds || []),
        };
        cache.set(cacheKey, house, 86400);
        return house;
      }
    } catch {
      // Remote timeout or network drop - fallback
    }

    if (canonical) {
      cache.set(cacheKey, canonical, 86400);
      return canonical;
    }
    return null;
  }

  /**
   * Fetch all books
   */
  static async getBooks(): Promise<Book[]> {
    const cacheKey = "api:books:all";
    const cached = cache.get<Book[]>(cacheKey);
    if (cached) return cached;

    try {
      const res = await this.fetchWithTimeout(`${BASE_URL}/books?pageSize=50`);
      if (res.ok) {
        const rawData = await res.json();
        const books: Book[] = rawData.map((item: Record<string, unknown>) => {
          const urlStr = (item.url as string) || "";
          const id = parseInt(urlStr.split("/").pop() || "0", 10);
          return {
            ...item,
            id,
            characterIds: ((item.characters as string[]) || []).map((u) => parseInt(u.split("/").pop() || "0", 10)),
            povCharacterIds: ((item.povCharacters as string[]) || []).map((u) => parseInt(u.split("/").pop() || "0", 10)),
          };
        });
        cache.set(cacheKey, books, 86400);
        return books;
      }
    } catch {
      // Remote timeout or network drop - fallback
    }

    const books = CanonicalDataService.getBooks();
    cache.set(cacheKey, books, 86400);
    return books;
  }

  /**
   * Fetch single book by ID
   */
  static async getBookById(id: number): Promise<Book | null> {
    const cacheKey = `api:book:${id}`;
    const cached = cache.get<Book>(cacheKey);
    if (cached) return cached;

    try {
      const res = await this.fetchWithTimeout(`${BASE_URL}/books/${id}`);
      if (res.ok) {
        const item = await res.json();
        const book: Book = {
          ...item,
          id,
          characterIds: (item.characters || []).map((u: string) => parseInt(u.split("/").pop() || "0", 10)),
          povCharacterIds: (item.povCharacters || []).map((u: string) => parseInt(u.split("/").pop() || "0", 10)),
        };
        cache.set(cacheKey, book, 86400);
        return book;
      }
    } catch {
      // Remote timeout or network drop - fallback
    }

    const book = CanonicalDataService.getBookById(id);
    if (book) {
      cache.set(cacheKey, book, 86400);
    }
    return book;
  }
}
