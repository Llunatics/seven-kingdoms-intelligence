"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Crown,
  Users,
  Shield,
  BookOpen,
  GitBranch,
  BarChart3,
  Dices,
  Scale,
  ArrowRight,
  Compass,
  Bookmark,
  RefreshCw,
} from "lucide-react";
import { GlassCard, GlassBadge } from "@/components/ui/glass-card";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Character, AnalyticsSummary } from "@/types/api";

const EMBERS = [
  { left: "8%", size: 5, duration: 11, delay: 0 },
  { left: "18%", size: 3, duration: 14, delay: 2.5 },
  { left: "27%", size: 4, duration: 9, delay: 5 },
  { left: "36%", size: 3, duration: 13, delay: 1.2 },
  { left: "47%", size: 6, duration: 10, delay: 3.8 },
  { left: "55%", size: 3, duration: 15, delay: 6.5 },
  { left: "64%", size: 4, duration: 12, delay: 0.8 },
  { left: "72%", size: 3, duration: 9.5, delay: 4.2 },
  { left: "81%", size: 5, duration: 13.5, delay: 2 },
  { left: "90%", size: 3, duration: 11.5, delay: 7 },
  { left: "13%", size: 4, duration: 12.5, delay: 8.5 },
  { left: "42%", size: 3, duration: 10.5, delay: 9.5 },
  { left: "60%", size: 5, duration: 14.5, delay: 5.5 },
  { left: "86%", size: 4, duration: 10, delay: 3 },
];

export default function HomePage() {
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [randomChar, setRandomChar] = useState<Character | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch summary stats on load
  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to load stats:", err));

    fetchRandomCharacter();
  }, []);

  const fetchRandomCharacter = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/random-character");
      if (res.ok) {
        const char = await res.json();
        setRandomChar(char);
      }
    } catch (err) {
      console.error("Failed to fetch random character:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const featureCards = [
    {
      title: "Character Explorer",
      desc: "Investigate over 2,100 canonical figures, aliases, cultures, family lineages, and allegiances.",
      href: "/characters",
      icon: Users,
      badge: "2,134 Records",
      color: "gold" as const,
    },
    {
      title: "House Heraldry",
      desc: "Survey 444 noble houses, their ancestral sigils, seats, words of power, and sworn lords.",
      href: "/houses",
      icon: Shield,
      badge: "444 Dynasties",
      color: "stark" as const,
    },
    {
      title: "Chronicle Books",
      desc: "Browse George R.R. Martin's published volumes, novella collections, POV chapters, and chronology.",
      href: "/books",
      icon: BookOpen,
      badge: "12 Books",
      color: "green" as const,
    },
    {
      title: "Knowledge Graph",
      desc: "Interactive visual network mapping allegiances, appearances, and family lineages with React Flow.",
      href: "/graph",
      icon: GitBranch,
      badge: "Interactive Graph",
      color: "gold" as const,
    },
    {
      title: "Character Comparison",
      desc: "Place key players side-by-side to contrast allegiances, titles, book count, and TV appearances.",
      href: "/compare",
      icon: Scale,
      badge: "Side-by-Side",
      color: "lannister" as const,
    },
    {
      title: "Realm Analytics",
      desc: "Explore cultural distributions, regional hegemony, and publication timelines with Recharts.",
      href: "/analytics",
      icon: BarChart3,
      badge: "Data Intelligence",
      color: "targaryen" as const,
    },
    {
      title: "Guess the Character",
      desc: "Test your mastery of the realm through progressive clues derived from authentic lore.",
      href: "/game",
      icon: Dices,
      badge: "Trivia Mini-Game",
      color: "martell" as const,
    },
    {
      title: "Saved Bookmarks",
      desc: "Curate your own council of favorite figures, sworn houses, and books with client persistence.",
      href: "/favorites",
      icon: Bookmark,
      badge: "Local Archive",
      color: "default" as const,
    },
  ];

  const greatHouses = [
    { name: "House Stark", id: 362, words: "Winter is Coming", region: "The North", color: "stark" as const },
    { name: "House Targaryen", id: 378, words: "Fire and Blood", region: "Valyria / Dragonstone", color: "targaryen" as const },
    { name: "House Lannister", id: 229, words: "Hear Me Roar!", region: "The Westerlands", color: "lannister" as const },
    { name: "House Baratheon", id: 17, words: "Ours is the Fury", region: "The Stormlands", color: "baratheon" as const },
    { name: "House Greyjoy", id: 169, words: "We Do Not Sow", region: "Iron Islands", color: "greyjoy" as const },
    { name: "House Martell", id: 285, words: "Unbowed, Unbent, Unbroken", region: "Dorne", color: "martell" as const },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative pt-8 pb-14 sm:py-20 text-center overflow-hidden candle-glow">
        {/* Rising ember particles */}
        <div className="ember-field" aria-hidden="true">
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className="ember"
              style={{
                left: e.left,
                width: e.size,
                height: e.size,
                animationDuration: `${e.duration}s`,
                animationDelay: `${e.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="relative space-y-7">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gold-950/40 border border-gold-500/30 text-gold-300 text-xs font-medium backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rotate-45 bg-gold-400 shadow-[0_0_8px_rgba(223,183,108,0.8)]" />
            <span className="tracking-wide">Citadel Archival Intelligence · An API of Ice and Fire</span>
          </div>

          <div className="space-y-5 max-w-4xl mx-auto">
            <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.35em] text-gold-500/80">
              A Song of Ice and Fire
            </p>
            <h1 className="font-display font-bold tracking-wide text-slate-100 leading-[1.05]">
              <span className="block text-4xl sm:text-6xl lg:text-7xl">THE SEVEN KINGDOMS</span>
              <span className="block text-5xl sm:text-7xl lg:text-8xl gold-gradient-text mt-2">MAPPED.</span>
            </h1>
            <div className="rune-divider max-w-md mx-auto pt-1" aria-hidden="true">
              <span className="rune-diamond" />
            </div>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Explore characters, noble houses, chronicle books, and relationships
              across the universe of George R.R. Martin&apos;s{" "}
              <em className="text-slate-300">A Song of Ice and Fire</em> — charted
              like a maester&apos;s war-room atlas.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 text-slate-950 hover:bg-gold-400 font-semibold text-sm transition-all shadow-lg hover:shadow-gold-500/25 hover:-translate-y-0.5"
            >
              <Users className="w-4 h-4" />
              <span>Explore Characters</span>
            </Link>
            <Link
              href="/houses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 border border-white/10 font-medium text-sm transition-all hover:-translate-y-0.5"
            >
              <Shield className="w-4 h-4 text-gold-400" />
              <span>Explore Houses</span>
            </Link>
            <Link
              href="/graph"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 border border-gold-500/30 font-medium text-sm transition-all hover:-translate-y-0.5"
            >
              <GitBranch className="w-4 h-4 text-gold-400" />
              <span>Knowledge Graph</span>
            </Link>
          </div>
        </div>
      </section>

      {/* World Statistics Overview Dashboard */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-display font-semibold tracking-[0.2em] uppercase text-gold-400">
            Citadel Registry Metrics
          </h2>
          <span className="text-xs text-slate-500 font-mono">100% Canonical Data</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard variant="interactive" className="space-y-2 overflow-hidden">
            <div className="h-px -mx-5 -mt-5 mb-3 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Characters</span>
              <Users className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tabular-nums">
              {stats?.totalCharacters.toLocaleString() || "2,134"}
            </div>
            <p className="text-[11px] text-slate-500">Documented figures & aliases</p>
          </GlassCard>

          <GlassCard variant="interactive" className="space-y-2 overflow-hidden">
            <div className="h-px -mx-5 -mt-5 mb-3 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Noble Houses</span>
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tabular-nums">
              {stats?.totalHouses.toLocaleString() || "444"}
            </div>
            <p className="text-[11px] text-slate-500">From the Wall to Dorne</p>
          </GlassCard>

          <GlassCard variant="interactive" className="space-y-2 overflow-hidden">
            <div className="h-px -mx-5 -mt-5 mb-3 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Chronicle Books</span>
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tabular-nums">
              {stats?.totalBooks || "12"}
            </div>
            <p className="text-[11px] text-slate-500">Canonical novels & novellas</p>
          </GlassCard>

          <GlassCard variant="interactive" className="space-y-2 overflow-hidden">
            <div className="h-px -mx-5 -mt-5 mb-3 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">POV Characters</span>
              <Compass className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-display tabular-nums">
              {stats?.povCharactersCount || "31"}
            </div>
            <p className="text-[11px] text-slate-500">Perspective viewpoint leaders</p>
          </GlassCard>
        </div>
      </section>

      {/* Featured / Random Character Spotlight */}
      <section className="glass-panel iron-frame p-6 sm:p-8 rounded-2xl space-y-6 relative overflow-hidden parchment-sheen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-gold-400" />
              <h3 className="text-base font-semibold text-slate-100">Character Spotlight</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20 font-mono">
                Random Generator
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Discover historical actors, sworn lords, and key figures across the realm.
            </p>
          </div>

          <button
            onClick={fetchRandomCharacter}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-medium transition-all self-start sm:self-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gold-400 ${isGenerating ? "animate-spin" : ""}`} />
            <span>Generate Another</span>
          </button>
        </div>

        {randomChar && (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-xl sm:text-2xl font-bold text-slate-100 font-serif">
                  {randomChar.name || randomChar.aliases[0] || `Character #${randomChar.id}`}
                </h4>
                {randomChar.culture && (
                  <GlassBadge color="gold">{randomChar.culture}</GlassBadge>
                )}
                {randomChar.gender && (
                  <GlassBadge>{randomChar.gender}</GlassBadge>
                )}
              </div>

              {randomChar.aliases.length > 0 && (
                <p className="text-xs text-slate-400">
                  <span className="text-slate-500">Also known as:</span>{" "}
                  {randomChar.aliases.slice(0, 3).join(", ")}
                </p>
              )}

              {randomChar.titles.length > 0 && (
                <p className="text-xs text-slate-400">
                  <span className="text-slate-500">Titles:</span>{" "}
                  {randomChar.titles.slice(0, 2).join(", ")}
                </p>
              )}

              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
                <span>
                  <strong>{randomChar.bookIds.length}</strong> Book Appearances
                </span>
                <span>·</span>
                <span>
                  <strong>{randomChar.allegianceIds.length}</strong> House Allegiances
                </span>
                {randomChar.playedBy.length > 0 && (
                  <>
                    <span>·</span>
                    <span>
                      Portrayed by <strong>{randomChar.playedBy[0]}</strong>
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <FavoriteButton
                entityType="character"
                entityId={randomChar.id}
                name={randomChar.name || `Character #${randomChar.id}`}
                subtitle={randomChar.culture || "Westeros"}
              />
              <Link
                href={`/characters/${randomChar.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-semibold transition-all"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Great Houses Quick Access Strip */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-display font-semibold tracking-[0.2em] uppercase text-gold-400">
            The Great Houses
          </h2>
          <Link href="/houses" className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 group">
            <span>View all 444 Houses</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {greatHouses.map((h) => (
            <Link key={h.id} href={`/houses/${h.id}`}>
              <GlassCard
                variant="interactive"
                className="p-4 space-y-2 text-left hover:border-gold-500/40 h-full flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <GlassBadge color={h.color}>{h.region}</GlassBadge>
                  <h4 className="text-sm font-bold text-slate-100 font-serif pt-1">{h.name}</h4>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  {h.words ? `&ldquo;${h.words}&rdquo;` : "Noble House"}
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore The Realm Intelligence Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-wide text-slate-100">
            Explore the Realm
          </h2>
          <div className="rune-divider max-w-xs mx-auto" aria-hidden="true">
            <span className="rune-diamond" />
          </div>
          <p className="text-sm text-slate-400">
            Specialized exploration modules engineered for deep genealogical, heraldic, and textual discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} href={card.href} className="group">
                <GlassCard
                  variant="interactive"
                  className="h-full flex flex-col justify-between p-5 space-y-4 group-hover:border-gold-500/30"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-gold-400 group-hover:scale-105 group-hover:border-gold-500/40 transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <GlassBadge color={card.color}>{card.badge}</GlassBadge>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-slate-100 group-hover:text-gold-300 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center text-xs font-medium text-gold-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore Module</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
