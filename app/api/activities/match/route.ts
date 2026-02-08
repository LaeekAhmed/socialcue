import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userId, sport } = await request.json();

    if (!userId || !sport) {
      return NextResponse.json(
        { error: "Missing userId or sport" },
        { status: 400 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Normalize sport for case-insensitive, trimmed matching (e.g. "Tennis", " tennis ", "TENNIS" all match)
    const normalizedSport = (sport ?? "").trim().toLowerCase();
    if (!normalizedSport) {
      return NextResponse.json(
        { error: "Invalid sport" },
        { status: 400 }
      );
    }

    // 1) Match with someone who has this sport in their interests (current user doesn't need it)
    // Compare using normalized (lowercase, trimmed) so "Tennis" matches "tennis" in profile
    const candidates = await prisma.user.findMany({
      where: {
        id: { not: userId },
        profileReady: true,
      },
      select: { id: true, interests: true },
    });

    const userWithInterest = candidates.find((u) =>
      (u.interests ?? []).some(
        (i) => (typeof i === "string" ? i : "").trim().toLowerCase() === normalizedSport
      )
    );

    if (userWithInterest) {
      return NextResponse.json({ matchUserId: userWithInterest.id });
    }

    // 2) Fallback: someone is currently searching for this sport — match with them
    const otherSearching = await prisma.activityRequest.findFirst({
      where: {
        sport,
        status: "searching",
        userId: { not: userId },
      },
    });

    if (otherSearching) {
      await prisma.activityRequest.update({
        where: { id: otherSearching.id },
        data: { status: "matched", matchedWithUserId: userId },
      });
      await prisma.activityRequest.create({
        data: {
          userId,
          sport,
          status: "matched",
          matchedWithUserId: otherSearching.userId,
        },
      });
      return NextResponse.json({ matchUserId: otherSearching.userId });
    }

    // 3) No one with that interest and no one searching — create request and wait
    const created = await prisma.activityRequest.create({
      data: { userId, sport, status: "searching" },
    });
    return NextResponse.json({ requestId: created.id });
  } catch (error) {
    console.error("Activity match error:", error);
    return NextResponse.json(
      { error: "Failed to find match" },
      { status: 500 }
    );
  }
}
