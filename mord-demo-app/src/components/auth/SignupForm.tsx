"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Props = {
  defaultRole?: "business" | "individual";
};

export default function SignupForm({ defaultRole = "business" }: Props) {
  const router = useRouter();

  const [role, setRole] = React.useState<"business" | "individual">(defaultRole);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Could not sign up.");
      }
      router.push(data.redirectTo ?? "/auth/onboarding");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign up.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your demo account</CardTitle>
        <CardDescription>
          Choose business or individual, then complete onboarding.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Couldn&apos;t create account</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label>Account type</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={[
                  "rounded-md border px-3 py-2 text-sm transition",
                  role === "business"
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border/70 bg-background text-muted-foreground hover:bg-accent",
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
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border/70 bg-background text-muted-foreground hover:bg-accent",
                ].join(" ")}
                onClick={() => setRole("individual")}
              >
                Individual
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
              minLength={6}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>

          <p className="text-xs text-muted-foreground">
            Demo note: passwords are stored plaintext in a local JSON DB.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

