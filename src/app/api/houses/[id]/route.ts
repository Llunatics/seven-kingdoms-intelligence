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
      return NextResponse.json({ error: "Invalid house identifier." }, { status: 400 });
    }

    const house = await IntelligenceService.getHouseById(id);
    if (!house) {
      return NextResponse.json({ error: "House not found in heraldry rolls." }, { status: 404 });
    }

    // Populate relations
    let currentLordData = null;
    if (house.currentLordId) {
      currentLordData = await IntelligenceService.getCharacterById(house.currentLordId);
    }
    let heirData = null;
    if (house.heirId) {
      heirData = await IntelligenceService.getCharacterById(house.heirId);
    }
    let overlordData = null;
    if (house.overlordId) {
      overlordData = await IntelligenceService.getHouseById(house.overlordId);
    }
    let founderData = null;
    if (house.founderId) {
      founderData = await IntelligenceService.getCharacterById(house.founderId);
    }

    const cadetBranchesData = await Promise.all(
      house.cadetBranchIds.map((bid) => IntelligenceService.getHouseById(bid))
    );

    // Populate sworn members (up to 30 for performance)
    const swornMembersData = await Promise.all(
      house.swornMemberIds.slice(0, 30).map((cid) => IntelligenceService.getCharacterById(cid))
    );

    return NextResponse.json({
      ...house,
      currentLordPopulated: currentLordData,
      heirPopulated: heirData,
      overlordPopulated: overlordData,
      founderPopulated: founderData,
      cadetBranchesPopulated: cadetBranchesData.filter(Boolean),
      swornMembersPopulated: swornMembersData.filter(Boolean),
    });
  } catch (error) {
    console.error("House Detail API Error:", error);
    return NextResponse.json({ error: "Unable to retrieve house heraldry." }, { status: 500 });
  }
}
