"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function ChatPreferencesButton() {
  return (
    <Link
      href="/chat"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-xl text-black border border-gray-400 shadow-lg bg-white hover:bg-gray-50 transition-all hover:scale-105"
      aria-label="Update preferences"
    >
      <MessageCircle className="h-6 w-6" />
    </Link>
  );
}
