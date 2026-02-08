"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Utensils, Users, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { FeatureCard } from "@/components/landing/feature-card";
import { StepCard } from "@/components/landing/step-card";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-aurora-purple/20 rounded-full blur-[120px] -z-10 animate-pulse"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto space-y-8 z-10"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-sm font-medium text-slate-700 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            v1.0 is Live • The Student Lifestyle OS
          </motion.span>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 leading-[1.1] drop-shadow-sm">
            Life happens <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-orange animate-gradient bg-300%">
              OffCampus.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Find your crew, split the rent, and never worry about dinner again.
            <span className="text-slate-900 font-semibold"> All in one place.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/stays">
              <button className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2">
                Find a Flat <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/eats">
              <button className="px-8 py-4 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-slate-900 font-bold text-lg hover:bg-white/80 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2">
                Get Tiffin <Utensils className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Floating UI Mockups */}
        <motion.div
          style={{ y }}
          className="hidden md:block absolute bottom-10 left-10 opacity-60 hover:opacity-100 transition-opacity"
        >
          <GlassCard className="p-4 w-64">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Lobby Activity</p>
                <p className="text-sm font-bold text-slate-900">Arjun joined &quot;3BHK&quot;</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          style={{ y }}
          className="hidden md:block absolute top-[20%] right-10 opacity-60 hover:opacity-100 transition-opacity delay-75"
        >
          <GlassCard className="p-4 w-64">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Utensils className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Menu Update</p>
                <p className="text-sm font-bold text-slate-900">Paneer Butter Masala Today!</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Users}
            title="Live Lobbies"
            description="Don't just browse flats. Join live lobbies, chat with potential roommates, and assemble your squad before booking."
            color="purple"
            delay={0.1}
          />
          <FeatureCard
            icon={Zap}
            title="Split Payments"
            description="No more awkward money conversations. Split the deposit and rent instantly with your roommates via UPI."
            color="blue"
            delay={0.2}
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Verified Listings"
            description="Every flat and mess vendor is physically verified. detailed video tours and real student reviews."
            color="orange"
            delay={0.3}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-white/30 backdrop-blur-sm border-y border-white/40">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-16">How it works</h2>

          <div className="space-y-12">
            <StepCard
              number="01"
              title="Find Your Vibe"
              description="Browse verified flats or mess services. Filter by location, budget, and amenities."
              align="left"
            />
            <StepCard
              number="02"
              title="Squad Up"
              description="Join a lobby to find roommates with similar interests. Chat and finalize the group."
              align="right"
            />
            <StepCard
              number="03"
              title="Lock It In"
              description="Pay your share of the booking fee securely. Move in and start living your best life."
              align="left"
            />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Ready to upgrade your campus life?</h2>
          <p className="text-xl text-slate-600 mb-10">Join thousands of students living the OffCampus way.</p>
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
