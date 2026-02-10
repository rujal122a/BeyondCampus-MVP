"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Utensils, Users, Zap, ShieldCheck, Home as HomeIcon } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { FeatureCard } from "@/components/landing/feature-card";
import { StepCard } from "@/components/landing/step-card";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const [role, setRole] = useState<"seeker" | "owner">("seeker");

  return (
    <div className="flex flex-col min-h-screen selection:bg-indigo-500/30">
      {/* Hero Section - Contained & Dynamic */}
      <section className="pt-20 px-4 pb-12">
        <div className="relative max-w-[95%] mx-auto rounded-[2.5rem] overflow-hidden min-h-[600px] flex flex-col items-center justify-center text-center mt-2 text-slate-100 bg-slate-950 shadow-2xl ring-1 ring-slate-900/5">

          {/* Dynamic Backgrounds */}
          <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
            {role === "seeker" ? (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-950 to-slate-950" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/60 via-slate-950 to-slate-950" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2" />
              </>
            )}
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.1 }} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-4xl mx-auto space-y-10 px-4"
          >
            {/* Role Toggle */}
            <div className="flex justify-center">
              <div className="inline-flex items-center p-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => setRole("seeker")}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                    role === "seeker" ? "bg-white text-slate-900 shadow-xl scale-105" : "text-white/70 hover:text-white"
                  )}
                >
                  <Users className="w-4 h-4" /> Want a place
                </button>
                <button
                  onClick={() => setRole("owner")}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                    role === "owner" ? "bg-white text-slate-900 shadow-xl scale-105" : "text-white/70 hover:text-white"
                  )}
                >
                  <HomeIcon className="w-4 h-4" /> Own a place
                </button>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1] drop-shadow-2xl">
              {role === "seeker" ? "Find your tribe." : "List in minutes."}
              <span className="block text-4xl md:text-6xl mt-2 bg-gradient-to-r from-indigo-200 via-white to-indigo-200 bg-clip-text text-transparent opacity-90">
                {role === "seeker" ? "Find your home." : "Rent with peace."}
              </span>
            </h1>

            {/* Decorative Separator */}
            <div className="flex justify-center w-full">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              {role === "seeker"
                ? "Direct connections. Verified stays. Community driven."
                : "Verified tenants. Timely payments. Zero hassle."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href={role === "seeker" ? "/stays" : "/list-your-property"}>
                <button className="px-8 py-4 rounded-full bg-white text-slate-950 font-bold text-lg hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 flex items-center gap-2">
                  {role === "seeker" ? "Explore Stays" : "List Your Property"} <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Bento Style */}
      <section className="py-24 px-4 container mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-center text-slate-900 mb-16 tracking-tight">
          Everything you need to live <span className="text-indigo-600">BeyondCampus</span>.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 max-w-6xl mx-auto h-auto md:h-[500px]">
          {/* Community - Large Left */}
          <GlassCard className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-indigo-50 to-white border-white/60 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-64 h-64 text-indigo-600" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end p-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Community Lobbies</h3>
              <p className="text-lg text-slate-600 max-w-md">
                Don't just browse spaces. Join live lobbies, chat with potential flatmates, and find your community before you even move in.
              </p>
            </div>
          </GlassCard>

          {/* Verified - Top Right */}
          <GlassCard className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-orange-50 to-white border-white/60 shadow-lg hover:shadow-xl transition-all group">
            <div className="h-full flex flex-col justify-between p-2">
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Verified Listings</h3>
                <p className="text-sm text-slate-600">100% physically verified spaces. No fakes.</p>
              </div>
            </div>
          </GlassCard>

          {/* Eats - Bottom Right */}
          <GlassCard className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-green-50 to-white border-white/60 shadow-lg hover:shadow-xl transition-all group">
            <div className="h-full flex flex-col justify-between p-2">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shadow-md">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Campus Eats</h3>
                <p className="text-sm text-slate-600">Healthy, home-style tiffin plans. Sorted.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* How It Works - LIGHT THEME RESTORED */}
      <section className="py-24 px-4 bg-white/50 backdrop-blur-sm border-y border-white/40">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-16">How it works</h2>

          <div className="space-y-12">
            <StepCard
              number="01"
              title="Discover"
              description="Browse verified stays or food services. Filter by location, budget, and vibe."
              align="left"
            />
            <StepCard
              number="02"
              title="Connect"
              description="Join a lobby to find people with similar interests. Chat and form a group."
              align="right"
            />
            <StepCard
              number="03"
              title="Live"
              description="Secure your booking instantly. Move in and start your new chapter."
              align="left"
            />
          </div>
        </div>
      </section>

      {/* CTA Footer - LIGHT THEME RESTORED */}
      <section className="py-32 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Ready to upgrade your living experience?</h2>
          <p className="text-xl text-slate-600 mb-10">Join the community living the BeyondCampus way.</p>
          <Link href="/stays">
            <button className="px-10 py-5 rounded-full bg-slate-900 text-white font-bold text-xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-900/30">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
