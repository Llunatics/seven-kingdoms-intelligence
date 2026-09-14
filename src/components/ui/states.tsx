import React from "react";
import { AlertTriangle, Compass, RotateCcw } from "lucide-react";

export function LoadingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-panel p-5 rounded-xl border border-white/5 space-y-4 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 bg-white/10 rounded w-2/3" />
            <div className="h-4 bg-white/5 rounded-full w-14" />
          </div>
          <div className="space-y-2">
            <div className="h-3.5 bg-white/5 rounded w-4/5" />
            <div className="h-3.5 bg-white/5 rounded w-1/2" />
          </div>
          <div className="pt-3 border-t border-white/5 flex gap-2">
            <div className="h-5 bg-white/5 rounded-full w-16" />
            <div className="h-5 bg-white/5 rounded-full w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title = "No Records Found in the Archives",
  description = "No entities match your current query or active filters.",
  actionText,
  onAction,
}: {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center max-w-lg mx-auto my-12">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-400">
        <Compass className="w-7 h-7 text-gold-400" />
      </div>
      <h3 className="text-xl font-medium text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-sm font-medium transition-all shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Unable to reach the realm right now.",
  message = "Citadel ravens were unable to fetch records from the archives.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="glass-panel p-10 rounded-2xl border border-red-500/20 text-center max-w-md mx-auto my-12">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-medium text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-sm font-medium transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Request
        </button>
      )}
    </div>
  );
}
