"use client";

import DemoDashboardShell from "@/components/home/DemoDashboardShell";

export default function DashboardDemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DemoDashboardShell>{children}</DemoDashboardShell>;
}
