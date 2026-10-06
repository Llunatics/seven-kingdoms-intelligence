"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dices,
  Trophy,
  Flame,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Shield,
  BookOpen,
} from "lucide-react";
import { GlassCard, GlassBadge } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/page-header";
import { TriviaQuestion } from "@/types/api";

export default function GamePage() {
  const [question, setQuestion] = useState<TriviaQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [unlockedClues, setUnlockedClues] = useState(1);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Load high scores from localStorage
  useEffect(() => {
    try {
      const savedBest = localStorage.getItem("seven_kingdoms_best_streak");
      if (savedBest) setBestStreak(parseInt(savedBest, 10));
    } catch {
      // Ignored
    }
    fetchNextQuestion();
  }, []);

  const fetchNextQuestion = async () => {
    setIsLoading(true);
    setSelectedChoice(null);
    setIsRevealed(false);
    setIsCorrect(null);
    setUnlockedClues(1);

    try {
      const res = await fetch("/api/trivia");
      if (res.ok) {
        const q = await res.json();
        setQuestion(q);
      }
    } catch (err) {
      console.error("Failed to load question:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = (choice: string) => {
    if (selectedChoice || isRevealed || !question) return;

    setSelectedChoice(choice);
    setIsRevealed(true);

    if (choice.toLowerCase() === question.correctName.toLowerCase()) {
      setIsCorrect(true);
      const points = unlockedClues === 1 ? 300 : unlockedClues === 2 ? 200 : 100;
      setScore((prev) => prev + points);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        try {
          localStorage.setItem("seven_kingdoms_best_streak", String(newStreak));
        } catch {
          // Ignored
        }
      }
    } else {
      setIsCorrect(false);
      setStreak(0);
    }
  };

  const revealAnswer = () => {
    if (isRevealed || !question) return;
    setIsRevealed(true);
    setIsCorrect(false);
    setStreak(0);
    setSelectedChoice("__REVEALED__");
  };

  const unlockNextClue = () => {
    if (unlockedClues < 3) {
      setUnlockedClues((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <PageHeader
        icon={Dices}
        badge="Maester Trivia Trials"
        title="Guess the Character"
        description="Decipher mystery figures using authentic canonical clues recorded in the Citadel registry."
        actions={
          <>
            <div className="glass-panel px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-2 text-xs">
              <Trophy className="w-4 h-4 text-gold-400" />
              <div>
                <span className="text-[10px] text-slate-500 block leading-tight">Score</span>
                <strong className="text-slate-100 font-mono">{score}</strong>
              </div>
            </div>

            <div className="glass-panel px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-2 text-xs">
              <Flame className="w-4 h-4 text-orange-400" />
              <div>
                <span className="text-[10px] text-slate-500 block leading-tight">Streak</span>
                <strong className="text-slate-100 font-mono">{streak}</strong>
                <span className="text-[10px] text-slate-500 ml-1">(Best: {bestStreak})</span>
              </div>
            </div>
          </>
        }
      />

      {isLoading ? (
        <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center space-y-4">
          <div className="w-8 h-8 mx-auto border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-serif">
            Selecting a mystery personage from the records...
          </p>
        </div>
      ) : !question ? (
        <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center space-y-4">
          <p className="text-sm text-slate-400">Unable to assemble clue puzzle.</p>
          <button
            onClick={fetchNextQuestion}
            className="px-4 py-2 rounded-lg bg-gold-500 text-slate-950 font-bold text-xs"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Clues Card */}
          <GlassCard className="p-6 sm:p-8 space-y-6 iron-frame">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                </div>
                <h3 className="font-bold text-lg text-slate-100 font-display tracking-wide">
                  Mystery Dossier
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded-full bg-slate-900/60 border border-white/10">
                Clue {unlockedClues} <span className="text-slate-600">of</span> 3
              </span>
            </div>

            {/* Clue #1 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 border-l-2 border-l-gold-500/60 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-bold">
                Clue #1 · Demographic Identity
              </span>
              <div className="text-sm text-slate-200">
                Culture: <strong className="text-slate-100">{question.clues.culture}</strong> <span className="text-slate-600">·</span> Gender:{" "}
                <strong className="text-slate-100">{question.clues.gender}</strong>
              </div>
            </div>

            {/* Clue #2 */}
            {unlockedClues >= 2 ? (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 border-l-2 border-l-blue-500/60 space-y-1.5 animate-fade-in">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold">
                  Clue #2 · Noble Allegiance & Influence
                </span>
                <div className="text-sm text-slate-200">
                  {question.clues.allegianceNames.length > 0 ? (
                    <>
                      Sworn to:{" "}
                      <strong className="text-slate-100">{question.clues.allegianceNames.join(", ")}</strong>
                    </>
                  ) : (
                    <span className="italic text-slate-400">No hereditary house allegiance recorded. An independent or lone figure.</span>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={unlockNextClue}
                className="w-full py-3.5 rounded-xl border border-dashed border-white/10 hover:border-gold-500/40 hover:bg-gold-500/5 text-xs text-slate-400 hover:text-gold-300 transition-all text-center flex items-center justify-center gap-2 group"
              >
                <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Unlock Clue #2 <span className="text-slate-600">·</span> <span className="text-slate-500">lowers max reward</span></span>
              </button>
            )}

            {/* Clue #3 */}
            {unlockedClues >= 3 ? (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 border-l-2 border-l-emerald-500/60 space-y-1.5 animate-fade-in">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Clue #3 · Renown, Titles & Chronicles
                </span>
                <div className="text-sm text-slate-200 space-y-1">
                  <div>
                    Documented in <strong className="text-slate-100">{question.clues.bookAppearancesCount}</strong> canonical
                    books.
                  </div>
                  {question.clues.titles.length > 0 && (
                    <div>
                      Known title: <em className="text-gold-300">{question.clues.titles[0]}</em>
                    </div>
                  )}
                  {question.clues.aliases.length > 0 && (
                    <div>
                      Known by the alias: <span className="text-slate-100">&ldquo;{question.clues.aliases[0]}&rdquo;</span>
                    </div>
                  )}
                  {question.clues.actor && (
                    <div>
                      Portrayed on screen by <strong className="text-slate-100">{question.clues.actor}</strong>.
                    </div>
                  )}
                </div>
              </div>
            ) : unlockedClues >= 2 ? (
              <button
                onClick={unlockNextClue}
                className="w-full py-3.5 rounded-xl border border-dashed border-white/10 hover:border-gold-500/40 hover:bg-gold-500/5 text-xs text-slate-400 hover:text-gold-300 transition-all text-center flex items-center justify-center gap-2 group"
              >
                <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Unlock Clue #3 <span className="text-slate-600">·</span> <span className="text-slate-500">final clue</span></span>
              </button>
            ) : null}
          </GlassCard>

          {/* Multiple Choice Answers */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rotate-45 bg-gold-500/70" aria-hidden="true" />
              Select the Correct Personage
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.choices.map((choice) => {
                const isSelected = selectedChoice === choice;
                const isTheCorrectOne =
                  choice.toLowerCase() === question.correctName.toLowerCase();

                let style =
                  "glass-panel hover:bg-slate-800/80 hover:border-gold-500/30 hover:-translate-y-0.5 text-slate-200 border-white/10";
                if (isRevealed) {
                  if (isTheCorrectOne) {
                    style =
                      "bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-bold shadow-[0_0_24px_rgba(52,211,153,0.15)]";
                  } else if (isSelected) {
                    style =
                      "bg-red-950/60 border-red-500/60 text-red-200 line-through";
                  } else {
                    style = "opacity-40 border-transparent";
                  }
                }

                return (
                  <button
                    key={choice}
                    disabled={isRevealed}
                    onClick={() => handleChoice(choice)}
                    className={`p-4 rounded-xl border text-left font-display text-sm tracking-wide transition-all duration-200 flex items-center justify-between ${style}`}
                  >
                    <span>{choice}</span>
                    {isRevealed && isTheCorrectOne && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isRevealed && isSelected && !isTheCorrectOne && (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reveal / Feedback / Next Round Strip */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {isRevealed ? (
              <div className="space-y-1">
                {isCorrect ? (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Brilliant! That is indeed {question.correctName}.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                    <XCircle className="w-4 h-4" />
                    <span>The answer was {question.correctName}.</span>
                  </div>
                )}
                <Link
                  href={`/characters/${question.correctId}`}
                  className="text-xs text-gold-400 hover:text-gold-300 underline underline-offset-2 inline-block"
                >
                  View full Citadel dossier for {question.correctName} &rarr;
                </Link>
              </div>
            ) : (
              <button
                onClick={revealAnswer}
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Give up and reveal answer</span>
              </button>
            )}

            <button
              onClick={fetchNextQuestion}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-slate-950 hover:bg-gold-400 font-bold text-xs transition-all shadow-md self-end sm:self-auto"
            >
              <span>Next Character</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
