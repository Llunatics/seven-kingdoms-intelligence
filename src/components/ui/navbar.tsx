"use client";

import React, { useState, useEffect } from "react";
import Link from "next/navigation";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Crown,
  Search,
  Users,
  Shield,
  BookOpen,
  GitBranch,
  BarChart3,
  Dices,
  Bookmark,
  Menu,
  X,
  Scale,
} from "lucide-react";
import { SearchCommand } from "./search-command";
import { FavoriteItem } from "@/types/api";

const navLinks = [
  { name: "Characters", href: "/characters", icon: Users },
  { name: "Houses", href: "/houses", icon: Shield },
  { name: "Books", href: "/books", icon: BookOpen },
  { name: "Graph", href: "/graph", icon: GitBranch },
  { name: "Compare", href: "/compare", icon: Scale },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Game", href: "/game", icon: Dices },
];

export function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Update favorite count
  const updateFavoriteCount = () => {
    try {
      const stored = localStorage.getItem("seven_kingdoms_favorites");
      if (stored) {
        const items: FavoriteItem[] = JSON.parse(stored);
        setFavoriteCount(items.length);
      } else {
        setFavoriteCount(0);
      }
    } catch {
      setFavoriteCount(0);
    }
  };

  useEffect(() => {
    updateFavoriteCount();
    window.addEventListener("favoritesUpdated", updateFavoriteCount);
    window.addEventListener("storage", updateFavoriteCount);
    return () => {
      window.removeEventListener("favoritesUpdated", updateFavoriteCount);
      window.removeEventListener("storage", updateFavoriteCount);
    };
  }, []);

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 sm:top-3 z-40 w-full px-2 sm:px-6 transition-all">
        <div className="mx-auto max-w-7xl glass-panel rounded-none sm:rounded-2xl border-x-0 sm:border-x border-t-0 sm:border-t border-b border-white/10 px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-2xl relative overflow-hidden">
          {/* Gold hairline along the top edge */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" aria-hidden="true" />
          {/* Logo & Brand */}
          <NextLink href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500/30 to-amber-950/50 border border-gold-500/40 flex items-center justify-center text-gold-400 group-hover:border-gold-400 group-hover:shadow-[0_0_16px_rgba(200,155,60,0.35)] transition-all shadow-sm">
              <Crown className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold tracking-[0.28em] text-gold-400 uppercase font-mono leading-tight">
                Seven Kingdoms
              </span>
              <span className="text-base font-bold tracking-[0.14em] text-slate-100 uppercase leading-none font-display">
                Intelligence
              </span>
            </div>
          </NextLink>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <NextLink
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-slate-800 text-gold-300 border border-gold-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute -bottom-[1px] left-3 right-3 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" aria-hidden="true" />
                  )}
                </NextLink>
              );
            })}
          </nav>

          {/* Actions: Search & Favorites */}
          <div className="flex items-center gap-2">
            {/* Command Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search the Citadel"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-white/10 text-slate-400 hover:text-slate-200 hover:border-gold-500/30 text-xs transition-all"
            >
              <Search className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline font-mono text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-white/5">
                ⌘K
              </kbd>
            </button>

            {/* Favorites Icon */}
            <NextLink
              href="/favorites"
              aria-label="View Saved Favorites"
              className={`relative p-2 rounded-lg border transition-all ${
                pathname === "/favorites"
                  ? "bg-gold-500/20 text-gold-300 border-gold-500/40"
                  : "bg-slate-900/50 text-slate-400 border-white/10 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shadow">
                  {favoriteCount > 9 ? "9+" : favoriteCount}
                </span>
              )}
            </NextLink>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-lg bg-slate-900/50 text-slate-300 border border-white/10 hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mx-auto max-w-7xl mt-2 glass-panel rounded-2xl border border-white/10 p-3 shadow-2xl animate-fade-in">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <NextLink
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-gold-500/15 text-gold-300 border border-gold-500/30"
                        : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-gold-400" />
                    <span>{link.name}</span>
                  </NextLink>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Global Command Palette Dialog */}
      <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
