import { NextRequest, NextResponse } from "next/server";
import { IntelligenceService } from "@/services/intelligenceService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "24", 10);
    const search = searchParams.get("search") || searchParams.get("name") || "";
    const culture = searchParams.get("culture") || "";
    const gender = searchParams.get("gender") || "";
    const isAlive = searchParams.get("isAlive") ?? undefined;
    const isPov = searchParams.get("isPov") === "true";
    const hasAllegiance = searchParams.get("hasAllegiance") === "true";
    const sortBy = (searchParams.get("sortBy") as "name" | "culture" | "booksCount" | "id") || "name";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";

    const result = await IntelligenceService.getCharacters({
      page,
      pageSize,
      name: search,
      culture,
      gender,
      isAlive,
      isPov,
      hasAllegiance,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Characters API Error:", error);
    return NextResponse.json({ error: "Unable to retrieve characters from the realm." }, { status: 500 });
  }
}
