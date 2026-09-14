import { NextRequest, NextResponse } from "next/server";
import { IntelligenceService } from "@/services/intelligenceService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    if (!q.trim()) {
      return NextResponse.json({ results: [] });
    }

    const results = await IntelligenceService.search(q, limit);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Search index unavailable." }, { status: 500 });
  }
}
