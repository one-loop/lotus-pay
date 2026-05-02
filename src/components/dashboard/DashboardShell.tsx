"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { LogOut, Menu, Settings, Wallet, Link as LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

function initials(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase() || "?";
}

export default function DashboardShell({
  user,
  children,
}: {
  user: {
    id: string;
    displayName?: string;
    profile: { displayName: string; website?: string | undefined };
    store: { storeName: string };
  } & Record<string, unknown>;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const nav: NavItem[] = [
    { href: "/account", label: "Overview", icon: <Settings className="h-4 w-4" /> },
    { href: "/account/store", label: "Store", icon: <Settings className="h-4 w-4" /> },
    { href: "/account/payouts", label: "Payouts", icon: <Wallet className="h-4 w-4" /> },
    { href: "/account/payment-links", label: "Payment Links", icon: <LinkIcon className="h-4 w-4" /> },
  ];

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  }

  const displayName = user.profile?.displayName ?? "Account";
  const mobileNav = (
    <div className="flex flex-col gap-1 p-2">
      {nav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent",
            ].join(" ")}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
      <Separator className="my-2" />
      <button
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-accent"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/account" className="flex items-center gap-2 font-semibold tracking-tight">
            <Image
              src="/logo.png"
              alt="Lotus Pay logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-md object-cover"
            />
            <span className="hidden sm:inline">Lotus Pay</span>
          </Link>

          <div className="flex items-center gap-3">
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                <Dialog.Content className="fixed inset-x-3 top-14 rounded-lg border border-border bg-background p-1 shadow-lg md:hidden">
                  {mobileNav}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <div className="flex items-center gap-3">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarFallback>{initials(displayName)}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <div className="text-sm font-medium leading-none">{displayName}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {user.store?.storeName ?? "Store"}
                </div>
              </div>
            </div>

            <Button
              onClick={onLogout}
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block">
          <nav className="flex flex-col gap-1 rounded-lg border border-border/60 bg-background/70 p-2">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent",
                  ].join(" ")}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Separator className="my-2" />
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}

