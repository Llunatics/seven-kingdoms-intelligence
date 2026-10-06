"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Scale,
  Search,
  Plus,
  X,
  Users,
  Shield,
  BookOpen,
  Tv,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { GlassCard, GlassBadge } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/page-header";
import { Character, SearchResult } from "@/types/api";

function CompareContent() {
  const searchParams = useSearchParams();
  const [selectedChars, setSelectedChars] = useState<Character[]>([]);
  const [isSearchingSlot, setIsSearchingSlot] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load characters from query params if provided
  useEffect(() => {
    const char1Id = searchParams.get("char1");
    const char2Id = searchParams.get("char2");
    const char3Id = searchParams.get("char3");

    const idsToLoad = [char1Id, char2Id, char3Id].filter(Boolean) as string[];

    if (idsToLoad.length > 0) {
      Promise.all(
        idsToLoad.map((id) =>
          fetch(`/api/characters/${id}`)
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        )
      ).then((chars) => {
        setSelectedChars(chars.filter((c): c is Character => Boolean(c)));
      });
    } else {
      // Default to Jon Snow (583) and Daenerys Targaryen (271)
      Promise.all([
        fetch("/api/characters/583").then((r) => r.json()),
        fetch("/api/characters/271").then((r) => r.json()),
      ]).then(([c1, c2]) => {
        setSelectedChars([c1, c2]);
      });
    }
  }, [searchParams]);

  // Debounced search for slot replacement
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          // Filter to character type only
          setSearchResults((data.results || []).filter((r: SearchResult) => r.type === "character"));
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const selectCharacterForSlot = async (charId: number, slotIndex: number) => {
    try {
      const res = await fetch(`/api/characters/${charId}`);
      if (res.ok) {
        const char = await res.json();
        const updated = [...selectedChars];
        if (slotIndex < updated.length) {
          updated[slotIndex] = char;
        } else {
          updated.push(char);
        }
        setSelectedChars(updated);
      }
    } catch (err) {
      console.error("Failed to select character:", err);
    } finally {
      setIsSearchingSlot(null);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const removeCharacter = (index: number) => {
    setSelectedChars(selectedChars.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <PageHeader
        icon={Scale}
        badge="Comparative Intelligence Matrix"
        title="Character Comparison"
        description="Place up to 3 figures side-by-side to contrast noble allegiances, book chronology, and screen adaptation data."
        actions={
          <div className="text-xs text-slate-500 font-mono">
            <span>{selectedChars.length} of 3 Candidates Selected</span>
          </div>
        }
      />

      {/* Character Selector Header Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((slotIdx) => {
          const char = selectedChars[slotIdx];
          return (
            <div
              key={slotIdx}
              className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col justify-between min-h-[120px]"
            >
              {char ? (
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-gold-400 font-bold uppercase">
                        Slot #{slotIdx + 1}
                      </span>
                      <h3 className="font-bold text-base text-slate-100 font-serif">
                        {char.name || char.aliases[0] || `Character #${char.id}`}
                      </h3>
                      {char.culture && <GlassBadge color="gold">{char.culture}</GlassBadge>}
                    </div>
                    <button
                      onClick={() => removeCharacter(slotIdx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
                      title="Remove Candidate"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setIsSearchingSlot(slotIdx);
                      setSearchQuery("");
                    }}
                    className="text-xs text-gold-400 hover:text-gold-300 underline underline-offset-2"
                  >
                    Change Candidate
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-2 py-4">
                  <button
                    onClick={() => {
                      setIsSearchingSlot(slotIdx);
                      setSearchQuery("");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-medium transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold-400" />
                    <span>Add Candidate</span>
                  </button>
                  <span className="text-[11px] text-slate-500">Pick from 2,134 records</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison Data Matrix */}
      {selectedChars.length > 0 ? (
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" aria-hidden="true" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-gold-500/20">
                  <th className="p-4 font-mono uppercase tracking-wider text-slate-400 w-1/4">
                    Dimension
                  </th>
                  {selectedChars.map((c) => (
                    <th key={c.id} className="p-4 font-display text-base font-bold text-gold-300 tracking-wide">
                      {c.name || c.aliases[0] || `Character #${c.id}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Culture */}
                <tr className="hover:bg-slate-800/20">
                  <td className="p-4 text-slate-400 font-medium">Culture / Origin</td>
                  {selectedChars.map((c) => (
                    <td key={c.id} className="p-4 text-slate-200">
                      {c.culture || <span className="text-slate-500 italic">Not recorded</span>}
                    </td>
                  ))}
                </tr>

                {/* Living Status */}
                <tr className="hover:bg-slate-800/20">
                  <td className="p-4 text-slate-400 font-medium">Life Status</td>
                  {selectedChars.map((c) => (
                    <td key={c.id} className="p-4">
                      {c.died ? (
                        <div className="flex items-center gap-1 text-red-400">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Died: {c.died}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Presumed Living</span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Born */}
                <tr className="hover:bg-slate-800/20">
                  <td className="p-4 text-slate-400 font-medium">Birth Chronology</td>
                  {selectedChars.map((c) => (
                    <td key={c.id} className="p-4 text-slate-300">
                      {c.born || <span className="text-slate-500 italic">Unknown</span>}
                    </td>
                  ))}
                </tr>

                {/* Titles */}
                <tr className="hover:bg-slate-800/20">
                  <td className="p-4 text-slate-400 font-medium">Titles & Honors</td>
                  {selectedChars.map((c) => (
                    <td key={c.id} className="p-4 text-slate-300">
                      {c.titles.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {c.titles.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-500 italic">No formal title</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Aliases */}
                <tr className="hover:bg-slate-800/20">
                  <td className="p-4 text-slate-400 font-medium">Aliases & Monikers</td>
                  {selectedChars.map((c) => (
                    <td key={c.id} className="p-4 text-slate-300">
                      {c.aliases.length > 0 ? (
                        c.aliases.join(", ")
                      ) : (
                        <span className="text-slate-500 italic">None recorded</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Book Appearances */}
                <tr className="hover:bg-slate-800/20">
                  <td className="p-4 text-slate-400 font-medium">Book Appearances</td>
                  {selectedChars.map((c) => (
                    <td key={c.id} className="p-4 text-slate-200">
                      <strong className="text-gold-400 font-mono text-sm">
                        {c.bookIds.length}
                      </strong>{" "}
                      Chronicle Volumes
                    </td>
                  ))}
                </tr>

                {/* POV Chapters */}
                <tr className="hover:bg-slate-800/20">
                  <td className="p-4 text-slate-400 font-medium">POV Viewpoint Status</td>
                  {selectedChars.map((c) => (
                    <td key={c.id} className="p-4">
                      {c.povBookIds.length > 0 ? (
                        <GlassBadge color="martell">POV in {c.povBookIds.length} Books</GlassBadge>
                      ) : (
                        <span className="text-slate-500">Non-POV</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* TV Series */}
                <tr className="hover:bg-slate-800/20">
                  <td className="p-4 text-slate-400 font-medium">TV Series Seasons</td>
                  {selectedChars.map((c) => (
                    <td key={c.id} className="p-4 text-slate-300">
                      {c.tvSeries.length > 0 ? (
                        c.tvSeries.join(", ")
                      ) : (
                        <span className="text-slate-500 italic">Book only</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Played By Actor */}
                <tr className="hover:bg-slate-800/20">
                  <td className="p-4 text-slate-400 font-medium">Portrayed By</td>
                  {selectedChars.map((c) => (
                    <td key={c.id} className="p-4 text-slate-200 font-medium font-serif">
                      {c.playedBy.join(", ") || (
                        <span className="text-slate-500 italic font-sans">Unadapted</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Full Profile Links */}
                <tr className="bg-slate-900/60">
                  <td className="p-4 text-slate-400 font-medium">Citadel Link</td>
                  {selectedChars.map((c) => (
                    <td key={c.id} className="p-4">
                      <Link
                        href={`/characters/${c.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500 text-slate-950 font-semibold text-xs hover:bg-gold-400 transition-all"
                      >
                        <span>View Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Candidate Search Picker Modal */}
      {isSearchingSlot !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
          onClick={() => setIsSearchingSlot(null)}
        >
          <div
            className="w-full max-w-lg glass-panel p-5 rounded-2xl border border-white/15 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-slate-100 font-serif">
                Select Character for Slot #{isSearchingSlot + 1}
              </h3>
              <button
                onClick={() => setIsSearchingSlot(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search character name (e.g. Ned Stark, Cersei)..."
                className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-sm"
              />
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-white/5">
              {searchResults.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  {isSearching ? "Searching the Citadel..." : "Type a name to search characters."}
                </p>
              ) : (
                searchResults.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => selectCharacterForSlot(r.id, isSearchingSlot)}
                    className="p-3 hover:bg-slate-800/60 rounded-xl cursor-pointer flex items-center justify-between text-xs text-slate-200 transition-all"
                  >
                    <div>
                      <div className="font-bold text-slate-100 font-serif">{r.name}</div>
                      <div className="text-slate-400 text-[11px]">{r.subtitle}</div>
                    </div>
                    <span className="text-gold-400 font-medium">Select &rarr;</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
