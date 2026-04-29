import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lotus Pay",
  description: "Lotus Pay Merchant of Record demo platform",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

