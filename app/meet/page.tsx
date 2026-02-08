"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Sparkles } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { ProfileButton } from "@/components/profile-button";
import { ChatPreferencesButton } from "@/components/chat-preferences-button";

export default function MeetPage() {
  const router = useRouter();
  const [duration, setDuration] = useState("");

  const handleSimilarInterests = () => {
    if (!duration) return;
    const d = duration || "60";
    router.push(`/match?type=meet&duration=${encodeURIComponent(d)}&surpriseMe=false`);
  };

  const handleSurpriseMe = () => {
    const d = duration || "60";
    router.push(`/match?type=meet&duration=${encodeURIComponent(d)}&surpriseMe=true`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex flex-col">
      <div className="max-w-lg mx-auto p-6 w-full flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-3 pb-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold truncate sm:text-2xl">Meet New People</h1>
            <p className="text-muted-foreground text-sm truncate">Find someone to connect with nearby</p>
          </div>
          <ProfileButton />
        </div>
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center shadow-lg shadow-violet-400/25 shrink-0">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>

          <Card className="border-2 border-violet-100 shadow-xl">
            <CardHeader>
              <CardTitle>How long are you free?</CardTitle>
              <CardDescription>
                We&apos;ll find someone available for the same time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full min-h-14 text-base sm:text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 shadow-lg shadow-violet-300/25 whitespace-normal text-wrap px-4 py-2"
                  onClick={handleSimilarInterests}
                  disabled={!duration}
                >
                  Find someone with similar interests
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-14 text-lg border-2 border-violet-200 hover:bg-violet-50"
                  onClick={handleSurpriseMe}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Surprise Me
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <BackLink href="/categories" label="Categories" />
      <ChatPreferencesButton />
    </div>
  );
}
