"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Shield,
  Search,
  Grid,
  List,
  ArrowUpDown,
  X,
  Sword,
  Scroll,
  Users,
} from "lucide-react";
import { GlassCard, GlassBadge } from "@/components/ui/glass-card";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Pagination } from "@/components/ui/pagination";
import { LoadingSkeleton, EmptyState, ErrorState } from "@/components/ui/states";
import { House, PaginatedResponse } from "@/types/api";

const REGIONS = [
  "The North",
  "The Vale",
  "The Riverlands",
  "The Iron Islands",
  "The Westerlands",
  "The Reach",
  "The Stormlands",
  "Dorne",
  "The Crownlands",
  "Beyond the Wall",
  "Braavos",
];

export default function HousesPage() {
  const [data, setData] = useState<PaginatedResponse<House> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [region, setRegion] = useState("");
  const [hasWords, setHasWords] = useState(false);
  const [hasWeapons, setHasWeapons] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "region" | "swornCount" | "id">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Debounce search input to avoid request spam and race conditions
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const loadHouses = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("pageSize", "24");
        if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
        if (region) params.set("region", region);
        if (hasWords) params.set("hasWords", "true");
        if (hasWeapons) params.set("hasWeapons", "true");
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);

        const res = await fetch(`/api/houses?${params.toString()}`, { signal });
        if (!res.ok) throw new Error("Failed to load noble houses");
        const json = await res.json();
        setData(json);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return; // Ignore aborted fetch
        }
        setError(err instanceof Error ? err.message : "Unable to retrieve noble houses");
      } finally {
        setIsLoading(false);
      }
    },
    [page, debouncedSearch, region, hasWords, hasWeapons, sortBy, sortOrder]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadHouses(controller.signal);
    return () => controller.abort();
  }, [loadHouses]);

  const resetFilters = () => {
    setSearch("");
    setRegion("");
    setHasWords(false);
    setHasWeapons(false);
    setSortBy("name");
    setSortOrder("asc");
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || region || hasWords || hasWeapons);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Heraldry & Dynasty Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-100">
            House Explorer
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Survey 444 noble lineages, ancient ancestral seats, house mottos, and blazoned heraldry across the realms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/graph"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-slate-100 text-xs font-medium border border-white/10"
          >
            <span>View in Graph</span>
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
      </div>

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
              placeholder="Search by house name, motto words, or seat..."
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

          {/* Region Selector */}
          <div>
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setPage(1);
              }}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs sm:text-sm"
            >
              <option value="" className="bg-slate-900">All Regions</option>
              {REGIONS.map((r) => (
                <option key={r} value={r} className="bg-slate-900">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "region" | "swornCount" | "id")}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs sm:text-sm"
            >
              <option value="name" className="bg-slate-900">Sort by Name</option>
              <option value="region" className="bg-slate-900">Sort by Region</option>
              <option value="swornCount" className="bg-slate-900">Sworn Members Count</option>
              <option value="id" className="bg-slate-900">Citadel Index</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 rounded-lg bg-slate-800/60 border border-white/5 text-slate-300 hover:bg-slate-700"
              title="Toggle Sort Direction"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Badges & Filter Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setHasWords(!hasWords);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                hasWords
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-800/40 text-slate-400 border-white/5 hover:text-slate-200"
              }`}
            >
              Has Recorded Motto
            </button>

            <button
              onClick={() => {
                setHasWeapons(!hasWeapons);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                hasWeapons
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                  : "bg-slate-800/40 text-slate-400 border-white/5 hover:text-slate-200"
              }`}
            >
              Ancestral Weapons
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

          <span className="text-slate-500 text-xs">
            {data ? `${data.meta.total} Noble Houses Registered` : "Loading..."}
          </span>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <LoadingSkeleton count={12} />
      ) : error ? (
        <ErrorState onRetry={loadHouses} message={error} />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          title="No Noble Houses Found"
          description="No lineages match your filter criteria. Try searching a different region or name."
          actionText="Reset Filters"
          onAction={resetFilters}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data.data.map((h) => (
            <GlassCard
              key={h.id}
              variant="interactive"
              className="flex flex-col justify-between p-5 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <Link
                      href={`/houses/${h.id}`}
                      className="font-bold text-base text-slate-100 hover:text-gold-300 transition-colors font-serif line-clamp-1"
                    >
                      {h.name}
                    </Link>
                    {h.region && <GlassBadge color="gold">{h.region}</GlassBadge>}
                  </div>
                  <FavoriteButton
                    entityType="house"
                    entityId={h.id}
                    name={h.name}
                    subtitle={h.region}
                  />
                </div>

                {h.words ? (
                  <p className="text-xs text-gold-300 italic font-serif">
                    &ldquo;{h.words}&rdquo;
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 italic">No recorded words</p>
                )}

                {h.coatOfArms && (
                  <p className="text-xs text-slate-400 line-clamp-2">
                    <span className="text-slate-500">Arms:</span> {h.coatOfArms}
                  </p>
                )}

                {h.seats.length > 0 && (
                  <p className="text-xs text-slate-400">
                    <span className="text-slate-500">Seat:</span> {h.seats[0]}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span title="Sworn Members" className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    {h.swornMemberIds.length}
                  </span>
                  {h.ancestralWeapons.length > 0 && (
                    <span title="Ancestral Weapons" className="flex items-center gap-1 text-purple-400">
                      <Sword className="w-3.5 h-3.5" />
                      {h.ancestralWeapons.length}
                    </span>
                  )}
                </div>

                <Link href={`/houses/${h.id}`} className="text-gold-400 hover:text-gold-300 font-medium">
                  Heraldry &rarr;
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
          {data.data.map((h) => (
            <div
              key={h.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/houses/${h.id}`}
                    className="font-bold text-slate-100 hover:text-gold-300 transition-colors font-serif"
                  >
                    {h.name}
                  </Link>
                  {h.region && <GlassBadge color="gold">{h.region}</GlassBadge>}
                </div>
                <p className="text-xs text-slate-400">
                  {h.words ? `"${h.words}"` : h.seats[0] ? `Seat: ${h.seats[0]}` : "Noble House"}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 self-end sm:self-auto">
                <span>{h.swornMemberIds.length} Sworn Members</span>
                <FavoriteButton
                  entityType="house"
                  entityId={h.id}
                  name={h.name}
                  subtitle={h.region}
                />
                <Link
                  href={`/houses/${h.id}`}
                  className="px-3 py-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 border border-gold-500/30 font-medium transition-all"
                >
                  Heraldry
                </Link>
              </div>
            </div>
          ))}
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
