"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Plus } from "lucide-react";
import Link from "next/link";

const DEFAULT_SPORTS = [
  "Tennis",
  "Basketball",
  "Soccer",
  "Volleyball",
  "Badminton",
  "Table Tennis",
  "Swimming",
  "Running",
  "Cycling",
  "Gym",
];

export default function ActivitiesPage() {
  const router = useRouter();
  const [showAddSport, setShowAddSport] = useState(false);
  const [newSport, setNewSport] = useState("");
  const [sports, setSports] = useState(DEFAULT_SPORTS);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSportClick = async (sport: string) => {
    setLoading(sport);
    try {
      const userId = localStorage.getItem("socialcue_user_id");
      const res = await fetch("/api/activities/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, sport }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      router.push(`/activities/connected?matchId=${data.matchId}`);
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  };

  const handleAddSport = () => {
    if (newSport.trim() && !sports.includes(newSport.trim())) {
      setSports((prev) => [...prev, newSport.trim()]);
      setNewSport("");
      setShowAddSport(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-2xl mx-auto p-6">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          ← Back to Categories
        </Link>

        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Activities</h1>
              <p className="text-muted-foreground">Find people to play with right now</p>
            </div>
          </div>

          <Card className="border-2 border-emerald-100 shadow-xl">
            <CardHeader>
              <CardTitle>Sports</CardTitle>
              <CardDescription>
                Click a sport to find people in your area who want to play
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {sports.map((sport) => (
                  <Button
                    key={sport}
                    variant="outline"
                    className="h-14 text-base border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400"
                    onClick={() => handleSportClick(sport)}
                    disabled={loading !== null}
                  >
                    {loading === sport ? (
                      <span className="animate-pulse">Finding...</span>
                    ) : (
                      sport
                    )}
                  </Button>
                ))}
              </div>

              {showAddSport ? (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add new sport"
                    value={newSport}
                    onChange={(e) => setNewSport(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSport()}
                    className="flex-1 h-12 rounded-xl border-2 border-input px-4 text-base"
                  />
                  <Button onClick={handleAddSport}>Add</Button>
                  <Button variant="outline" onClick={() => setShowAddSport(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  onClick={() => setShowAddSport(true)}
                  disabled={loading !== null}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add a sport
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
