"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Code2,
  CreditCard,
  HelpCircle,
  Home,
  LayoutGrid,
  Package,
  Plus,
  Receipt,
  Rocket,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Store,
  User,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  demoProfileInitials,
  readDemoProfile,
  sidebarSubtitle,
  sidebarTitle,
  type DemoProfile,
} from "@/lib/demo-profile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

function NavSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      {title ? (
        <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function NavLinkRow({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors",
        active
          ? "bg-primary/10 font-medium text-primary"
          : "text-foreground/80 hover:bg-accent",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-70" />
      <span className="flex-1 truncate">{label}</span>
    </Link>
  );
}

function dashboardPageTitle(pathname: string): string {
  const routes: Array<[string, string]> = [
    ["/dashboard/products", "Products"],
    ["/dashboard/payouts", "Payouts"],
    ["/dashboard/get-started", "Get Started"],
    ["/dashboard/verification", "Verification"],
    ["/dashboard/sales", "Sales"],
    ["/dashboard/transactions", "Transactions"],
    ["/dashboard/storefront", "Storefront"],
    ["/dashboard/developer", "Developer"],
    ["/dashboard/support", "Support"],
    ["/dashboard/settings", "Settings"],
  ];
  for (const [prefix, title] of routes) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return title;
  }
  return "Home";
}

export default function DemoDashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [demoProfile, setDemoProfile] = React.useState<DemoProfile | null>(null);
  const [mode, setMode] = React.useState<"test" | "live">("live");

  React.useEffect(() => {
    setDemoProfile(readDemoProfile());
  }, []);

  const profileTitle = sidebarTitle(demoProfile);
  const profileSubtitle = sidebarSubtitle(demoProfile);
  const avatarInitials =
    profileTitle === "Demo explorer" ? "LP" : demoProfileInitials(demoProfile);

  const homeActive =
    pathname === "/dashboard" || pathname === "/dashboard/";
  const productsActive =
    pathname === "/dashboard/products" || pathname.startsWith("/dashboard/products/");
  const payoutsActive =
    pathname === "/dashboard/payouts" || pathname.startsWith("/dashboard/payouts/");
  const getStartedActive =
    pathname === "/dashboard/get-started" || pathname.startsWith("/dashboard/get-started/");
  const verificationActive =
    pathname === "/dashboard/verification" || pathname.startsWith("/dashboard/verification/");
  const salesActive = pathname === "/dashboard/sales" || pathname.startsWith("/dashboard/sales/");
  const transactionsActive =
    pathname === "/dashboard/transactions" || pathname.startsWith("/dashboard/transactions/");
  const storefrontActive =
    pathname === "/dashboard/storefront" || pathname.startsWith("/dashboard/storefront/");
  const developerActive =
    pathname === "/dashboard/developer" || pathname.startsWith("/dashboard/developer/");
  const supportActive = pathname === "/dashboard/support" || pathname.startsWith("/dashboard/support/");
  const settingsActive =
    pathname === "/dashboard/settings" || pathname.startsWith("/dashboard/settings/");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 flex h-screen w-60 flex-col border-r border-border bg-muted/30">
        <div className="flex shrink-0 items-center gap-2 border-b border-border p-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Lotus Pay"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span className="font-semibold tracking-tight">Lotus Pay</span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 px-3 py-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/15 text-sm font-medium text-primary">
              {avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{profileTitle}</p>
            <p className="truncate text-xs text-muted-foreground">{profileSubtitle}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto px-2 py-2 overscroll-contain">
          <NavSection>
            <NavLinkRow
              href="/dashboard/get-started"
              icon={Rocket}
              label="Get Started"
              active={getStartedActive}
            />
            <NavLinkRow
              href="/dashboard/verification"
              icon={Shield}
              label="Verification"
              active={verificationActive}
            />
            <NavLinkRow href="/dashboard" icon={Home} label="Home" active={homeActive} />
          </NavSection>
          <Separator className="mx-1 bg-border" />
          <NavSection title="Products">
            <NavLinkRow href="/dashboard/products" icon={Package} label="Products" active={productsActive} />
            <NavLinkRow href="/dashboard/sales" icon={ShoppingBag} label="Sales" active={salesActive} />
            <NavLinkRow
              href="/dashboard/transactions"
              icon={CreditCard}
              label="Transactions"
              active={transactionsActive}
            />
            <NavLinkRow href="/dashboard/payouts" icon={Receipt} label="Payouts" active={payoutsActive} />
            <NavLinkRow href="/dashboard/storefront" icon={Store} label="Storefront" active={storefrontActive} />
          </NavSection>
          <Separator className="mx-1 bg-border" />
          <NavSection>
            <NavLinkRow href="/dashboard/developer" icon={Code2} label="Developer" active={developerActive} />
            <NavLinkRow href="/dashboard/support" icon={HelpCircle} label="Support" active={supportActive} />
            <NavLinkRow href="/dashboard/settings" icon={Settings} label="Settings" active={settingsActive} />
          </NavSection>
        </nav>

        <div className="shrink-0 border-t border-border bg-muted/30 p-2">
          <div className="flex rounded-lg bg-muted/80 p-0.5">
            <button
              type="button"
              onClick={() => setMode("test")}
              className={[
                "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                mode === "test" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
              ].join(" ")}
            >
              Test mode
            </button>
            <button
              type="button"
              onClick={() => setMode("live")}
              className={[
                "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                mode === "live"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground",
              ].join(" ")}
            >
              Live mode
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col pl-60">
        <header className="sticky top-0 z-10 flex flex-wrap items-center gap-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
          <h1 className="max-w-[200px] text-xl font-semibold tracking-tight sm:max-w-none sm:text-2xl">
            {dashboardPageTitle(pathname)}
          </h1>
          <div className="relative min-w-[200px] flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search…"
              className="h-10 rounded-full bg-muted/50 pl-9 pr-20"
              readOnly
            />
            {/* <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">
              Press /
            </span> */}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden gap-2 border-primary/30 bg-primary/5 text-primary sm:inline-flex"
            >
              <Link href="/auth/signup">Lotus Pay</Link>
            </Button> */}
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
            <Button asChild size="sm" className="sm:hidden">
              <Link href="/auth/signup">Sign up</Link>
            </Button>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
