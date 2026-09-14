import { NextResponse } from "next/server";
import { IntelligenceService } from "@/services/intelligenceService";

export async function GET() {
  try {
    const books = await IntelligenceService.getBooks();
    return NextResponse.json(books);
  } catch (error) {
    console.error("Books API Error:", error);
    return NextResponse.json({ error: "Unable to retrieve chronicle books." }, { status: 500 });
  }
}
