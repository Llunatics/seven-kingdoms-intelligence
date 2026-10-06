"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Grid,
  List,
  Sparkles,
  BookOpen,
  Shield,
  Compass,
  ArrowUpDown,
  X,
} from "lucide-react";
import { GlassCard, GlassBadge } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/page-header";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Pagination } from "@/components/ui/pagination";
import { LoadingSkeleton, EmptyState, ErrorState } from "@/components/ui/states";
import { Character, PaginatedResponse } from "@/types/api";

const CULTURES = [
  "Northmen",
  "Ironborn",
  "Dornish",
  "Valyrian",
  "Braavosi",
  "Free Folk",
  "Westerman",
  "Reach",
  "Stormlander",
  "Rivermen",
  "Ghiscari",
  "Dothraki",
];

export default function CharactersPage() {
  const [data, setData] = useState<PaginatedResponse<Character> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and pagination states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [culture, setCulture] = useState("");
  const [gender, setGender] = useState("");
  const [isAlive, setIsAlive] = useState<string>("");
  const [isPov, setIsPov] = useState(false);
  const [hasAllegiance, setHasAllegiance] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "culture" | "booksCount" | "id">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Debounce search input to avoid request spam and race conditions
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const loadCharacters = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("pageSize", "24");
        if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
        if (culture) params.set("culture", culture);
        if (gender) params.set("gender", gender);
        if (isAlive !== "") params.set("isAlive", isAlive);
        if (isPov) params.set("isPov", "true");
        if (hasAllegiance) params.set("hasAllegiance", "true");
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);

        const res = await fetch(`/api/characters?${params.toString()}`, { signal });
        if (!res.ok) throw new Error("Failed to load characters");
        const json = await res.json();
        setData(json);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return; // Ignore aborted fetch
        }
        setError(err instanceof Error ? err.message : "Unable to retrieve characters");
      } finally {
        setIsLoading(false);
      }
    },
    [page, debouncedSearch, culture, gender, isAlive, isPov, hasAllegiance, sortBy, sortOrder]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadCharacters(controller.signal);
    return () => controller.abort();
  }, [loadCharacters]);

  const resetFilters = () => {
    setSearch("");
    setCulture("");
    setGender("");
    setIsAlive("");
    setIsPov(false);
    setHasAllegiance(false);
    setSortBy("name");
    setSortOrder("asc");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search || culture || gender || isAlive !== "" || isPov || hasAllegiance
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        icon={Users}
        badge="Personnel & Lineage Intelligence"
        title="Character Explorer"
        description="Query over 2,100 figures, sworn commanders, bastards, and monarchs across Westeros and the Free Cities."
        actions={
                  <div className="flex items-center gap-3">
                    <Link
                      href="/compare"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-slate-100 text-xs font-medium border border-white/10"
                    >
                      <span>Compare Characters</span>
                    </Link>
                    <div className="flex items-center p-1 rounded-xl bg-slate-900/60 border border-white/10">
                      <button
                        onClick={() => setViewMode("grid")}
                        aria-label="Grid view"
                        className={`p-1.5 rounded-lg transition-all ${
                          viewMode === "grid"
                            ? "bg-gold-500/20 text-gold-400"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        aria-label="List view"
                        className={`p-1.5 rounded-lg transition-all ${
                          viewMode === "list"
                            ? "bg-gold-500/20 text-gold-400"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
        }
      />

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative col-span-1 sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, alias, or title..."
              className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Culture Selector */}
          <div>
            <select
              value={culture}
              onChange={(e) => {
                setCulture(e.target.value);
                setPage(1);
              }}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs sm:text-sm"
            >
              <option value="" className="bg-slate-900">All Cultures</option>
              {CULTURES.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Selector */}
          <div>
            <select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setPage(1);
              }}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs sm:text-sm"
            >
              <option value="" className="bg-slate-900">All Genders</option>
              <option value="Female" className="bg-slate-900">Female</option>
              <option value="Male" className="bg-slate-900">Male</option>
            </select>
          </div>
        </div>

        {/* Secondary Filters & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Living Status Filter */}
            <select
              value={isAlive}
              onChange={(e) => {
                setIsAlive(e.target.value);
                setPage(1);
              }}
              className="glass-input px-2.5 py-1.5 rounded-lg text-xs"
            >
              <option value="" className="bg-slate-900">All Life Statuses</option>
              <option value="true" className="bg-slate-900">Living / Presumed Alive</option>
              <option value="false" className="bg-slate-900">Deceased</option>
            </select>

            {/* POV Toggle */}
            <button
              onClick={() => {
                setIsPov(!isPov);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                isPov
                  ? "bg-gold-500/20 text-gold-300 border-gold-500/40"
                  : "bg-slate-800/40 text-slate-400 border-white/5 hover:text-slate-200"
              }`}
            >
              POV Characters Only
            </button>

            {/* Allegiance Toggle */}
            <button
              onClick={() => {
                setHasAllegiance(!hasAllegiance);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                hasAllegiance
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                  : "bg-slate-800/40 text-slate-400 border-white/5 hover:text-slate-200"
              }`}
            >
              Has Noble Allegiance
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-gold-400 hover:text-gold-300 flex items-center gap-1 px-2 py-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "culture" | "booksCount" | "id")}
              className="glass-input px-2.5 py-1.5 rounded-lg text-xs"
            >
              <option value="name" className="bg-slate-900">Name</option>
              <option value="culture" className="bg-slate-900">Culture</option>
              <option value="booksCount" className="bg-slate-900">Book Appearances</option>
              <option value="id" className="bg-slate-900">Citadel Index</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-1.5 rounded-lg bg-slate-800/60 border border-white/5 text-slate-300 hover:bg-slate-700"
              title="Toggle Sort Direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingSkeleton count={12} />
      ) : error ? (
        <ErrorState onRetry={loadCharacters} message={error} />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          title="No Characters Found"
          description="No figures in the archives match your current filters. Try relaxing search or culture criteria."
          actionText="Reset All Filters"
          onAction={resetFilters}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data.data.map((c) => {
            const displayName = c.name || c.aliases[0] || `Character #${c.id}`;
            const isPOV = c.povBookIds.length > 0;
            return (
              <GlassCard
                key={c.id}
                variant="interactive"
                className="flex flex-col justify-between p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <Link
                        href={`/characters/${c.id}`}
                        className="font-bold text-base text-slate-100 hover:text-gold-300 transition-colors font-serif line-clamp-1"
                      >
                        {displayName}
                      </Link>
                      {c.aliases.length > 0 && c.name && (
                        <p className="text-xs text-slate-400 italic line-clamp-1">
                          &ldquo;{c.aliases[0]}&rdquo;
                        </p>
                      )}
                    </div>
                    <FavoriteButton
                      entityType="character"
                      entityId={c.id}
                      name={displayName}
                      subtitle={c.culture || "Westeros"}
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {c.culture && <GlassBadge color="gold">{c.culture}</GlassBadge>}
                    {c.gender && <GlassBadge>{c.gender}</GlassBadge>}
                    {isPOV && <GlassBadge color="martell">POV</GlassBadge>}
                    {c.died ? (
                      <GlassBadge color="targaryen">Deceased</GlassBadge>
                    ) : (
                      <GlassBadge color="green">Living</GlassBadge>
                    )}
                  </div>

                  {c.titles.length > 0 && (
                    <p className="text-xs text-slate-400 line-clamp-2">
                      <span className="text-slate-500">Title:</span> {c.titles[0]}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span title="Book Appearances" className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      {c.bookIds.length}
                    </span>
                    <span title="House Allegiances" className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-slate-500" />
                      {c.allegianceIds.length}
                    </span>
                  </div>

                  <Link
                    href={`/characters/${c.id}`}
                    className="text-gold-400 hover:text-gold-300 font-medium"
                  >
                    View &rarr;
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
          {data.data.map((c) => {
            const displayName = c.name || c.aliases[0] || `Character #${c.id}`;
            return (
              <div
                key={c.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/characters/${c.id}`}
                      className="font-bold text-slate-100 hover:text-gold-300 transition-colors font-serif"
                    >
                      {displayName}
                    </Link>
                    {c.culture && <GlassBadge color="gold">{c.culture}</GlassBadge>}
                    {c.povBookIds.length > 0 && <GlassBadge color="martell">POV</GlassBadge>}
                  </div>
                  <p className="text-xs text-slate-400">
                    {c.titles[0] || c.aliases.slice(0, 2).join(", ") || "No recorded title"}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 self-end sm:self-auto">
                  <span>{c.bookIds.length} Books</span>
                  <span>{c.allegianceIds.length} Allegiances</span>
                  <FavoriteButton
                    entityType="character"
                    entityId={c.id}
                    name={displayName}
                    subtitle={c.culture}
                  />
                  <Link
                    href={`/characters/${c.id}`}
                    className="px-3 py-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 border border-gold-500/30 font-medium transition-all"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {data && (
        <Pagination
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          total={data.meta.total}
          onPageChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
