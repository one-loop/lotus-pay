export const DEMO_PROFILE_STORAGE_KEY = "lotus-pay-demo-profile";

export type DemoProfile = {
  role: "business" | "individual";
  displayName: string;
  businessName?: string;
  email: string;
};

export function readDemoProfile(): DemoProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(DEMO_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const obj = parsed as Record<string, unknown>;
    const role = obj.role === "individual" ? "individual" : "business";
    const displayName = typeof obj.displayName === "string" ? obj.displayName : "";
    const businessName =
      typeof obj.businessName === "string" ? obj.businessName : undefined;
    const email = typeof obj.email === "string" ? obj.email : "";
    return { role, displayName, businessName, email };
  } catch {
    return null;
  }
}

export function demoProfileInitials(profile: DemoProfile | null): string {
  const name =
    profile?.role === "business" && profile.businessName?.trim()
      ? profile.businessName.trim()
      : profile?.displayName?.trim() ?? "";
  if (!name) return "?";
  const parts = name.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  const out = (a + b).toUpperCase();
  return out || "?";
}

export function sidebarTitle(profile: DemoProfile | null): string {
  if (!profile) return "Demo explorer";
  if (profile.role === "business" && profile.businessName?.trim()) {
    return profile.businessName.trim();
  }
  if (profile.displayName?.trim()) return profile.displayName.trim();
  return "Demo explorer";
}

export function sidebarSubtitle(profile: DemoProfile | null): string {
  if (!profile) return "Demo dashboard";
  const parts: string[] = [];
  parts.push(profile.role === "business" ? "Business" : "Individual");
  if (profile.email.trim()) {
    parts.push(profile.email.trim());
  }
  return parts.join(" · ");
}
