import { NextRequest, NextResponse } from "next/server";
import { IntelligenceService } from "@/services/intelligenceService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "24", 10);
    const search = searchParams.get("search") || searchParams.get("name") || "";
    const region = searchParams.get("region") || "";
    const hasWords = searchParams.get("hasWords") === "true";
    const hasWeapons = searchParams.get("hasWeapons") === "true";
    const sortBy = (searchParams.get("sortBy") as "name" | "region" | "swornCount" | "id") || "name";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";

    const result = await IntelligenceService.getHouses({
      page,
      pageSize,
      name: search,
      region,
      hasWords,
      hasWeapons,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Houses API Error:", error);
    return NextResponse.json({ error: "Unable to retrieve noble houses." }, { status: 500 });
  }
}
