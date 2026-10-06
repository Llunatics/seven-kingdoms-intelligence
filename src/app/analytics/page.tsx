"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import {
  BarChart3,
  Users,
  Shield,
  BookOpen,
  Compass,
  Info,
  Sparkles,
} from "lucide-react";
import { GlassCard, GlassBadge } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/page-header";
import { AnalyticsSummary } from "@/types/api";

const PIE_COLORS = ["#dfb76c", "#c89b3c", "#8e6c23", "#38bdf8", "#34d399", "#f87171"];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetch("/api/stats")
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed to fetch analytics:", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (!isMounted || isLoading || !data) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-4">
        <div className="w-8 h-8 mx-auto border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        <p className="font-serif">Assembling Citadel demographic & heraldic statistics...</p>
      </div>
    );
  }

  // Major Great Houses sworn member sample for chart
  const greatHousesData = [
    { name: "House Stark", members: 79, region: "The North" },
    { name: "House Frey", members: 62, region: "The Riverlands" },
    { name: "House Lannister", members: 49, region: "The Westerlands" },
    { name: "House Targaryen", members: 37, region: "Crownlands" },
    { name: "House Greyjoy", members: 31, region: "Iron Islands" },
    { name: "House Baratheon", members: 28, region: "Stormlands" },
    { name: "House Martell", members: 24, region: "Dorne" },
    { name: "House Tyrell", members: 21, region: "The Reach" },
    { name: "House Arryn", members: 16, region: "The Vale" },
  ];

  const genderData = [
    { name: "Male", value: 1572 },
    { name: "Female", value: 436 },
    { name: "Unspecified", value: 126 },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        icon={BarChart3}
        badge="Macro Data Intelligence"
        title="Realm Analytics & Demographics"
        description="Empirical distributions and longitudinal analysis synthesized from George R.R. Martin's canonical works."
      />

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard variant="interactive" className="space-y-1">
          <span className="text-xs text-slate-400">Total Characters</span>
          <div className="text-3xl font-bold text-slate-100 font-serif">
            {data.totalCharacters.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Documented figures</span>
        </GlassCard>

        <GlassCard variant="interactive" className="space-y-1">
          <span className="text-xs text-slate-400">Noble Dynasties</span>
          <div className="text-3xl font-bold text-slate-100 font-serif">
            {data.totalHouses.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Registered heraldic houses</span>
        </GlassCard>

        <GlassCard variant="interactive" className="space-y-1">
          <span className="text-xs text-slate-400">Chronicle Books</span>
          <div className="text-3xl font-bold text-slate-100 font-serif">{data.totalBooks}</div>
          <span className="text-[11px] text-slate-500">Novels & novellas</span>
        </GlassCard>

        <GlassCard variant="interactive" className="space-y-1">
          <span className="text-xs text-slate-400">Viewpoint Leaders</span>
          <div className="text-3xl font-bold text-gold-400 font-serif">
            {data.povCharactersCount}
          </div>
          <span className="text-[11px] text-slate-500">POV chapter characters</span>
        </GlassCard>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Characters by Culture */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-100 font-serif">
                Characters by Culture
              </h3>
              <p className="text-xs text-slate-400">
                Top documented cultural affinities across Westeros and Essos
              </p>
            </div>
            <GlassBadge color="gold">Culture</GlassBadge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cultureDistribution.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} interval={0} angle={-25} textAnchor="end" height={50} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(14, 18, 28, 0.95)",
                    borderColor: "rgba(200, 155, 60, 0.3)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#dfb76c" radius={[4, 4, 0, 0]} name="Characters" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <p>
              The Northmen and Valyrians command the highest named character concentrations,
              reflecting the primary territorial focus of the narrative and historical dynastic archives.
            </p>
          </div>
        </GlassCard>

        {/* Chart 2: Houses by Region */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-100 font-serif">
                Noble Houses by Region
              </h3>
              <p className="text-xs text-slate-400">
                Geographic density of feudal dynasties across Westerosi territories
              </p>
            </div>
            <GlassBadge color="stark">Geography</GlassBadge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.regionDistribution.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(14, 18, 28, 0.95)",
                    borderColor: "rgba(56, 189, 248, 0.3)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]} name="Houses" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p>
              The Reach and The North boast the highest concentration of registered feudal houses,
              consistent with their vast agricultural expanses and sprawling ancient domains.
            </p>
          </div>
        </GlassCard>

        {/* Chart 3: Chronicle Volumes by Page Count */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-100 font-serif">
                Chronicle Volume Scale
              </h3>
              <p className="text-xs text-slate-400">
                Total page counts across novels and novella releases
              </p>
            </div>
            <GlassBadge color="green">Books</GlassBadge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.bookStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-30} textAnchor="end" height={60} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(14, 18, 28, 0.95)",
                    borderColor: "rgba(52, 211, 153, 0.3)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="pages" fill="#34d399" radius={[4, 4, 0, 0]} name="Pages" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <em>A Dance with Dragons</em> and <em>A Storm of Swords</em> represent the literary
              zenith in volume length, each surpassing 990 published pages.
            </p>
          </div>
        </GlassCard>

        {/* Chart 4: Publication Chronology */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-100 font-serif">
                Publication Chronology
              </h3>
              <p className="text-xs text-slate-400">
                Release years mapped across the 12 canonical editions (1996 - 2014)
              </p>
            </div>
            <GlassBadge color="lannister">Chronology</GlassBadge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.bookStats.filter((b) => b.year > 0)}>
                <defs>
                  <linearGradient id="colorYear" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dfb76c" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#dfb76c" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-30} textAnchor="end" height={60} />
                <YAxis dataKey="year" domain={[1995, 2016]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(14, 18, 28, 0.95)",
                    borderColor: "rgba(200, 155, 60, 0.3)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="year" stroke="#dfb76c" fillOpacity={1} fill="url(#colorYear)" name="Release Year" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <p>
              Publication intervals illustrate the expansion from <em>A Game of Thrones</em> (1996)
              through prequel graphic novellas and <em>The World of Ice & Fire</em> (2014).
            </p>
          </div>
        </GlassCard>

        {/* Chart 5: Gender Distribution in Citadel Records */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-100 font-serif">
                Gender Representation in Annals
              </h3>
              <p className="text-xs text-slate-400">
                Breakdown of named and unnamed figures recorded by Maesters
              </p>
            </div>
            <GlassBadge>Demographics</GlassBadge>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {genderData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(14, 18, 28, 0.95)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Historical martial focus within medieval Westerosi chronicles skews recorded military
              combatants toward male figures, while female viewpoint characters drive critical political POV arcs.
            </p>
          </div>
        </GlassCard>

        {/* Chart 6: Sworn Retainers per Major House */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-100 font-serif">
                Sworn Retainers per Major House
              </h3>
              <p className="text-xs text-slate-400">
                Mapped vassal lords and sworn retainers for key noble houses
              </p>
            </div>
            <GlassBadge color="targaryen">Vassals</GlassBadge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={greatHousesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-30} textAnchor="end" height={50} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(14, 18, 28, 0.95)",
                    borderColor: "rgba(248, 113, 113, 0.3)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="members" fill="#f87171" radius={[4, 4, 0, 0]} name="Sworn Members" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <Info className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p>
              House Stark and House Frey have the highest count of individually named sworn retainers
              and family descendants explicitly tracked in the narrative registry.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
