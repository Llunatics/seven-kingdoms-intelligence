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
      return NextResponse.json({ error: "Invalid character identifier." }, { status: 400 });
    }

    const character = await IntelligenceService.getCharacterById(id);
    if (!character) {
      return NextResponse.json({ error: "Character not found in the Citadel records." }, { status: 404 });
    }

    // Populate related entities (Allegiances, Books, Family) for ultra-rich detail view
    const allegiancesData = await Promise.all(
      character.allegianceIds.map((hid) => IntelligenceService.getHouseById(hid))
    );
    const booksData = await Promise.all(
      character.bookIds.map((bid) => IntelligenceService.getBookById(bid))
    );
    const povBooksData = await Promise.all(
      character.povBookIds.map((bid) => IntelligenceService.getBookById(bid))
    );

    let fatherData = null;
    if (character.fatherId) {
      fatherData = await IntelligenceService.getCharacterById(character.fatherId);
    }
    let motherData = null;
    if (character.motherId) {
      motherData = await IntelligenceService.getCharacterById(character.motherId);
    }
    let spouseData = null;
    if (character.spouseId) {
      spouseData = await IntelligenceService.getCharacterById(character.spouseId);
    }

    return NextResponse.json({
      ...character,
      allegiancesPopulated: allegiancesData.filter(Boolean),
      booksPopulated: booksData.filter(Boolean),
      povBooksPopulated: povBooksData.filter(Boolean),
      fatherPopulated: fatherData,
      motherPopulated: motherData,
      spousePopulated: spouseData,
    });
  } catch (error) {
    console.error("Character Detail API Error:", error);
    return NextResponse.json({ error: "Unable to retrieve character profile." }, { status: 500 });
  }
}
