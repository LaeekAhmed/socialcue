import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, age, gender, location } = await request.json();

    if (!name || !age || !gender || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        age: parseInt(age),
        gender,
        location,
      },
    });

    return NextResponse.json({ userId: user.id });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
