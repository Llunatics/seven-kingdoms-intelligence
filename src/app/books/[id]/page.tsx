import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  Calendar,
  FileText,
  Building,
  UserCheck,
  Users,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { GlassCard, GlassBadge } from "@/components/ui/glass-card";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { IntelligenceService } from "@/services/intelligenceService";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = await IntelligenceService.getBookById(parseInt(id, 10));
  if (!book) {
    return { title: "Book Not Found — Seven Kingdoms Intelligence" };
  }
  return {
    title: `${book.name} — Seven Kingdoms Intelligence`,
    description: `Chronicle bibliography for ${book.name} by George R.R. Martin. Published ${book.released.substring(0, 4)}. ${book.numberOfPages} pages.`,
  };
}

export default async function BookDetailPage({ params }: Props) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) notFound();

  const book = await IntelligenceService.getBookById(id);
  if (!book) notFound();

  const povCharacters = await Promise.all(
    book.povCharacterIds.map((cid) => IntelligenceService.getCharacterById(cid))
  );

  const sampleCharacters = await Promise.all(
    book.characterIds.slice(0, 48).map((cid) => IntelligenceService.getCharacterById(cid))
  );

  const releaseYear = book.released ? book.released.substring(0, 4) : "Unknown";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back breadcrumb */}
      <div>
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Book Explorer</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-gold-400 font-bold">
                VOL. {String(book.id).padStart(2, "0")}
              </span>
              <GlassBadge color="gold">{book.mediaType || "Hardcover"}</GlassBadge>
              <GlassBadge color="green">Published {releaseYear}</GlassBadge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-slate-100">
              {book.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-400">
              Authored by <strong className="text-slate-200">{book.authors.join(", ")}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <FavoriteButton
              entityType="book"
              entityId={book.id}
              name={book.name}
              subtitle={`${book.numberOfPages} pp · ${releaseYear}`}
            />
          </div>
        </div>

        {/* Key Book Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/5 text-xs text-slate-400">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
            <span className="text-slate-500 block">Pages</span>
            <span className="text-base font-bold text-slate-100 font-mono">
              {book.numberOfPages.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
            <span className="text-slate-500 block">POV Leaders</span>
            <span className="text-base font-bold text-purple-400 font-mono">
              {book.povCharacterIds.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
            <span className="text-slate-500 block">Cast Appearances</span>
            <span className="text-base font-bold text-gold-400 font-mono">
              {book.characterIds.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
            <span className="text-slate-500 block">Publisher</span>
            <span className="text-xs font-semibold text-slate-200 truncate block">
              {book.publisher}
            </span>
          </div>
        </div>
      </div>

      {/* POV Characters */}
      {povCharacters.filter(Boolean).length > 0 && (
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>POV Chapter Leaders ({povCharacters.filter(Boolean).length})</span>
            </h3>
            <span className="text-xs text-slate-500">Viewpoint perspectives</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {povCharacters.filter(Boolean).map((character) => (
              <Link
                key={character!.id}
                href={`/characters/${character!.id}`}
                className="p-3.5 rounded-xl bg-purple-950/20 hover:bg-purple-900/30 border border-purple-500/20 hover:border-purple-500/40 transition-all group block"
              >
                <div className="font-bold text-sm text-slate-100 group-hover:text-purple-300 font-serif">
                  {character!.name || character!.aliases[0]}
                </div>
                <p className="text-xs text-slate-400 mt-1 truncate">
                  {character!.culture || character!.titles[0] || "POV Character"}
                </p>
              </Link>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Characters Appearing */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-gold-400" />
            <span>Notable Cast & Character Appearances ({book.characterIds.length})</span>
          </h3>
          <span className="text-xs text-slate-500">Sample of archival figures</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {sampleCharacters.filter(Boolean).map((character) => (
            <Link
              key={character!.id}
              href={`/characters/${character!.id}`}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-gold-500/40 transition-all group block"
            >
              <div className="font-bold text-sm text-slate-100 group-hover:text-gold-300 font-serif truncate">
                {character!.name || character!.aliases[0] || `Character #${character!.id}`}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {character!.culture || character!.titles[0] || "Character"}
              </p>
            </Link>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
