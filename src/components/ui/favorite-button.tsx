"use client";

import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { EntityType, FavoriteItem } from "@/types/api";

interface FavoriteButtonProps {
  entityType: EntityType;
  entityId: number;
  name: string;
  subtitle?: string;
  className?: string;
}

export function FavoriteButton({
  entityType,
  entityId,
  name,
  subtitle = "",
  className = "",
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const itemId = `${entityType}-${entityId}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("seven_kingdoms_favorites");
      if (stored) {
        const items: FavoriteItem[] = JSON.parse(stored);
        setIsFavorite(items.some((item) => item.id === itemId));
      }
    } catch {
      // Fallback
    }
  }, [itemId]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const stored = localStorage.getItem("seven_kingdoms_favorites");
      let items: FavoriteItem[] = stored ? JSON.parse(stored) : [];

      if (isFavorite) {
        items = items.filter((item) => item.id !== itemId);
        setIsFavorite(false);
      } else {
        items.push({
          id: itemId,
          entityType,
          entityId,
          name,
          subtitle,
          createdAt: new Date().toISOString(),
        });
        setIsFavorite(true);
      }

      localStorage.setItem("seven_kingdoms_favorites", JSON.stringify(items));
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch {
      // Error handling
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      aria-label={isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      title={isFavorite ? "Remove from favorites" : "Bookmark to favorites"}
      className={`p-2 rounded-lg transition-all border ${
        isFavorite
          ? "bg-gold-500/20 text-gold-400 border-gold-500/40 shadow-sm"
          : "bg-slate-800/40 text-slate-400 border-white/5 hover:text-slate-200 hover:bg-slate-800/80 hover:border-white/15"
      } ${className}`}
    >
      <Bookmark
        className={`w-4 h-4 transition-transform ${
          isFavorite ? "fill-gold-400 scale-105 text-gold-400" : ""
        }`}
      />
    </button>
  );
}
