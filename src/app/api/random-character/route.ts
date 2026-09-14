import { NextResponse } from "next/server";
import { IntelligenceService } from "@/services/intelligenceService";

export async function GET() {
  try {
    const character = await IntelligenceService.getRandomCharacter();
    return NextResponse.json(character);
  } catch (error) {
    console.error("Random Character API Error:", error);
    return NextResponse.json({ error: "Unable to summon a random character." }, { status: 500 });
  }
}
