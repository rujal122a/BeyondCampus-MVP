"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Utensils, Users, ShieldCheck, Home as HomeIcon, BedDouble, Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const CITY_NAMES = ["Sangli", "Kolhapur", "Pune", "Mumbai", "Nagpur"];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    description: "Every property is physically verified. No fakes, no fraud.",
    color: "bg-brand-purple",
    bg: "bg-purple-50",
  },
  {
    icon: Users,
    title: "Community Lobbies",
    description: "Chat with potential flatmates and find your crew before moving.",
    color: "bg-brand-black",
    bg: "bg-slate-50",
  },
  {
    icon: Utensils,
    title: "Campus Eats",
    description: "Healthy home-style tiffin plans from verified local vendors.",
    color: "bg-emerald-500",
    bg: "bg-emerald-50",
  },
];

const STEPS = [
  { num: "01", title: "Discover", description: "Browse verified stays or food services. Filter by location, budget, and vibe." },
  { num: "02", title: "Connect", description: "Join a lobby to find people with similar interests. Chat and form a group." },
  { num: "03", title: "Live", description: "Secure your booking instantly. Move in and start your new chapter." },
];

export default function Home() {
  const [cityIndex, setCityIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCityIndex((i) => (i + 1) % CITY_NAMES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ── */}
      <section className="px-4 pt-8 pb-16">
        <div className="relative max-w-[96%] mx-auto rounded-5xl overflow-hidden min-h-[620px] flex flex-col items-center justify-center text-center text-white grain"
          style={{ background: "linear-gradient(135deg, #3D4ADB 0%, #5B6AFF 45%, #8B96FF 100%)" }}>
          
          {/* Subtle blobs */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-4xl mx-auto px-6 space-y-8"
          >
            {/* Badge */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-sm font-semibold">
                🏠 Student Housing & Services Platform
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
              Your home in{" "}
              <span className="inline-block w-[260px] md:w-[380px] text-left">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={cityIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    className="inline-block text-brand-green"
                  >
                    {CITY_NAMES[cityIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              before you even land.
            </h1>

            <p className="text-xl md:text-2xl text-white/75 max-w-2xl mx-auto leading-relaxed font-medium">
              Direct connections. Verified stays. A community that feels like home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/stays">
                <button className="px-8 py-4 rounded-full bg-brand-green text-brand-black font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2">
                  Browse Stays <BedDouble className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-8 py-4 rounded-full bg-white/15 border border-white/30 text-white font-bold text-lg hover:bg-white/25 transition-all backdrop-blur-sm flex items-center gap-2">
                  Join Free <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-6 pt-2 text-white/60 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-brand-green text-brand-green" />
                <span>Trusted by students</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <span>No brokerage fees</span>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <span>100% Verified</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES BENTO ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-14">
            <span className="badge bg-indigo-50 text-brand-purple border-indigo-200 mb-4">
              ✦ Everything You Need
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-black tracking-tight mt-4">
              Life <em className="font-black not-italic text-brand-purple">BeyondCampus</em>,{" "}
              <br className="hidden md:block"/>simplified.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-black mb-3">{f.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{f.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge bg-indigo-50/60 text-slate-600 border-indigo-100 mb-4">
              Our Process
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-black tracking-tight mt-4">
              We lead you through<br/> every step
            </h2>
            <p className="text-slate-500 mt-4 text-lg font-medium max-w-xl mx-auto">
              Because we know the struggles of being a student. We make renting safe and stress-free.
            </p>
          </div>

          <div className="space-y-5">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6 bg-brand-offwhite rounded-3xl p-8 border border-slate-100"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-purple flex items-center justify-center shrink-0 shadow-lg shadow-brand-purple/20">
                  <span className="text-white font-black text-lg">{step.num}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-brand-black mb-2">{step.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{step.description}</p>
                </div>
                {i === 0 && (
                  <Link href="/stays">
                    <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-green text-brand-black font-bold text-sm hover:scale-105 transition shrink-0">
                      Browse <BedDouble className="w-4 h-4" />
                    </button>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-brand-black rounded-5xl p-12 md:p-16 text-center text-white relative overflow-hidden grain">
            <div className="absolute top-0 right-0 w-72 h-72 bg-brand-purple/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <span className="badge bg-white/10 text-white border-white/20 mb-6">
                🚀 Get Started Today
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-4 mb-6">
                Ready to upgrade your<br />
                <em className="not-italic text-brand-green">living experience?</em>
              </h2>
              <p className="text-white/60 text-xl mb-10 font-medium max-w-xl mx-auto">
                Join the community living the BeyondCampus way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/stays">
                  <button className="px-10 py-4 rounded-full bg-brand-green text-brand-black font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2">
                    Explore Stays <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/list-your-property">
                  <button className="px-10 py-4 rounded-full bg-white/10 border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all">
                    List a Property
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
