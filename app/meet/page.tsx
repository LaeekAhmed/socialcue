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
import Link from "next/link";

export default function MeetPage() {
  const router = useRouter();
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSimilarInterests = async () => {
    if (!duration) return;
    setLoading(true);
    try {
      const userId = localStorage.getItem("socialcue_user_id");
      const res = await fetch("/api/meet/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          durationMinutes: parseInt(duration),
          surpriseMe: false,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      router.push(`/meet/connected?matchId=${data.matchId}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSurpriseMe = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("socialcue_user_id");
      const res = await fetch("/api/meet/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          durationMinutes: parseInt(duration || "60"),
          surpriseMe: true,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      router.push(`/meet/connected?matchId=${data.matchId}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <div className="max-w-lg mx-auto p-6">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          ← Back to Categories
        </Link>

        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Meet New People</h1>
              <p className="text-muted-foreground">Find someone to connect with nearby</p>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
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
                  className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30"
                  onClick={handleSimilarInterests}
                  disabled={loading || !duration}
                >
                  {loading ? "Finding match..." : "Find someone with similar interests"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-14 text-lg border-2 border-violet-200 hover:bg-violet-50"
                  onClick={handleSurpriseMe}
                  disabled={loading}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Surprise Me
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
