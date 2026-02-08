import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get("matchId");
    const userId = searchParams.get("userId");

    if (!matchId || !userId) {
      return NextResponse.json(
        { error: "Missing matchId or userId" },
        { status: 400 }
      );
    }

    const meet = await prisma.meetRequest.findUnique({
      where: { id: matchId },
      include: {
        requester: true,
        receiver: true,
      },
    });

    if (!meet) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      );
    }

    const otherUser = meet.requesterId === userId ? meet.receiver : meet.requester;
    if (!otherUser) {
      return NextResponse.json(
        { error: "Invalid match" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      matchName: otherUser.name,
      meetLocation: meet.meetLocation,
      matchUserId: otherUser.id,
    });
  } catch (error) {
    console.error("Status fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}
