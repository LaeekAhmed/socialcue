"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake, Construction } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { ProfileButton } from "@/components/profile-button";
import { ChatPreferencesButton } from "@/components/chat-preferences-button";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex flex-col">
      <div className="max-w-lg mx-auto p-6 w-full flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-3 pb-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold truncate sm:text-2xl">Community Service</h1>
            <p className="text-muted-foreground text-sm truncate">Volunteer together with like-minded people</p>
          </div>
          <ProfileButton />
        </div>
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
              <HeartHandshake className="w-7 h-7 text-white" />
            </div>
          </div>

          <Card className="border-2 border-amber-100 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10">
              <div className="flex items-center gap-3">
                <Construction className="w-12 h-12 text-amber-500" />
                <div>
                  <CardTitle>Coming Soon</CardTitle>
                  <CardDescription>
                    Community service features are in development. Check back soon!
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Soon you&apos;ll be able to find volunteer opportunities and connect with
                people who want to make a difference together.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <BackLink href="/categories" label="Categories" />
      <ChatPreferencesButton />
    </div>
  );
}
