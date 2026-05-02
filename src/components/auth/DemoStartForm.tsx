"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEMO_PROFILE_STORAGE_KEY,
  type DemoProfile,
} from "@/lib/demo-profile";

export default function DemoStartForm() {
  const router = useRouter();

  const [role, setRole] = React.useState<"business" | "individual">("business");
  const [displayName, setDisplayName] = React.useState("");
  const [businessName, setBusinessName] = React.useState("");
  const [email, setEmail] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: DemoProfile = {
      role,
      displayName: displayName.trim(),
      email: email.trim(),
      ...(role === "business" ? { businessName: businessName.trim() } : {}),
    };
    try {
      window.sessionStorage.setItem(DEMO_PROFILE_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore quota / privacy mode */
    }
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-white/10 bg-black/55 p-5 shadow-2xl backdrop-blur-sm">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-white">Start exploring</h1>
        <p className="mt-2 text-sm text-white/65">
          Tell us whether you&apos;re a business or an individual—we&apos;ll open the dashboard
          with your details (demo only, stored in this browser tab).
        </p>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <Label className="text-white/90">I&apos;m signing up as</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={[
                "rounded-md border px-3 py-2 text-sm transition",
                role === "business"
                  ? "border-blue-400/80 bg-blue-400/15 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
              ].join(" ")}
              onClick={() => setRole("business")}
            >
              Business
            </button>
            <button
              type="button"
              className={[
                "rounded-md border px-3 py-2 text-sm transition",
                role === "individual"
                  ? "border-blue-400/80 bg-blue-400/15 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
              ].join(" ")}
              onClick={() => setRole("individual")}
            >
              Individual
            </button>
          </div>
        </div>

        {role === "business" ? (
          <>
            <div className="grid gap-2">
              <Label htmlFor="bizName" className="text-white/90">
                Business name
              </Label>
              <Input
                id="bizName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Lotus Imports"
                className="border-white/10 bg-black/40 text-white placeholder:text-white/35"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="yourName" className="text-white/90">
                Your name
              </Label>
              <Input
                id="yourName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Rivera"
                className="border-white/10 bg-black/40 text-white placeholder:text-white/35"
              />
            </div>
          </>
        ) : (
          <div className="grid gap-2">
            <Label htmlFor="fullName" className="text-white/90">
              Full name
            </Label>
            <Input
              id="fullName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alex Rivera"
              className="border-white/10 bg-black/40 text-white placeholder:text-white/35"
            />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-white/90">
            Work email
          </Label>
          <Input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="border-white/10 bg-black/40 text-white placeholder:text-white/35"
          />
        </div>

        <Button type="submit" className="h-11 bg-white text-black hover:bg-white/90">
          Continue to dashboard
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-white/45">
        Already have account credentials?{" "}
        <Link href="/auth/login" className="text-white/70 underline underline-offset-2 hover:text-white">
          Sign in
        </Link>
      </p>
    </div>
  );
}
