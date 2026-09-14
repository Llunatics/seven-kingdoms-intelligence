import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "interactive" | "gold";
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({
  variant = "default",
  children,
  className,
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: "glass-panel rounded-xl",
    subtle: "glass-panel-subtle rounded-xl",
    interactive: "glass-card rounded-xl cursor-pointer",
    gold: "glass-panel border-gold-500/30 rounded-xl gold-glow",
  };

  return (
    <div
      className={twMerge(
        "relative overflow-hidden p-5 transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassBadge({
  children,
  className,
  color = "default",
}: {
  children: React.ReactNode;
  className?: string;
  color?: "default" | "gold" | "stark" | "targaryen" | "lannister" | "baratheon" | "greyjoy" | "martell" | "green";
}) {
  const colorStyles = {
    default: "bg-slate-800/60 text-slate-300 border-white/10",
    gold: "bg-gold-900/30 text-gold-400 border-gold-500/30",
    stark: "bg-slate-700/40 text-realm-stark border-realm-stark/30",
    targaryen: "bg-red-950/40 text-red-400 border-red-800/40",
    lannister: "bg-amber-950/40 text-amber-300 border-amber-600/30",
    baratheon: "bg-yellow-950/40 text-yellow-300 border-yellow-700/30",
    greyjoy: "bg-cyan-950/40 text-cyan-300 border-cyan-800/30",
    martell: "bg-orange-950/40 text-orange-300 border-orange-700/30",
    green: "bg-emerald-950/40 text-emerald-300 border-emerald-700/30",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm tracking-wide",
        colorStyles[color],
        className
      )}
    >
      {children}
    </span>
  );
}
