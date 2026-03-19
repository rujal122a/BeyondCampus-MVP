"use client";

import { useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BedDouble, Loader2, Lock, LogIn, Mail, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { getAuthIntentConfig, getOnboardingPathForIntent, parseAuthIntent } from "@/lib/auth-intent";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const intent = parseAuthIntent(searchParams.get("intent"));
  const nextPath = searchParams.get("next");

  const intentConfig = getAuthIntentConfig(intent);
  const signupHref = intent ? `/signup?intent=${intent}` : "/signup";

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", data.user.id)
      .single();

    toast.success("Logged in successfully.");
    const redirectTo = nextPath ?? (profile ? "/dashboard" : getOnboardingPathForIntent(intent));
    router.push(redirectTo);
  };

  return (
    <div className="page-shell px-4 pb-16 pt-4 sm:px-6">
      <div className="section-frame section-glow mx-auto max-w-6xl !p-0 overflow-hidden">
        <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
          <div className="hero-frame px-6 py-8 sm:px-10 sm:py-10 lg:flex lg:min-h-[680px] lg:flex-col lg:justify-between lg:px-12 lg:py-12">
            <div className="hero-orb right-[-4.5rem] top-[-3rem] h-40 w-40 sm:h-52 sm:w-52" />
            <div className="relative z-[1] max-w-md">
              <span className="eyebrow !text-white/70 before:!bg-white/75">Welcome back</span>
              <h1 className="mt-5 text-4xl font-semibold leading-[0.98] tracking-tight text-white sm:text-5xl">
                Log in and get back to your move.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/72 sm:text-base">
                Resume onboarding, manage listings, and stay on top of student housing in one place.
              </p>
            </div>

            <div className="relative z-[1] mt-8 space-y-3 sm:mt-10">
              {[
                { icon: ShieldCheck, text: "Verified listing workflows" },
                { icon: Users, text: "Student matching profiles" },
                { icon: BedDouble, text: "Stays and services together" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="rounded-5xl border border-white/14 bg-white/7 px-5 py-4 backdrop-blur-sm">
                  <div className="inline-flex items-center gap-3 text-white/90">
                    <Icon className="h-5 w-5 text-white/80" />
                    <span className="text-sm font-medium sm:text-base">{text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            <div className="w-full max-w-md">
              <span className="eyebrow">Account access</span>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary">Log in</h2>
              <p className="mt-3 text-base leading-7 text-text-secondary">
                {intentConfig
                  ? `Access your ${intentConfig.loginLabel} and continue where you left off.`
                  : "Access your dashboard, onboarding flow, and published inventory."}
              </p>

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="field pl-11"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="field pl-11"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </form>

              <p className="mt-6 text-sm text-text-secondary">
                Don&apos;t have an account?{" "}
                <Link href={signupHref} className="font-medium text-text-primary underline underline-offset-4">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-text-secondary" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
