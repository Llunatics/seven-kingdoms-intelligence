import { NextResponse } from "next/server";
import { IntelligenceService } from "@/services/intelligenceService";

export async function GET() {
  try {
    const stats = await IntelligenceService.getAnalytics();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Unable to retrieve realm statistics." }, { status: 500 });
  }
}
