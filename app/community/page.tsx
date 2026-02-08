"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake, Construction } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-lg mx-auto p-6">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          ← Back to Categories
        </Link>

        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <HeartHandshake className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Community Service</h1>
              <p className="text-muted-foreground">Volunteer together with like-minded people</p>
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
              <Link href="/categories">
                <Button variant="outline" className="w-full">
                  Back to Categories
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
