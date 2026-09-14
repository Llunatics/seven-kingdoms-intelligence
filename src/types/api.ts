export interface Book {
  id: number;
  url: string;
  name: string;
  isbn: string;
  authors: string[];
  numberOfPages: number;
  publisher: string;
  country: string;
  mediaType: string;
  released: string;
  characters: string[];
  characterIds: number[];
  povCharacters: string[];
  povCharacterIds: number[];
}

export interface Character {
  id: number;
  url: string;
  name: string;
  gender: string;
  culture: string;
  born: string;
  died: string;
  titles: string[];
  aliases: string[];
  father: string;
  fatherId: number | null;
  mother: string;
  motherId: number | null;
  spouse: string;
  spouseId: number | null;
  allegiances: string[];
  allegianceIds: number[];
  books: string[];
  bookIds: number[];
  povBooks: string[];
  povBookIds: number[];
  tvSeries: string[];
  playedBy: string[];
}

export interface House {
  id: number;
  url: string;
  name: string;
  region: string;
  coatOfArms: string;
  words: string;
  titles: string[];
  seats: string[];
  currentLord: string;
  currentLordId: number | null;
  heir: string;
  heirId: number | null;
  overlord: string;
  overlordId: number | null;
  founded: string;
  founder: string;
  founderId: number | null;
  diedOut: string;
  ancestralWeapons: string[];
  cadetBranches: string[];
  cadetBranchIds: number[];
  swornMembers: string[];
  swornMemberIds: number[];
}

export type EntityType = "character" | "house" | "book";

export interface SearchResult {
  id: number;
  type: EntityType;
  name: string;
  subtitle: string;
  details?: string;
  url: string;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMetadata;
}

export interface GraphNode {
  id: string;
  data: {
    label: string;
    entityId: number;
    type: EntityType;
    subtitle?: string;
    culture?: string;
    region?: string;
    words?: string;
    titles?: string[];
  };
  position: { x: number; y: number };
  type?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: Record<string, unknown>;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface AnalyticsSummary {
  totalCharacters: number;
  totalHouses: number;
  totalBooks: number;
  namedCharacters: number;
  povCharactersCount: number;
  cultureDistribution: { name: string; count: number }[];
  regionDistribution: { name: string; count: number }[];
  bookStats: {
    id: number;
    name: string;
    pages: number;
    year: number;
    charactersCount: number;
    povCharactersCount: number;
  }[];
}

export interface TriviaQuestion {
  characterId: number;
  clues: {
    culture: string;
    gender: string;
    allegianceNames: string[];
    titles: string[];
    aliases: string[];
    bookAppearancesCount: number;
    actor?: string;
  };
  choices: string[];
  correctName: string;
  correctId: number;
}

export interface FavoriteItem {
  id: string;
  entityType: EntityType;
  entityId: number;
  name: string;
  subtitle: string;
  createdAt: string;
}
