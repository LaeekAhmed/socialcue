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

    const systemPrompt = `You are a friendly onboarding bot. CRITICAL RULES:
- Ask EXACTLY ONE simple question per message
- Maximum 1 sentence. No explanations, no multiple questions, no lists
- Be direct and conversational
- After 3-4 user responses, end with: [PROFILE_READY]

Examples of GOOD questions:
"What are your hobbies?"
"What do you like?"
"Anything you dislike?"

Examples of BAD questions (DO NOT DO THIS):
"What are your hobbies? Also, what do you like? And tell me about your dislikes."
"I'd love to know more about you. Could you share your hobbies, interests, and what you enjoy doing?"
"Tell me about your hobbies, likes, and dislikes."`;

    const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

    let chatHistory = history.map((h: { role: string; content: string }) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }],
    }));

    const isNewChat = chatHistory.length === 0;
    
    // Gemini requires first message to be from user; prepend placeholder if LLM started the chat
    const trimmed = chatHistory.slice(-10);
    if (trimmed.length > 0 && trimmed[0].role === "model") {
      chatHistory = [
        { role: "user" as const, parts: [{ text: `${systemPrompt}\n\n(Start)` }] },
        ...trimmed,
      ];
    } else if (!isNewChat) {
      chatHistory = trimmed;
    }

    const userMessageCount = history.filter((h: { role: string }) => h.role === "user").length;
    const forceEnd = userMessageCount >= 3; // end after 3 user answers (3–4 questions total)

    if (forceEnd) {
      return NextResponse.json({
        reply: "Got it, we're all set!",
        profileReady: true,
      });
    }

    const chat = model.startChat({
      history: chatHistory,
    });

    // Include instruction: prepend for new chat, add reminder for follow-ups
    const messageToSend = isNewChat 
      ? `${systemPrompt}\n\nUser: ${message}`
      : `Remember: Ask ONE short question only (max 1 sentence). User said: ${message}`;

    const result = await chat.sendMessage(messageToSend);

    const response = result.response;
    let text = response.text();

    // Post-process to ensure single question: take first sentence/question only
    // Remove multiple questions, keep only the first one
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 1) {
      // If multiple sentences, take only the first question
      const firstQuestion = sentences.find(s => s.trim().match(/^[^.!]*\?/)) || sentences[0];
      text = firstQuestion.trim() + (firstQuestion.includes('?') ? '' : '?');
    } else if (sentences.length === 1 && !text.includes('?') && !text.includes('[PROFILE_READY]')) {
      // If single sentence without question mark, add one if it's not ending
      text = text.trim() + '?';
    }

    // Limit length: if still too long, truncate at first question mark or 50 chars
    if (text.length > 80) {
      const firstQ = text.indexOf('?');
      if (firstQ > 0 && firstQ < 80) {
        text = text.substring(0, firstQ + 1);
      } else {
        text = text.substring(0, 77) + '...';
      }
    }

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
