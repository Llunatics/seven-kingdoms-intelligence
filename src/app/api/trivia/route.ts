import { NextResponse } from "next/server";
import { IntelligenceService } from "@/services/intelligenceService";

export async function GET() {
  try {
    const question = await IntelligenceService.getTriviaQuestion();
    return NextResponse.json(question);
  } catch (error) {
    console.error("Trivia API Error:", error);
    return NextResponse.json({ error: "Unable to generate mystery character clue." }, { status: 500 });
  }
}
