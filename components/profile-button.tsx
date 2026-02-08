"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function ProfileButton() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.name && setName(data.name))
      .catch(() => {});
  }, []);

  return (
    <Button variant="outline" asChild className="rounded-full shrink-0 w-auto min-w-0 size-10 p-0 sm:size-auto sm:h-10 sm:px-4">
      <Link
        href="/profile"
        className="flex items-center justify-center gap-2"
        aria-label={name ? `${name} profile` : "Profile"}
      >
        <User className="h-4 w-4 shrink-0 sm:mr-2" />
        <span className="hidden sm:inline truncate max-w-[8rem]">{name ?? "Profile"}</span>
      </Link>
    </Button>
  );
}
