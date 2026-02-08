"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Plus } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { ProfileButton } from "@/components/profile-button";
import { ChatPreferencesButton } from "@/components/chat-preferences-button";

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
  const [searchError, setSearchError] = useState<string | null>(null);

  const userId = typeof window !== "undefined" ? localStorage.getItem("socialcue_user_id") : null;

  const handleSportClick = (sport: string) => {
    setSearchError(null);
    if (!userId) return;
    router.push(`/match?type=activities&sport=${encodeURIComponent(sport)}`);
  };

  const handleAddSport = () => {
    if (newSport.trim() && !sports.includes(newSport.trim())) {
      setSports((prev) => [...prev, newSport.trim()]);
      setNewSport("");
      setShowAddSport(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      <div className="max-w-4xl mx-auto p-6 w-full flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-3 pb-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold truncate sm:text-2xl">Activities</h1>
            <p className="text-muted-foreground text-sm truncate">Find people to play with right now</p>
          </div>
          <ProfileButton />
        </div>
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                <Dumbbell className="w-7 h-7 text-white" />
              </div>
            </div>

            {searchError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {searchError}
              </p>
            )}

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
                      className="h-14 text-base border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
                      onClick={() => handleSportClick(sport)}
                    >
                      {sport}
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
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add a sport
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
      </div>
      <BackLink href="/categories" label="Categories" />
      <ChatPreferencesButton />
    </div>
  );
}
