"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error Boundary caught error:", error);
  }, [error]);

  return (
    <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-red-500/20 text-center max-w-md mx-auto my-16 space-y-6">
      <div className="w-14 h-14 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto shadow-xl">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold font-serif text-slate-100">
          Unable to reach the realm right now.
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The maester ravens were interrupted while fetching archival chronicles. You may retry your request.
        </p>
      </div>

      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold transition-all shadow"
      >
        <RotateCcw className="w-4 h-4 text-gold-400" />
        <span>Retry Transmission</span>
      </button>
    </div>
  );
}
