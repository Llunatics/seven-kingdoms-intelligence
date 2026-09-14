"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, Shield, User, ArrowRight, Loader2 } from "lucide-react";
import { SearchResult } from "@/types/api";

interface SearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchCommand({ isOpen, onClose }: SearchCommandProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error("Search fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          results.length > 0 ? (prev - 1 + results.length) % results.length : 0
        );
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        navigateTo(results[selectedIndex].url);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const navigateTo = (url: string) => {
    onClose();
    router.push(url);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Citadel Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/70 backdrop-blur-md transition-all animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl glass-panel rounded-2xl border border-white/15 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-slate-900/60">
          <Search className="w-5 h-5 text-gold-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search characters, houses, books, aliases..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-base focus:outline-none"
          />
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-gold-400 animate-spin mr-2 shrink-0" />
          ) : query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded text-slate-400 hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5">
            ESC
          </div>
        </div>

        {/* Search Results / Suggestion List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-white/5">
          {query.trim().length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">
              <p className="font-medium text-slate-300 mb-1">Explore the Archives</p>
              <p className="text-xs text-slate-500">
                Type a character (e.g. &ldquo;Jon Snow&rdquo;), a noble house (e.g. &ldquo;Stark&rdquo;), or a chronicle book.
              </p>
            </div>
          ) : results.length === 0 && !isLoading ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No matching records discovered in the Seven Kingdoms.
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => navigateTo(item.url)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-slate-800/80 border border-gold-500/30 text-white"
                      : "text-slate-300 hover:bg-slate-800/40 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                        item.type === "character"
                          ? "bg-amber-950/40 text-gold-400 border-gold-500/30"
                          : item.type === "house"
                          ? "bg-blue-950/40 text-blue-400 border-blue-500/30"
                          : "bg-purple-950/40 text-purple-400 border-purple-500/30"
                      }`}
                    >
                      {item.type === "character" && <User className="w-4 h-4" />}
                      {item.type === "house" && <Shield className="w-4 h-4" />}
                      {item.type === "book" && <BookOpen className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate text-sm">{item.name}</span>
                        <span
                          className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                            item.type === "character"
                              ? "bg-amber-500/10 text-gold-400 border-gold-500/20"
                              : item.type === "house"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                        {item.details && ` · ${item.details}`}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? "text-gold-400 translate-x-1" : "text-slate-600"
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to open</span>
          </div>
          <span className="text-[11px] text-slate-500">An API of Ice and Fire Canonical Data</span>
        </div>
      </div>
    </div>
  );
}
