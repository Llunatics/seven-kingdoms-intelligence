import { NextRequest, NextResponse } from "next/server";
import { IntelligenceService } from "@/services/intelligenceService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const focusHouseId = searchParams.get("focusHouseId")
      ? parseInt(searchParams.get("focusHouseId")!, 10)
      : undefined;
    const focusCharacterId = searchParams.get("focusCharacterId")
      ? parseInt(searchParams.get("focusCharacterId")!, 10)
      : undefined;
    const includeHouses = searchParams.get("includeHouses") !== "false";
    const includeCharacters = searchParams.get("includeCharacters") !== "false";
    const includeBooks = searchParams.get("includeBooks") !== "false";

    const graphData = await IntelligenceService.getGraphData({
      focusHouseId,
      focusCharacterId,
      includeHouses,
      includeCharacters,
      includeBooks,
    });

    return NextResponse.json(graphData);
  } catch (error) {
    console.error("Graph API Error:", error);
    return NextResponse.json({ error: "Unable to assemble relationship graph." }, { status: 500 });
  }
}
