import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { Crown, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Seven Kingdoms Intelligence — A Song of Ice and Fire Data Exploration",
  description:
    "Explore the Seven Kingdoms through characters, noble houses, chronicle books, relationships, and analytics data across the world of George R.R. Martin's A Song of Ice and Fire.",
  keywords: [
    "Game of Thrones",
    "A Song of Ice and Fire",
    "ASOIAF",
    "Seven Kingdoms",
    "Westeros",
    "House Stark",
    "House Targaryen",
    "Citadel",
    "Knowledge Graph",
  ],
  authors: [{ name: "Seven Kingdoms Intelligence Architects" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col antialiased text-slate-100 bg-[#08090d]">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="w-full border-t border-white/5 py-10 mt-16 bg-slate-950/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-2 text-gold-400">
                <Crown className="w-4 h-4" />
                <span className="font-mono text-xs uppercase tracking-widest font-semibold">
                  Seven Kingdoms Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                Interactive data intelligence platform powered by An API of Ice and Fire.
                Archived with canonical records from George R. R. Martin&apos;s universe.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <a
                href="https://anapioficeandfire.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold-300 transition-colors"
              >
                Ice & Fire API
              </a>
              <span>·</span>
              <a
                href="https://github.com/joakimskoog/AnApiOfIceAndFire"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold-300 transition-colors"
              >
                Canonical Dataset
              </a>
              <span>·</span>
              <span className="text-slate-600">WCAG AA Compliant</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
