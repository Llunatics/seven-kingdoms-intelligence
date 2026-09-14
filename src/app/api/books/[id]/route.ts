import { NextRequest, NextResponse } from "next/server";
import { IntelligenceService } from "@/services/intelligenceService";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid book identifier." }, { status: 400 });
    }

    const book = await IntelligenceService.getBookById(id);
    if (!book) {
      return NextResponse.json({ error: "Book not found in Citadel archives." }, { status: 404 });
    }

    // Populate POV characters and notable cast
    const povCharactersData = await Promise.all(
      book.povCharacterIds.map((cid) => IntelligenceService.getCharacterById(cid))
    );

    // Sample notable named characters appearing in this book
    const sampleCharactersData = await Promise.all(
      book.characterIds.slice(0, 30).map((cid) => IntelligenceService.getCharacterById(cid))
    );

    return NextResponse.json({
      ...book,
      povCharactersPopulated: povCharactersData.filter(Boolean),
      charactersPopulated: sampleCharactersData.filter(Boolean),
    });
  } catch (error) {
    console.error("Book Detail API Error:", error);
    return NextResponse.json({ error: "Unable to retrieve book details." }, { status: 500 });
  }
}
