import React from "react";
import { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface PageHeaderProps {
  icon: LucideIcon;
  badge: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  tone?: "gold" | "blue" | "emerald";
}

const toneStyles = {
  gold: "bg-gold-950/40 border-gold-500/20 text-gold-400",
  blue: "bg-blue-950/40 border-blue-500/20 text-blue-400",
  emerald: "bg-emerald-950/40 border-emerald-500/20 text-emerald-400",
};

/**
 * Consistent citadel page header: badge pill, Cinzel display title,
 * muted description, and an optional right-aligned action cluster.
 */
export function PageHeader({
  icon: Icon,
  badge,
  title,
  description,
  actions,
  className,
  tone = "gold",
}: PageHeaderProps) {
  return (
    <div
      className={clsx(
        "flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6",
        className
      )}
    >
      <div className="space-y-2.5">
        <div
          className={clsx(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium",
            toneStyles[tone]
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-display tracking-wide">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

/**
 * Decorative divider: hairline rules flanking a gold diamond sigil.
 * Uses the .rune-divider CSS utility from globals.css.
 */
export function RuneDivider({ className }: { className?: string }) {
  return (
    <div className={clsx("rune-divider", className)} aria-hidden="true">
      <span className="rune-diamond" />
    </div>
  );
}
