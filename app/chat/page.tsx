"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Send } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileCreating, setProfileCreating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const userId = localStorage.getItem("socialcue_user_id");
    if (!userId) {
      router.replace("/intro");
      return;
    }

    // Start with AI greeting
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hey! 👋 Great to meet you! I'm here to learn about your interests so we can create your profile and connect you with amazing people. Tell me about yourself—what do you enjoy? Your hobbies, likes, dislikes, anything that makes you, you!",
      },
    ]);
  }, [router]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const userId = localStorage.getItem("socialcue_user_id");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: userMessage.content,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Chat failed");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
        },
      ]);

      if (data.profileReady) {
        setProfileCreating(true);
        await createProfile(userId!, userMessage.content);
        router.push("/profile");
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Sorry, something went wrong. Can you tell me more about your interests?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (userId: string, lastMessage: string) => {
    try {
      await fetch("/api/profile/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          lastMessage,
          chatHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
    } catch (err) {
      console.error("Profile creation failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex flex-col">
      <div className="flex-1 max-w-2xl mx-auto w-full p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Let&apos;s get to know you</h1>
            <p className="text-sm text-muted-foreground">
              Share your interests, likes & dislikes
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-card border-violet-100"
                }`}
              >
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <Card className="bg-card border-violet-100">
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse-soft" />
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse-soft [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse-soft [animation-delay:0.4s]" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {profileCreating && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
              <p className="text-lg font-semibold">Creating your profile...</p>
              <p className="text-muted-foreground">Almost there!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {!profileCreating && (
          <div className="flex gap-2 pt-4">
            <Input
              placeholder="Tell me about your interests..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={loading}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
