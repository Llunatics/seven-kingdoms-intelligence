import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  User,
  Shield,
  BookOpen,
  Crown,
  Heart,
  Calendar,
  Tv,
  Users,
  Scale,
  GitBranch,
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
  const character = await IntelligenceService.getCharacterById(parseInt(id, 10));
  if (!character) {
    return { title: "Character Not Found — Seven Kingdoms Intelligence" };
  }
  const name = character.name || character.aliases[0] || `Character #${character.id}`;
  return {
    title: `${name} — Seven Kingdoms Intelligence`,
    description: `Biographical dossier for ${name}. Culture: ${character.culture || "Westeros"}. Book appearances: ${character.bookIds.length}.`,
  };
}

export default async function CharacterDetailPage({ params }: Props) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) notFound();

  const character = await IntelligenceService.getCharacterById(id);
  if (!character) notFound();

  // Populate related entities
  const allegiances = await Promise.all(
    character.allegianceIds.map((hid) => IntelligenceService.getHouseById(hid))
  );
  const books = await Promise.all(
    character.bookIds.map((bid) => IntelligenceService.getBookById(bid))
  );
  const povBooks = await Promise.all(
    character.povBookIds.map((bid) => IntelligenceService.getBookById(bid))
  );

  let father = null;
  if (character.fatherId) father = await IntelligenceService.getCharacterById(character.fatherId);
  let mother = null;
  if (character.motherId) mother = await IntelligenceService.getCharacterById(character.motherId);
  let spouse = null;
  if (character.spouseId) spouse = await IntelligenceService.getCharacterById(character.spouseId);

  const displayName = character.name || character.aliases[0] || `Character #${character.id}`;
  const isAlive = !character.died;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back breadcrumb */}
      <div>
        <Link
          href="/characters"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Character Explorer</span>
        </Link>
      </div>

      {/* Header Profile Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-gold-400">
                CITADEL RECORD #{character.id}
              </span>
              {character.culture && (
                <GlassBadge color="gold">{character.culture}</GlassBadge>
              )}
              {character.gender && <GlassBadge>{character.gender}</GlassBadge>}
              {character.povBookIds.length > 0 && (
                <GlassBadge color="martell">POV Character</GlassBadge>
              )}
              {isAlive ? (
                <GlassBadge color="green">Living</GlassBadge>
              ) : (
                <GlassBadge color="targaryen">Deceased</GlassBadge>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-slate-100">
              {displayName}
            </h1>

            {character.titles.length > 0 && (
              <p className="text-sm sm:text-base text-gold-300 font-medium">
                {character.titles.join(" · ")}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <FavoriteButton
              entityType="character"
              entityId={character.id}
              name={displayName}
              subtitle={character.culture}
            />
            <Link
              href={`/compare?char1=${character.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg glass-panel hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-medium"
            >
              <Scale className="w-3.5 h-3.5 text-gold-400" />
              <span>Compare</span>
            </Link>
            <Link
              href={`/graph?focusCharacterId=${character.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-medium"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>View in Graph</span>
            </Link>
          </div>
        </div>

        {character.aliases.length > 0 && (
          <div className="pt-4 border-t border-white/5">
            <h4 className="text-xs uppercase font-mono text-slate-500 tracking-wider mb-2">
              Known Aliases & Monikers
            </h4>
            <div className="flex flex-wrap gap-2">
              {character.aliases.map((alias) => (
                <span
                  key={alias}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/60 text-slate-300 border border-white/5 text-xs italic"
                >
                  &ldquo;{alias}&rdquo;
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid Layout: Left Column Details, Right Column Connections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Vital Stats, TV Info, Lineage */}
        <div className="space-y-6 lg:col-span-1">
          {/* Identity & Vital Statistics */}
          <GlassCard className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold border-b border-white/5 pb-2">
              Vital Statistics
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Culture</span>
                <span className="text-slate-200 font-medium">
                  {character.culture || "Not recorded in Citadel scrolls"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Gender</span>
                <span className="text-slate-200 font-medium">{character.gender || "Unknown"}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Born</span>
                <span className="text-slate-200 font-medium">
                  {character.born || "Unknown / Not recorded"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Died</span>
                <span className="text-slate-200 font-medium">
                  {character.died || "Presumed living or unrecorded"}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Lineage & Family Connections */}
          <GlassCard className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold border-b border-white/5 pb-2">
              Lineage & Kinship
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Father</span>
                {father ? (
                  <Link
                    href={`/characters/${father.id}`}
                    className="text-gold-400 hover:text-gold-300 font-medium underline-offset-2 hover:underline"
                  >
                    {father.name || father.aliases[0] || `Character #${father.id}`} &rarr;
                  </Link>
                ) : (
                  <span className="text-slate-500">Unknown</span>
                )}
              </div>
              <div>
                <span className="text-slate-500 block">Mother</span>
                {mother ? (
                  <Link
                    href={`/characters/${mother.id}`}
                    className="text-gold-400 hover:text-gold-300 font-medium underline-offset-2 hover:underline"
                  >
                    {mother.name || mother.aliases[0] || `Character #${mother.id}`} &rarr;
                  </Link>
                ) : (
                  <span className="text-slate-500">Unknown</span>
                )}
              </div>
              <div>
                <span className="text-slate-500 block">Spouse</span>
                {spouse ? (
                  <Link
                    href={`/characters/${spouse.id}`}
                    className="text-gold-400 hover:text-gold-300 font-medium underline-offset-2 hover:underline"
                  >
                    {spouse.name || spouse.aliases[0] || `Character #${spouse.id}`} &rarr;
                  </Link>
                ) : (
                  <span className="text-slate-500">None recorded</span>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Television Adaptation Lore */}
          {(character.tvSeries.length > 0 || character.playedBy.length > 0) && (
            <GlassCard className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold border-b border-white/5 pb-2 flex items-center gap-2">
                <Tv className="w-3.5 h-3.5 text-blue-400" />
                <span>Screen Adaptation</span>
              </h3>
              <div className="space-y-3 text-xs">
                {character.playedBy.length > 0 && (
                  <div>
                    <span className="text-slate-500 block">Portrayed By</span>
                    <span className="text-slate-200 font-medium font-serif text-sm">
                      {character.playedBy.join(", ")}
                    </span>
                  </div>
                )}
                {character.tvSeries.length > 0 && (
                  <div>
                    <span className="text-slate-500 block mb-1">Seasons Appearing</span>
                    <div className="flex flex-wrap gap-1.5">
                      {character.tvSeries.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-white/5"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Column: House Allegiances & Canonical Books */}
        <div className="space-y-6 lg:col-span-2">
          {/* Noble Allegiances */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-gold-400" />
                <span>Noble Allegiances ({allegiances.filter(Boolean).length})</span>
              </h3>
              <span className="text-[11px] text-slate-500">Click to inspect house</span>
            </div>

            {allegiances.filter(Boolean).length === 0 ? (
              <p className="text-xs text-slate-500 py-3 italic">
                No direct noble house allegiances recorded in the archives.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allegiances.filter(Boolean).map((house) => (
                  <Link
                    key={house!.id}
                    href={`/houses/${house!.id}`}
                    className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-gold-500/40 transition-all group block"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-100 group-hover:text-gold-300 font-serif">
                        {house!.name}
                      </span>
                      <GlassBadge color="gold">{house!.region || "House"}</GlassBadge>
                    </div>
                    {house!.words && (
                      <p className="text-xs text-slate-400 italic">
                        &ldquo;{house!.words}&rdquo;
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>

          {/* POV Books Section */}
          {povBooks.filter(Boolean).length > 0 && (
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>POV Chapter Leadership ({povBooks.filter(Boolean).length} Volumes)</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {povBooks.filter(Boolean).map((book) => (
                  <Link
                    key={book!.id}
                    href={`/books/${book!.id}`}
                    className="p-3.5 rounded-xl bg-purple-950/20 hover:bg-purple-900/30 border border-purple-500/20 hover:border-purple-500/40 transition-all group block"
                  >
                    <div className="font-bold text-sm text-slate-100 group-hover:text-purple-300 font-serif">
                      {book!.name}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {book!.numberOfPages} pages · Released {book!.released.substring(0, 4)}
                    </p>
                  </Link>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Book Appearances */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Book Appearances ({books.filter(Boolean).length})</span>
              </h3>
            </div>

            {books.filter(Boolean).length === 0 ? (
              <p className="text-xs text-slate-500 py-3 italic">
                No canonical book appearances recorded.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {books.filter(Boolean).map((book) => (
                  <Link
                    key={book!.id}
                    href={`/books/${book!.id}`}
                    className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-emerald-500/40 transition-all group block"
                  >
                    <div className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 font-serif">
                      {book!.name}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {book!.numberOfPages} pages · Released {book!.released.substring(0, 4)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
