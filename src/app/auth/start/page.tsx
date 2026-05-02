import Link from "next/link";

import DemoStartForm from "@/components/auth/DemoStartForm";

export default function DemoStartPage() {
  return (
    <main className="min-h-screen bg-[#07090f] p-4">
      <div className="relative mx-auto min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-xl border border-[#2a2d53] bg-[#04060d]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(63,75,255,0.15),_transparent_60%)]" />
        <div className="relative z-10 flex justify-end px-4 py-4">
          <Link href="/" className="text-sm text-white/80 hover:text-white">
            Back to home
          </Link>
        </div>
        <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center px-4 py-6">
          <DemoStartForm />
        </div>
      </div>
    </main>
  );
}
