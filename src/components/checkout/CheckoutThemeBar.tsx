"use client";

import * as React from "react";
import { ChevronDown, Globe2, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type Props = { accentPurple?: boolean };

/** Sun / System / Moon row styled for the standalone checkout footer. */
export default function CheckoutThemeBar({ accentPurple = false }: Props) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 text-neutral-400">
        <span className="inline-flex items-center gap-1 text-sm">
          <Globe2 className="h-4 w-4" /> EN <ChevronDown className="h-3 w-3 opacity-60" />
        </span>
      </div>
    );
  }

  function btn(active: boolean) {
    return [
      "flex h-8 w-8 items-center justify-center rounded-md transition-colors sm:h-9 sm:w-9",
      active
        ? accentPurple
          ? "bg-[hsl(262_83%_58%/0.22)] text-[hsl(262_90%_78%)] ring-1 ring-[hsl(262_83%_58%/0.45)]"
          : "bg-white/15 text-white"
        : "text-neutral-400 hover:bg-white/10 hover:text-neutral-200",
    ].join(" ");
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 lg:pt-2">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md py-2 text-sm text-neutral-400 transition-colors hover:bg-white/[0.06] hover:text-neutral-100"
      >
        <Globe2 className="h-4 w-4 shrink-0" />
        EN
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </button>
      <div className="flex items-center rounded-lg border border-neutral-600 bg-black/35 p-0.5">
        <button type="button" className={btn(theme === "light")} aria-label="Light" onClick={() => setTheme("light")}>
          <Sun className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={btn(theme === "system")}
          aria-label="System"
          onClick={() => setTheme("system")}
        >
          <Monitor className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={btn(theme === "dark")}
          aria-label="Dark"
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
