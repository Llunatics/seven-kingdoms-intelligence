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
  Sparkles,
  ArrowRight,
  Compass,
  Bookmark,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { GlassCard, GlassBadge } from "@/components/ui/glass-card";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Character, AnalyticsSummary } from "@/types/api";

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
      <section className="relative pt-6 pb-12 sm:py-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-950/40 border border-gold-500/30 text-gold-400 text-xs font-medium backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Citadel Archival Intelligence · An API of Ice and Fire</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 font-serif leading-tight">
            THE SEVEN KINGDOMS, <br />
            <span className="gold-gradient-text">MAPPED.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Explore characters, noble houses, chronicle books, and relationships
            across the universe of George R.R. Martin&apos;s <em>A Song of Ice and Fire</em>.
          </p>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-slate-950 hover:bg-gold-400 font-semibold text-sm transition-all shadow-lg hover:shadow-gold-500/20"
          >
            <Users className="w-4 h-4" />
            <span>Explore Characters</span>
          </Link>
          <Link
            href="/houses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 border border-white/10 font-medium text-sm transition-all"
          >
            <Shield className="w-4 h-4 text-gold-400" />
            <span>Explore Houses</span>
          </Link>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 border border-white/10 font-medium text-sm transition-all"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Explore Books</span>
          </Link>
          <Link
            href="/graph"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 border border-gold-500/30 font-medium text-sm transition-all"
          >
            <GitBranch className="w-4 h-4 text-gold-400" />
            <span>Knowledge Graph</span>
          </Link>
        </div>
      </section>

      {/* World Statistics Overview Dashboard */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono tracking-widest uppercase text-slate-400 font-semibold">
            Citadel Registry Metrics
          </h2>
          <span className="text-xs text-slate-500 font-mono">100% Canonical Data</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard variant="interactive" className="space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Characters</span>
              <Users className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-serif">
              {stats?.totalCharacters.toLocaleString() || "2,134"}
            </div>
            <p className="text-[11px] text-slate-500">Documented figures & aliases</p>
          </GlassCard>

          <GlassCard variant="interactive" className="space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Noble Houses</span>
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-serif">
              {stats?.totalHouses.toLocaleString() || "444"}
            </div>
            <p className="text-[11px] text-slate-500">From the Wall to Dorne</p>
          </GlassCard>

          <GlassCard variant="interactive" className="space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Chronicle Books</span>
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-serif">
              {stats?.totalBooks || "12"}
            </div>
            <p className="text-[11px] text-slate-500">Canonical novels & novellas</p>
          </GlassCard>

          <GlassCard variant="interactive" className="space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">POV Characters</span>
              <Compass className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-serif">
              {stats?.povCharactersCount || "31"}
            </div>
            <p className="text-[11px] text-slate-500">Perspective viewpoint leaders</p>
          </GlassCard>
        </div>
      </section>

      {/* Featured / Random Character Spotlight */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 relative overflow-hidden">
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
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono tracking-widest uppercase text-slate-400 font-semibold">
            The Great Houses
          </h2>
          <Link href="/houses" className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1">
            <span>View all 444 Houses</span>
            <ArrowRight className="w-3 h-3" />
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
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold font-serif text-slate-100">
            Explore the Realm
          </h2>
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
