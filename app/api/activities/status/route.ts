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

    const activity = await prisma.activityRequest.findUnique({
      where: { id: matchId },
      include: { user: true },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      );
    }

    let matchName = "Someone nearby";
    if (activity.status === "matched") {
      const otherRequest = await prisma.activityRequest.findFirst({
        where: {
          sport: activity.sport,
          status: "matched",
          userId: { not: userId },
        },
        include: { user: true },
      });
      matchName = otherRequest?.user?.name || "Someone nearby";
    }

    const meetLocation = activity.user.location
      ? `Near ${activity.user.location} - find a ${activity.sport} venue`
      : `Find a ${activity.sport} venue near you`;

    return NextResponse.json({
      matchName,
      sport: activity.sport,
      meetLocation,
    });
  } catch (error) {
    console.error("Activity status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}
