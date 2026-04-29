import { redirect } from "next/navigation";

import { getUserFromSession } from "@/lib/auth";
import { publicSafeUser } from "@/lib/demo-db";

import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromSession();

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.onboarded) {
    redirect("/auth/onboarding");
  }

  return <DashboardShell user={publicSafeUser(user)}>{children}</DashboardShell>;
}

