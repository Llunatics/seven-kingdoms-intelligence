import { IceAndFireClient } from "./iceAndFireClient";
import { CanonicalDataService } from "./canonicalData";
import {
  Character,
  House,
  Book,
  PaginatedResponse,
  SearchResult,
  AnalyticsSummary,
  TriviaQuestion,
  GraphData,
} from "@/types/api";

export class IntelligenceService {
  static async getCharacters(params = {}): Promise<PaginatedResponse<Character>> {
    return IceAndFireClient.getCharacters(params);
  }

  static async getCharacterById(id: number): Promise<Character | null> {
    return IceAndFireClient.getCharacterById(id);
  }

  static async getHouses(params = {}): Promise<PaginatedResponse<House>> {
    return IceAndFireClient.getHouses(params);
  }

  static async getHouseById(id: number): Promise<House | null> {
    return IceAndFireClient.getHouseById(id);
  }

  static async getBooks(): Promise<Book[]> {
    return IceAndFireClient.getBooks();
  }

  static async getBookById(id: number): Promise<Book | null> {
    return IceAndFireClient.getBookById(id);
  }

  static async search(query: string, limit = 12): Promise<SearchResult[]> {
    return CanonicalDataService.globalSearch(query, limit);
  }

  static async getAnalytics(): Promise<AnalyticsSummary> {
    return CanonicalDataService.getAnalyticsSummary();
  }

  static async getRandomCharacter(): Promise<Character> {
    return CanonicalDataService.getRandomCharacter();
  }

  static async getTriviaQuestion(): Promise<TriviaQuestion> {
    return CanonicalDataService.getTriviaQuestion();
  }

  static async getGraphData(params = {}): Promise<GraphData> {
    return CanonicalDataService.getGraphData(params);
  }
}
