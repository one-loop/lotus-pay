import Link from "next/link";
import Image from "next/image";

import HomeGlobe from "@/components/home/HomeGlobe";
import HeroStars from "@/components/home/HeroStars";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="min-h-screen overflow-hidden bg-white">
        <header className="flex items-center justify-between px-6 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Lotus Pay logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-2xl font-medium tracking-tight text-[#141414]">
              Lotus Pay
            </span>
          </Link>

          <nav className="hidden items-center gap-12 text-sm text-[#151515] md:flex">
            <Link href="/" className="hover:opacity-70">
              Home
            </Link>
            <Link href="/dashboard" className="hover:opacity-70">
              Dashboard
            </Link>
            <a href="#" className="hover:opacity-70">
              Pricing
            </a>
          </nav>

          <Button
            asChild
            variant="ghost"
            className="rounded-full px-5 text-sm text-[#151515] hover:bg-black/5"
          >
            <Link href="/auth/start">Get Started</Link>
          </Button>
        </header>

        <section className="relative mb-5 ml-5 mr-5 mt-1 grid min-h-[calc(100vh-108px)] items-end overflow-hidden rounded-2xl border border-white/15 bg-[#161344] p-6 text-white sm:p-10 md:grid-cols-[1.1fr_1fr] md:p-14">
          <HeroStars count={100} />
          <div className="relative z-10 max-w-xl pb-2">
            <h1 className="font-serif text-5xl leading-[1.1] tracking-tight sm:text-6xl">
              Simpler, <span className="italic">Seamless</span>, Global Transactions
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/70">
              Say goodbye to pesky payment problems and prioritize what really matters.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                asChild
                className="h-11 min-w-[130px] rounded-full bg-white px-7 text-sm text-[#141414] hover:bg-white/90"
              >
                <Link href="/auth/start">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 min-w-[100px] rounded-full border border-white/25 bg-white/50 px-7 text-sm text-white backdrop-blur-md hover:bg-white/25 hover:text-white"
              >
                <Link href="/auth/start">Demo</Link>
              </Button>
            </div>
          </div>
          <div className="pointer-events-none hidden w-full items-end justify-end md:absolute md:-bottom-[212px] md:-right-24 md:z-0 md:flex lg:-bottom-[244px] lg:-right-32">
            <HomeGlobe />
          </div>
        </section>
      </div>
    </main>
  );
}
