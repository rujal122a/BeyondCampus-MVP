"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  Building2,
  ClipboardCheck,
  Home as HomeIcon,
  Search,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const CITY_NAMES = ["Sangli", "Kolhapur", "Pune", "Mumbai", "Nagpur"];

const FEATURES = [
  {
    icon: BedDouble,
    title: "Verified stays",
    description: "Rent and occupancy, upfront.",
    eyebrow: "Stay search",
    iconTone: "text-[#345f8a]",
  },
  {
    icon: Utensils,
    title: "Nearby meal options",
    description: "See mess options near each area.",
    eyebrow: "Daily food",
    iconTone: "text-[#31584d]",
  },
  {
    icon: Users,
    title: "Shared living clarity",
    description: "Compare room setup before you commit.",
    eyebrow: "Room setup",
    iconTone: "text-[#42528a]",
  },
  {
    icon: Building2,
    title: "Owner listing tools",
    description: "For flat owners and mess owners.",
    eyebrow: "Publishing",
    iconTone: "text-[#6d4c30]",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Choose your side",
    description: "Search as a student or pick your owner category.",
    note: "Student or owner",
    icon: Search,
  },
  {
    num: "02",
    title: "Compare the right details",
    description: "Check rent, room setup, and location fast.",
    note: "Core filters first",
    icon: ClipboardCheck,
  },
  {
    num: "03",
    title: "Move faster with clarity",
    description: "Make the call with less back-and-forth.",
    note: "Less friction",
    icon: Sparkles,
  },
];

type AudienceMode = "student" | "owner";

const HERO_CONTENT: Record<
  AudienceMode,
  {
    eyebrow: string;
    titlePrefix: string;
    titleSuffix: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  }
> = {
  student: {
    eyebrow: "Student housing and services",
    titlePrefix: "Find your place in",
    titleSuffix: "faster.",
    description: "Verified stays, rent, sharing, and mess options in one place.",
    primaryLabel: "Browse stays",
    primaryHref: "/stays",
    secondaryLabel: "Create student account",
    secondaryHref: "/signup?intent=student",
  },
  owner: {
    eyebrow: "Owner tools for stays and meals",
    titlePrefix: "Start listing in",
    titleSuffix: "for students.",
    description: "Create a flat owner account or a mess owner account and go straight into the right flow.",
    primaryLabel: "Create flat owner account",
    primaryHref: "/signup?intent=property_owner",
    secondaryLabel: "Create mess owner account",
    secondaryHref: "/signup?intent=mess_owner",
  },
};

export default function Home() {
  const [cityIndex, setCityIndex] = useState(0);
  const [audience, setAudience] = useState<AudienceMode>("student");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCityIndex((current) => (current + 1) % CITY_NAMES.length);
    }, 2200);

    return () => window.clearInterval(timer);
  }, []);

  const currentContent = HERO_CONTENT[audience];

  return (
    <div className="page-shell">
      <section className="px-4 pb-10 pt-4 sm:px-6">
        <div className="hero-frame grain mx-auto max-w-6xl px-6 py-7 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div className="hero-orb right-[10%] top-[14%] h-36 w-36 opacity-75 sm:h-52 sm:w-52" />

          <div className="relative z-[2]">
            <div className="mb-8 flex justify-center">
              <div className="inline-flex rounded-[1.5rem] border border-white/14 bg-[#1e2232]/82 p-1 shadow-[0_14px_28px_rgba(18,24,41,0.24)]">
                <button
                  type="button"
                  onClick={() => setAudience("student")}
                  className={`inline-flex items-center gap-2 rounded-[1.15rem] px-5 py-3 text-sm font-semibold transition-all sm:px-8 ${
                    audience === "student"
                      ? "bg-white text-text-primary shadow-[0_10px_22px_rgba(255,255,255,0.14)]"
                      : "bg-white/8 text-[#eef4fd] hover:bg-white/12 hover:text-white"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Want a place
                </button>
                <button
                  type="button"
                  onClick={() => setAudience("owner")}
                  className={`inline-flex items-center gap-2 rounded-[1.15rem] px-5 py-3 text-sm font-semibold transition-all sm:px-8 ${
                    audience === "owner"
                      ? "bg-white text-text-primary shadow-[0_10px_22px_rgba(255,255,255,0.14)]"
                      : "bg-white/8 text-[#eef4fd] hover:bg-white/12 hover:text-white"
                  }`}
                >
                  <HomeIcon className="h-4 w-4" />
                  Own a place
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-b border-white/12 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="blue-chip w-fit">{currentContent.eyebrow}</span>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/95">
                <span className="text-white/95">Student-first discovery</span>
                <span className="h-1 w-1 rounded-full bg-white/45" />
                <span className="text-white/90">Built for students, flat owners, and mess owners</span>
              </div>
            </div>

            <div className="pt-10">
              <div className="max-w-2xl">
                <motion.h1
                  key={audience}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[4.4rem]"
                >
                  <span className="block">{currentContent.titlePrefix}</span>
                  <span className="mt-1 block text-[#bedcff]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${audience}-${cityIndex}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.28 }}
                        className="inline-block"
                      >
                        {CITY_NAMES[cityIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="mt-1 block text-white">{currentContent.titleSuffix}</span>
                </motion.h1>

                <motion.p
                  key={`${audience}-description`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 }}
                  className="mt-6 max-w-xl text-base leading-8 text-[#edf4ff] sm:text-lg"
                >
                  {currentContent.description}
                </motion.p>

                <motion.div
                  key={`${audience}-actions`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="mt-8 flex flex-col gap-4 sm:flex-row"
                >
                  <Link href={currentContent.primaryHref} className="btn-primary">
                    {currentContent.primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={currentContent.secondaryHref}
                    className="btn-secondary !border-white/24 !bg-white/10 !text-white hover:!bg-white/16 hover:!text-white"
                  >
                    {currentContent.secondaryLabel}
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <span className="eyebrow">What you can do</span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-text-primary sm:text-5xl">
              For students and owners.
            </h2>
            <p className="mt-4 text-base leading-7 text-text-secondary sm:text-lg">
              Find stays faster or list for the right students.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="section-frame flex h-full flex-col !px-6 !py-6 sm:!px-7 sm:!py-7"
                >
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between gap-4">
                      <span className="eyebrow !gap-2 !text-[11px] !tracking-[0.18em]">
                        {feature.eyebrow}
                      </span>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-500/15 bg-white/55">
                        <Icon className={`h-[1.15rem] w-[1.15rem] ${feature.iconTone}`} />
                      </div>
                    </div>

                    <h3 className="mt-8 text-[1.9rem] font-semibold leading-tight text-text-primary">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6">
        <div className="section-frame-dark mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <span className="blue-chip">How it works</span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              A simpler flow.
            </h2>
            <p className="mt-4 text-base leading-7 text-white sm:text-lg">
              Pick your side, compare the essentials, and move.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
              {STEPS.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-[2rem] border border-white/12 bg-white/[0.06] p-7"
                  >
                    <div className="mb-8 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                          Step {step.num}
                        </div>
                        <div className="mt-3 text-sm font-medium text-white/78">{step.note}</div>
                      </div>
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/12 bg-white/[0.08] text-white/90">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="mb-5 text-5xl font-semibold leading-none text-white/18">{step.num}</div>
                    <h3 className="max-w-xs text-[1.7rem] font-semibold leading-tight text-white">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-sm text-base leading-8 text-[#eef4fd]">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-10 sm:px-6">
        <div className="section-frame-dark section-glow mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="blue-chip">Start here</span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Search or list.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#eef4fd] sm:text-lg">
              Browse stays, publish a flat, or list a mess service.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/stays" className="btn-primary">
              Find a place
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup?intent=property_owner"
              className="btn-secondary !border-white/18 !bg-white/10 !text-white hover:!bg-white/16 hover:!text-white"
            >
              Create flat owner account
            </Link>
            <Link
              href="/signup?intent=mess_owner"
              className="btn-secondary !border-white/18 !bg-white/10 !text-white hover:!bg-white/16 hover:!text-white"
            >
              Create mess owner account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
