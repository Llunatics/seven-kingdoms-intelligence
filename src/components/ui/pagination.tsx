"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build visible page buttons
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-white/5 text-xs text-slate-400">
      <div>
        Showing page <strong className="text-slate-200">{currentPage}</strong> of{" "}
        <strong className="text-slate-200">{totalPages}</strong> ({total.toLocaleString()} records)
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="p-2 rounded-lg bg-slate-800/60 border border-white/10 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((p, i) =>
          typeof p === "number" ? (
            <button
              key={i}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg font-medium transition-all text-xs border ${
                p === currentPage
                  ? "bg-gold-500 text-slate-950 border-gold-400 font-bold shadow"
                  : "bg-slate-800/40 text-slate-300 border-white/5 hover:bg-slate-700"
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={i} className="px-1 text-slate-600">
              ...
            </span>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="p-2 rounded-lg bg-slate-800/60 border border-white/10 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
