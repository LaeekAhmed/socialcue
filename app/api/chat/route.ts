import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { userId, message, history } = await request.json();

    if (!message || !userId) {
      return NextResponse.json(
        { error: "Missing message or userId" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are a friendly AI assistant helping someone create their SocialCue profile. Your job is to:
1. Chat naturally and ask about their interests, hobbies, likes, dislikes
2. Keep responses concise (2-4 sentences max)
3. After they've shared enough (e.g., 3-4 exchanges with meaningful content about interests), say you have enough info
4. When you have enough info, your last message should end with exactly: [PROFILE_READY]
5. Be warm and encouraging

Only end with [PROFILE_READY] when they've shared interests, likes/dislikes, or hobbies.`;

    const chatHistory = history.map((h: { role: string; content: string }) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }],
    }));

    const chat = model.startChat({
      history: chatHistory.slice(-10),
    });

    const result = await chat.sendMessage(
      chatHistory.length === 0
        ? `${systemPrompt}\n\nStart the conversation. User's first message: ${message}`
        : message
    );

    const response = result.response;
    const text = response.text();

    const profileReady = text.includes("[PROFILE_READY]");
    const reply = text.replace(/\[PROFILE_READY\]/g, "").trim();

    return NextResponse.json({ reply, profileReady });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}
