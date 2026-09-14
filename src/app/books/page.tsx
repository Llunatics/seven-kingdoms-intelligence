"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  FileText,
  UserCheck,
  Building,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { GlassCard, GlassBadge } from "@/components/ui/glass-card";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { LoadingSkeleton, EmptyState, ErrorState } from "@/components/ui/states";
import { Book } from "@/types/api";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load books");
        return r.json();
      })
      .then((data) => setBooks(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Chronicle Archives & Bibliography</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-100">
            Book Explorer
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Explore the 12 canonical volumes, novellas, and prequel compilations penned by George R.R. Martin.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          <span>{books.length} Volumes Documented</span>
        </div>
      </div>

      {/* Main Books Grid */}
      {isLoading ? (
        <LoadingSkeleton count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : books.length === 0 ? (
        <EmptyState title="No Books Discovered" description="The Citadel shelves are empty." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const releaseYear = book.released ? book.released.substring(0, 4) : "Unknown";
            return (
              <GlassCard
                key={book.id}
                variant="interactive"
                className="flex flex-col justify-between p-6 space-y-5 group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-gold-400">
                          VOL. {String(book.id).padStart(2, "0")}
                        </span>
                        <GlassBadge color="gold">{book.mediaType || "Hardcover"}</GlassBadge>
                      </div>
                      <Link
                        href={`/books/${book.id}`}
                        className="text-lg font-bold text-slate-100 group-hover:text-gold-300 transition-colors font-serif block"
                      >
                        {book.name}
                      </Link>
                    </div>
                    <FavoriteButton
                      entityType="book"
                      entityId={book.id}
                      name={book.name}
                      subtitle={`${book.numberOfPages} pages · ${releaseYear}`}
                    />
                  </div>

                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Published: {releaseYear}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>{book.numberOfPages.toLocaleString()} Pages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>Publisher: {book.publisher}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>{book.povCharacterIds.length} POV Chapter Leaders</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-[11px] text-slate-500 font-mono">
                      ISBN: {book.isbn} · {book.country}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {book.characterIds.length} Character Appearances
                  </span>
                  <Link
                    href={`/books/${book.id}`}
                    className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 font-medium group-hover:translate-x-1 transition-transform"
                  >
                    <span>Inspect Archive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
