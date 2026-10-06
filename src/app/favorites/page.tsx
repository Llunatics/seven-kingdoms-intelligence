"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Users,
  Shield,
  BookOpen,
  Trash2,
  Download,
  Upload,
  ArrowRight,
  Compass,
} from "lucide-react";
import { GlassCard, GlassBadge } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/page-header";
import { FavoriteItem, EntityType } from "@/types/api";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [activeTab, setActiveTab] = useState<EntityType | "all">("all");
  const [isMounted, setIsMounted] = useState(false);

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem("seven_kingdoms_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
    } catch {
      setFavorites([]);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    loadFavorites();
    window.addEventListener("favoritesUpdated", loadFavorites);
    return () => window.removeEventListener("favoritesUpdated", loadFavorites);
  }, []);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem("seven_kingdoms_favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const clearAllFavorites = () => {
    if (confirm("Are you sure you want to clear all Citadel bookmarks?")) {
      setFavorites([]);
      localStorage.removeItem("seven_kingdoms_favorites");
      window.dispatchEvent(new Event("favoritesUpdated"));
    }
  };

  const exportFavorites = () => {
    const jsonStr = JSON.stringify(favorites, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seven-kingdoms-bookmarks-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFavorites = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          // Merge unique by id
          const existingIds = new Set(favorites.map((f) => f.id));
          const newItems = parsed.filter((item) => !existingIds.has(item.id));
          const merged = [...favorites, ...newItems];
          setFavorites(merged);
          localStorage.setItem("seven_kingdoms_favorites", JSON.stringify(merged));
          window.dispatchEvent(new Event("favoritesUpdated"));
        }
      } catch (err) {
        alert("Invalid bookmarks JSON file format.");
      }
    };
    reader.readAsText(file);
  };

  if (!isMounted) return null;

  const filtered = favorites.filter(
    (item) => activeTab === "all" || item.entityType === activeTab
  );

  const charCount = favorites.filter((f) => f.entityType === "character").length;
  const houseCount = favorites.filter((f) => f.entityType === "house").length;
  const bookCount = favorites.filter((f) => f.entityType === "book").length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <PageHeader
        icon={Bookmark}
        badge="Personal Citadel Council"
        title="Bookmarked Entities"
        description="Keep track of sworn lords, influential dynasties, and key canonical chronicles."
        actions={
          favorites.length > 0 ? (
            <>
              <button
                onClick={exportFavorites}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel hover:bg-slate-800 text-slate-300 text-xs border border-white/10"
                title="Export Bookmarks as JSON"
              >
                <Download className="w-3.5 h-3.5 text-gold-400" />
                <span>Export</span>
              </button>
              <label
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel hover:bg-slate-800 text-slate-300 text-xs border border-white/10 cursor-pointer"
                title="Import Bookmarks from JSON"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importFavorites}
                  className="hidden"
                />
              </label>
              <button
                onClick={clearAllFavorites}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                title="Clear All Bookmarks"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : undefined
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === "all"
              ? "bg-gold-500/20 text-gold-300 border border-gold-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          All ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab("character")}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === "character"
              ? "bg-gold-500/20 text-gold-300 border border-gold-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Characters ({charCount})
        </button>
        <button
          onClick={() => setActiveTab("house")}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === "house"
              ? "bg-gold-500/20 text-gold-300 border border-gold-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Houses ({houseCount})
        </button>
        <button
          onClick={() => setActiveTab("book")}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === "book"
              ? "bg-gold-500/20 text-gold-300 border border-gold-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Books ({bookCount})
        </button>
      </div>

      {/* Items List or Empty State */}
      {filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center max-w-md mx-auto space-y-4 my-10">
          <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
            <Bookmark className="w-5 h-5 text-gold-400" />
          </div>
          <h3 className="text-lg font-bold font-serif text-slate-100">
            No Bookmarks in this Vault
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click the bookmark ribbon on any character, noble house, or chronicle volume to add it to your council.
          </p>
          <div className="pt-2">
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-slate-950 font-semibold text-xs hover:bg-gold-400 transition-all shadow"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Characters</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const targetUrl =
              item.entityType === "character"
                ? `/characters/${item.entityId}`
                : item.entityType === "house"
                ? `/houses/${item.entityId}`
                : `/books/${item.entityId}`;

            return (
              <GlassCard
                key={item.id}
                variant="interactive"
                className="flex flex-col justify-between p-4 space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <GlassBadge
                      color={
                        item.entityType === "character"
                          ? "gold"
                          : item.entityType === "house"
                          ? "stark"
                          : "green"
                      }
                    >
                      {item.entityType.toUpperCase()}
                    </GlassBadge>
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Link href={targetUrl} className="block group">
                    <h4 className="font-bold text-base text-slate-100 group-hover:text-gold-300 font-serif truncate">
                      {item.name}
                    </h4>
                    {item.subtitle && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                    )}
                  </Link>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[10px] text-slate-500">
                    Saved {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={targetUrl}
                    className="text-gold-400 hover:text-gold-300 flex items-center gap-1 font-medium"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
