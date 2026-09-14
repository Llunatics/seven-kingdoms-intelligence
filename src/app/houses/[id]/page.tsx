import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Shield,
  Crown,
  Users,
  Sword,
  MapPin,
  Calendar,
  GitBranch,
  ArrowLeft,
  Castle,
} from "lucide-react";
import { GlassCard, GlassBadge } from "@/components/ui/glass-card";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { IntelligenceService } from "@/services/intelligenceService";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const house = await IntelligenceService.getHouseById(parseInt(id, 10));
  if (!house) {
    return { title: "House Not Found — Seven Kingdoms Intelligence" };
  }
  return {
    title: `${house.name} — Seven Kingdoms Intelligence`,
    description: `Heraldry and noble lineage of ${house.name}. Region: ${house.region || "Westeros"}. Motto: "${house.words || "Noble House"}".`,
  };
}

export default async function HouseDetailPage({ params }: Props) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) notFound();

  const house = await IntelligenceService.getHouseById(id);
  if (!house) notFound();

  let currentLord = null;
  if (house.currentLordId) {
    currentLord = await IntelligenceService.getCharacterById(house.currentLordId);
  }
  let heir = null;
  if (house.heirId) {
    heir = await IntelligenceService.getCharacterById(house.heirId);
  }
  let overlord = null;
  if (house.overlordId) {
    overlord = await IntelligenceService.getHouseById(house.overlordId);
  }
  let founder = null;
  if (house.founderId) {
    founder = await IntelligenceService.getCharacterById(house.founderId);
  }

  const cadetBranches = await Promise.all(
    house.cadetBranchIds.map((bid) => IntelligenceService.getHouseById(bid))
  );

  const swornMembers = await Promise.all(
    house.swornMemberIds.slice(0, 50).map((cid) => IntelligenceService.getCharacterById(cid))
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back breadcrumb */}
      <div>
        <Link
          href="/houses"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to House Explorer</span>
        </Link>
      </div>

      {/* Header Profile Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-gold-400">
                CITADEL RECORD #{house.id}
              </span>
              {house.region && <GlassBadge color="gold">{house.region}</GlassBadge>}
              {house.diedOut ? (
                <GlassBadge color="targaryen">Extinct ({house.diedOut})</GlassBadge>
              ) : (
                <GlassBadge color="green">Active Dynasty</GlassBadge>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-slate-100">
              {house.name}
            </h1>

            {house.words && (
              <p className="text-base sm:text-lg text-gold-300 italic font-serif">
                &ldquo;{house.words}&rdquo;
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <FavoriteButton
              entityType="house"
              entityId={house.id}
              name={house.name}
              subtitle={house.region}
            />
            <Link
              href={`/graph?focusHouseId=${house.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-medium"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>View in Graph</span>
            </Link>
          </div>
        </div>

        {/* Coat of Arms Blazon */}
        {house.coatOfArms && (
          <div className="pt-4 border-t border-white/5 space-y-1">
            <h4 className="text-xs uppercase font-mono text-slate-500 tracking-wider">
              Coat of Arms Blazon
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic bg-slate-900/40 p-3 rounded-xl border border-white/5">
              {house.coatOfArms}
            </p>
          </div>
        )}
      </div>

      {/* Grid: Left Column Rulers & Seats, Right Column Sworn Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lineage Leadership & Geography */}
        <div className="space-y-6 lg:col-span-1">
          <GlassCard className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold border-b border-white/5 pb-2">
              Dynastic Leadership
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Current Lord</span>
                {currentLord ? (
                  <Link
                    href={`/characters/${currentLord.id}`}
                    className="text-gold-400 hover:text-gold-300 font-medium underline-offset-2 hover:underline"
                  >
                    {currentLord.name || currentLord.aliases[0]} &rarr;
                  </Link>
                ) : (
                  <span className="text-slate-500">None / Unrecorded</span>
                )}
              </div>
              <div>
                <span className="text-slate-500 block">Heir Apparent</span>
                {heir ? (
                  <Link
                    href={`/characters/${heir.id}`}
                    className="text-gold-400 hover:text-gold-300 font-medium underline-offset-2 hover:underline"
                  >
                    {heir.name || heir.aliases[0]} &rarr;
                  </Link>
                ) : (
                  <span className="text-slate-500">None / Unrecorded</span>
                )}
              </div>
              <div>
                <span className="text-slate-500 block">Overlord House</span>
                {overlord ? (
                  <Link
                    href={`/houses/${overlord.id}`}
                    className="text-blue-400 hover:text-blue-300 font-medium underline-offset-2 hover:underline"
                  >
                    {overlord.name} &rarr;
                  </Link>
                ) : (
                  <span className="text-slate-500">Sovereign / None</span>
                )}
              </div>
              <div>
                <span className="text-slate-500 block">Historical Founder</span>
                {founder ? (
                  <Link
                    href={`/characters/${founder.id}`}
                    className="text-gold-400 hover:text-gold-300 font-medium underline-offset-2 hover:underline"
                  >
                    {founder.name || founder.aliases[0]} &rarr;
                  </Link>
                ) : (
                  <span className="text-slate-500">Ancient / Unknown</span>
                )}
              </div>
              <div>
                <span className="text-slate-500 block">Founded Era</span>
                <span className="text-slate-200">{house.founded || "Unrecorded in Citadel annals"}</span>
              </div>
            </div>
          </GlassCard>

          {/* Seats and Ancestral Weapons */}
          <GlassCard className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold border-b border-white/5 pb-2">
              Seats & Relics
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Ancestral Seats</span>
                {house.seats.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {house.seats.map((seat) => (
                      <span
                        key={seat}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-white/5 font-medium flex items-center gap-1"
                      >
                        <Castle className="w-3 h-3 text-gold-400" />
                        {seat}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500">No fixed seat recorded</span>
                )}
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Ancestral Weapons</span>
                {house.ancestralWeapons.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {house.ancestralWeapons.map((weapon) => (
                      <span
                        key={weapon}
                        className="px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/30 font-medium flex items-center gap-1"
                      >
                        <Sword className="w-3 h-3" />
                        {weapon}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500">None recorded</span>
                )}
              </div>

              {cadetBranches.filter(Boolean).length > 0 && (
                <div>
                  <span className="text-slate-500 block mb-1">Cadet Branches</span>
                  <div className="flex flex-wrap gap-1.5">
                    {cadetBranches.filter(Boolean).map((branch) => (
                      <Link
                        key={branch!.id}
                        href={`/houses/${branch!.id}`}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/20 text-xs"
                      >
                        {branch!.name} &rarr;
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Sworn Members */}
        <div className="space-y-6 lg:col-span-2">
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-gold-400" />
                <span>Sworn Members ({house.swornMemberIds.length})</span>
              </h3>
              <span className="text-[11px] text-slate-500">Click to view personnel dossier</span>
            </div>

            {swornMembers.filter(Boolean).length === 0 ? (
              <p className="text-xs text-slate-500 py-4 italic">
                No individual sworn members mapped to this house in the current register.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
                {swornMembers.filter(Boolean).map((member) => (
                  <Link
                    key={member!.id}
                    href={`/characters/${member!.id}`}
                    className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-gold-500/40 transition-all group block"
                  >
                    <div className="font-bold text-sm text-slate-100 group-hover:text-gold-300 font-serif line-clamp-1">
                      {member!.name || member!.aliases[0] || `Character #${member!.id}`}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {member!.titles[0] || member!.culture || "Sworn Member"}
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
