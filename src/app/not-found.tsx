import Link from "next/link";
import { Compass, Crown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="glass-panel p-12 sm:p-16 rounded-3xl border border-white/10 text-center max-w-lg mx-auto my-16 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-gold-950/40 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto shadow-xl">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="font-mono text-xs uppercase tracking-widest text-gold-400 font-bold">
          Citadel Error 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100">
          Lost Beyond the Wall
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
          The parchment, character record, or house archive you seek does not exist in the Citadel registry.
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs hover:bg-gold-400 transition-all shadow"
        >
          Return to Citadel Core
        </Link>
        <Link
          href="/characters"
          className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-slate-100 text-xs font-medium border border-white/10"
        >
          Explore Characters
        </Link>
      </div>
    </div>
  );
}
