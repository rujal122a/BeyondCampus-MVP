"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { CookingPot, Home, Loader2, Search } from "lucide-react";

export default function OnboardingSelectorPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [isRouting, setIsRouting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, router, user]);

  const handleSelection = (role: "seeker" | "property_owner" | "mess_owner") => {
    setIsRouting(true);
    if (role === "seeker") {
      router.push("/onboarding/student");
      return;
    }

    router.push(role === "property_owner" ? "/onboarding/owner" : "/onboarding/mess-owner");
  };

  if (isLoading || !user) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-text-secondary" />
      </div>
    );
  }

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl gap-6">
        <div className="section-frame-dark text-center">
          <span className="eyebrow !border-white/35 !bg-white/8 !text-white/70">Onboarding</span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Choose the role you want to set up first.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/70">
            You can start as a student, a flat owner publishing stays, or a mess owner listing meal
            plans for students.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handleSelection("seeker")}
            disabled={isRouting}
            className="section-frame text-left transition hover:bg-white/35"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-border-subtle bg-surface text-white">
              <Search className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-semibold text-text-primary">I&apos;m a student</h2>
            <p className="mt-4 text-base leading-7 text-text-secondary">
              I want to find a stay, compare local meal plans, and set up my student profile.
            </p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            onClick={() => handleSelection("property_owner")}
            disabled={isRouting}
            className="section-frame text-left transition hover:bg-white/35"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-border-subtle bg-surface text-white">
              <Home className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-semibold text-text-primary">I&apos;m a flat owner</h2>
            <p className="mt-4 text-base leading-7 text-text-secondary">
              I want to publish flats, PGs, or student housing inventory.
            </p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            onClick={() => handleSelection("mess_owner")}
            disabled={isRouting}
            className="section-frame text-left transition hover:bg-white/35"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-border-subtle bg-surface text-white">
              <CookingPot className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-semibold text-text-primary">I&apos;m a mess owner</h2>
            <p className="mt-4 text-base leading-7 text-text-secondary">
              I want to list a mess or tiffin service for students near campus.
            </p>
          </motion.button>
        </div>

        {isRouting ? (
          <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-border-subtle bg-white/35 px-5 py-3 text-sm text-text-secondary">
            <Loader2 className="h-4 w-4 animate-spin" />
            Preparing your onboarding flow...
          </div>
        ) : null}
      </div>
    </div>
  );
}
