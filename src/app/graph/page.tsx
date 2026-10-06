"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Handle,
  Position,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  GitBranch,
  Search,
  Users,
  Shield,
  BookOpen,
  Filter,
  RefreshCw,
  X,
  ArrowRight,
  Maximize2,
  Info,
} from "lucide-react";
import { GlassCard, GlassBadge } from "@/components/ui/glass-card";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { GraphData, EntityType } from "@/types/api";

// Custom Liquid Glass Nodes
function CharacterNode({ data }: { data: any }) {
  return (
    <div className="px-3.5 py-2.5 rounded-xl glass-panel border border-gold-500/40 hover:border-gold-400 bg-slate-900/90 text-slate-100 shadow-xl transition-all cursor-pointer min-w-[150px] max-w-[200px]">
      <Handle type="target" position={Position.Top} className="!bg-gold-400 !w-2 !h-2" />
      <div className="flex items-center gap-1.5 mb-1">
        <Users className="w-3.5 h-3.5 text-gold-400 shrink-0" />
        <span className="text-[10px] font-mono text-gold-400 font-bold uppercase tracking-wider">
          Character
        </span>
      </div>
      <div className="font-bold text-xs font-serif text-slate-100 truncate">
        {data.label}
      </div>
      {data.subtitle && (
        <div className="text-[10px] text-slate-400 truncate mt-0.5">{data.subtitle}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-gold-400 !w-2 !h-2" />
    </div>
  );
}

function HouseNode({ data }: { data: any }) {
  return (
    <div className="px-3.5 py-2.5 rounded-xl glass-panel border border-blue-500/40 hover:border-blue-400 bg-slate-900/90 text-slate-100 shadow-xl transition-all cursor-pointer min-w-[160px] max-w-[220px]">
      <Handle type="target" position={Position.Top} className="!bg-blue-400 !w-2 !h-2" />
      <div className="flex items-center gap-1.5 mb-1">
        <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
          House
        </span>
      </div>
      <div className="font-bold text-xs font-serif text-slate-100 truncate">
        {data.label}
      </div>
      {data.subtitle && (
        <div className="text-[10px] text-slate-400 truncate mt-0.5">{data.subtitle}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-blue-400 !w-2 !h-2" />
    </div>
  );
}

function BookNode({ data }: { data: any }) {
  return (
    <div className="px-3.5 py-2.5 rounded-xl glass-panel border border-emerald-500/40 hover:border-emerald-400 bg-slate-900/90 text-slate-100 shadow-xl transition-all cursor-pointer min-w-[150px] max-w-[200px]">
      <Handle type="target" position={Position.Top} className="!bg-emerald-400 !w-2 !h-2" />
      <div className="flex items-center gap-1.5 mb-1">
        <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
          Chronicle
        </span>
      </div>
      <div className="font-bold text-xs font-serif text-slate-100 truncate">
        {data.label}
      </div>
      {data.subtitle && (
        <div className="text-[10px] text-slate-400 truncate mt-0.5">{data.subtitle}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-400 !w-2 !h-2" />
    </div>
  );
}

export default function GraphPage() {
  const nodeTypes = useMemo(
    () => ({
      characterNode: CharacterNode,
      houseNode: HouseNode,
      bookNode: BookNode,
    }),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected Node Details
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    entityId: number;
    type: EntityType;
    label: string;
    subtitle?: string;
    metadata?: any;
  } | null>(null);

  // Filters
  const [includeHouses, setIncludeHouses] = useState(true);
  const [includeCharacters, setIncludeCharacters] = useState(true);
  const [includeBooks, setIncludeBooks] = useState(true);

  // Preset Focus Selectors
  const [presetFaction, setPresetFaction] = useState<string>("stark");

  const loadGraph = useCallback(
    async (params: Record<string, string> = {}) => {
      setIsLoading(true);
      try {
        const q = new URLSearchParams(params);
        q.set("includeHouses", String(includeHouses));
        q.set("includeCharacters", String(includeCharacters));
        q.set("includeBooks", String(includeBooks));

        const res = await fetch(`/api/graph?${q.toString()}`);
        if (!res.ok) throw new Error("Failed to load relationship graph");
        const data: GraphData = await res.json();

        // Format edges with dark-aesthetic styling
        const styledEdges = data.edges.map((e) => ({
          ...e,
          animated: true,
          style: { stroke: "#dfb76c", strokeWidth: 1.5, opacity: 0.6 },
          labelStyle: { fill: "#dfb76c", fontSize: 9, fontFamily: "monospace" },
          labelBgStyle: { fill: "#0e1118", fillOpacity: 0.85 },
        }));

        setNodes(data.nodes as Node[]);
        setEdges(styledEdges as Edge[]);
      } catch (err) {
        console.error("Graph loading error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [includeHouses, includeCharacters, includeBooks, setNodes, setEdges]
  );

  useEffect(() => {
    // Initial load with House Stark as default focus
    loadGraph({ focusHouseId: "362" });
  }, [loadGraph]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    const data = node.data as any;
    setSelectedNode({
      id: node.id,
      entityId: data.entityId,
      type: data.type,
      label: data.label,
      subtitle: data.subtitle,
      metadata: data,
    });
  };

  const handleFactionChange = (val: string) => {
    setPresetFaction(val);
    if (val === "stark") loadGraph({ focusHouseId: "362" });
    else if (val === "targaryen") loadGraph({ focusHouseId: "378" });
    else if (val === "lannister") loadGraph({ focusHouseId: "229" });
    else if (val === "baratheon") loadGraph({ focusHouseId: "17" });
    else if (val === "jon") loadGraph({ focusCharacterId: "583" });
    else if (val === "daenerys") loadGraph({ focusCharacterId: "271" });
    else if (val === "tyrion") loadGraph({ focusCharacterId: "1052" });
    else loadGraph();
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-wide text-slate-100 flex items-center gap-2">
              <span>Interactive Knowledge Graph</span>
              <GlassBadge color="gold">React Flow</GlassBadge>
            </h1>
            <p className="text-xs text-slate-400">
              Visualizing allegiances, appearances, and lineage networks across the Seven Kingdoms.
            </p>
          </div>
        </div>

        {/* Faction Focal Point Select */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Focal Entity:</span>
            <select
              value={presetFaction}
              onChange={(e) => handleFactionChange(e.target.value)}
              className="glass-input px-3 py-1.5 rounded-lg text-xs font-medium"
            >
              <option value="stark" className="bg-slate-900">House Stark (Winterfell)</option>
              <option value="targaryen" className="bg-slate-900">House Targaryen</option>
              <option value="lannister" className="bg-slate-900">House Lannister (Casterly Rock)</option>
              <option value="baratheon" className="bg-slate-900">House Baratheon</option>
              <option value="jon" className="bg-slate-900">Jon Snow</option>
              <option value="daenerys" className="bg-slate-900">Daenerys Targaryen</option>
              <option value="tyrion" className="bg-slate-900">Tyrion Lannister</option>
              <option value="all" className="bg-slate-900">The Great Houses Realm</option>
            </select>
          </div>

          {/* Type Toggles */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900/60 border border-white/10 text-xs">
            <button
              onClick={() => setIncludeHouses(!includeHouses)}
              className={`px-2.5 py-1 rounded transition-all ${
                includeHouses ? "bg-blue-500/20 text-blue-300 font-bold" : "text-slate-500"
              }`}
            >
              Houses
            </button>
            <button
              onClick={() => setIncludeCharacters(!includeCharacters)}
              className={`px-2.5 py-1 rounded transition-all ${
                includeCharacters ? "bg-gold-500/20 text-gold-300 font-bold" : "text-slate-500"
              }`}
            >
              Characters
            </button>
            <button
              onClick={() => setIncludeBooks(!includeBooks)}
              className={`px-2.5 py-1 rounded transition-all ${
                includeBooks ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-500"
              }`}
            >
              Books
            </button>
          </div>
        </div>
      </div>

      {/* Graph Canvas Workspace with Floating Side-Over Details Panel */}
      <div className="relative w-full h-[72vh] glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Loading overlay while the graph assembles */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#0b0e14]/80 backdrop-blur-sm">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-gold-500/20 border-t-gold-400 animate-spin" />
              <GitBranch className="w-5 h-5 text-gold-400 absolute inset-0 m-auto" />
            </div>
            <p className="text-sm text-slate-300 font-display tracking-wide">
              Charting the realm&apos;s allegiances…
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Consulting the Citadel archives
            </p>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2.5}
        >
          <Background color="rgba(255, 255, 255, 0.04)" gap={24} size={1} />
          <Controls className="!bg-slate-900/90 !border-white/10 !text-slate-300 !fill-slate-300 rounded-xl" />
          <MiniMap
            className="!bg-slate-950/80 !border-white/10 rounded-xl overflow-hidden shadow-lg hidden sm:block"
            nodeColor={(node: any) => {
              if (node.type === "houseNode") return "#3b82f6";
              if (node.type === "bookNode") return "#34d399";
              return "#c89b3c";
            }}
          />
        </ReactFlow>

        {/* Legend Overlay at Bottom-Left */}
        <div className="absolute bottom-4 left-4 z-10 glass-panel p-3 rounded-xl border border-white/10 space-y-1.5 text-[11px] text-slate-300 hidden md:block">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
            Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-400" />
            <span>Character</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span>House</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Chronicle Book</span>
          </div>
        </div>

        {/* Slide-over Liquid Glass Detail Panel on the right */}
        {selectedNode && (
          <div className="absolute top-4 right-4 z-20 w-80 sm:w-96 glass-panel p-5 rounded-2xl border border-gold-500/30 shadow-2xl space-y-4 animate-fade-in max-h-[90%] overflow-y-auto">
            <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
              <div className="space-y-1">
                <GlassBadge
                  color={
                    selectedNode.type === "character"
                      ? "gold"
                      : selectedNode.type === "house"
                      ? "stark"
                      : "green"
                  }
                >
                  {selectedNode.type.toUpperCase()}
                </GlassBadge>
                <h3 className="font-bold text-lg text-slate-100 font-serif">
                  {selectedNode.label}
                </h3>
                {selectedNode.subtitle && (
                  <p className="text-xs text-slate-400">{selectedNode.subtitle}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Entity metadata details */}
            <div className="space-y-2 text-xs text-slate-300">
              {selectedNode.metadata.words && (
                <div>
                  <span className="text-slate-500 block">House Motto</span>
                  <span className="text-gold-300 italic">
                    &ldquo;{selectedNode.metadata.words}&rdquo;
                  </span>
                </div>
              )}
              {selectedNode.metadata.culture && (
                <div>
                  <span className="text-slate-500 block">Culture</span>
                  <span>{selectedNode.metadata.culture}</span>
                </div>
              )}
              {selectedNode.metadata.region && (
                <div>
                  <span className="text-slate-500 block">Region</span>
                  <span>{selectedNode.metadata.region}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
              <FavoriteButton
                entityType={selectedNode.type}
                entityId={selectedNode.entityId}
                name={selectedNode.label}
              />
              <Link
                href={`/${
                  selectedNode.type === "character"
                    ? "characters"
                    : selectedNode.type === "house"
                    ? "houses"
                    : "books"
                }/${selectedNode.entityId}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gold-500 text-slate-950 hover:bg-gold-400 font-semibold text-xs transition-all shadow"
              >
                <span>Open Full Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
