import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Mock location - in production use real geolocation
const DEFAULT_LAT = 47.6062;
const DEFAULT_LNG = -122.3321;

export async function POST(request: Request) {
  try {
    const { userId, durationMinutes, surpriseMe } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const requester = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!requester) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        freeUntil: new Date(Date.now() + (durationMinutes || 60) * 60 * 1000),
      },
    });

    let allUsers = await prisma.user.findMany({
      where: {
        id: { not: userId },
        profileReady: true,
      },
    });

    if (allUsers.length === 0) {
      const demoUser = await prisma.user.create({
        data: {
          name: "Demo User",
          age: 25,
          gender: "other",
          location: requester.location,
          interests: requester.interests.length > 0 ? requester.interests : ["coffee", "chat"],
          profileReady: true,
        },
      });
      allUsers = [demoUser];
    }

    let match = allUsers[Math.floor(Math.random() * allUsers.length)];

    if (!surpriseMe && requester.interests.length > 0 && allUsers.length > 1) {
      const withOverlap = allUsers.filter((u) =>
        u.interests.some((i) => requester.interests.includes(i))
      );
      if (withOverlap.length > 0) {
        match = withOverlap[Math.floor(Math.random() * withOverlap.length)];
      }
    }

    if (!match) {
      return NextResponse.json(
        { error: "No one available right now. Try again later!" },
        { status: 404 }
      );
    }

    const meetLat = ((requester.latitude ?? DEFAULT_LAT) + (match.latitude ?? DEFAULT_LAT)) / 2;
    const meetLng = ((requester.longitude ?? DEFAULT_LNG) + (match.longitude ?? DEFAULT_LNG)) / 2;
    const meetLocation = `${requester.location} & ${match.location} midpoint`;

    const meetRequest = await prisma.meetRequest.create({
      data: {
        requesterId: userId,
        receiverId: match.id,
        meetLocation,
        meetLat,
        meetLng,
        durationMinutes: durationMinutes || 60,
        surpriseMe: surpriseMe || false,
        status: "accepted",
      },
    });

    return NextResponse.json({
      matchId: meetRequest.id,
      matchName: match.name,
      meetLocation,
    });
  } catch (error) {
    console.error("Match error:", error);
    return NextResponse.json(
      { error: "Failed to find match" },
      { status: 500 }
    );
  }
}
