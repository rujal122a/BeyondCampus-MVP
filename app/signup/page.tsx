"use client";

import { useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, Mail, ShieldCheck, Sparkles, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { getAuthIntentConfig, getOnboardingPathForIntent, parseAuthIntent } from "@/lib/auth-intent";

function SignupContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const intent = parseAuthIntent(searchParams.get("intent"));

  const intentConfig = getAuthIntentConfig(intent);
  const loginHref = intent ? `/login?intent=${intent}` : "/login";

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const nextPath = getOnboardingPathForIntent(intent);

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `https://beyond-campus-mvp.vercel.app/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      toast.error("An account with this email already exists. Please log in.");
      setLoading(false);
      return;
    }

    toast.success("Account created. Please check your email to verify it.");

    if (!data.session) {
      router.push(intent ? `/verify-email?intent=${intent}` : "/verify-email");
      return;
    }

    router.push(nextPath);
  };

  return (
    <div className="page-shell px-4 pb-16 pt-4 sm:px-6">
      <div className="section-frame section-glow mx-auto max-w-6xl !p-0 overflow-hidden">
        <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
          <div className="hero-frame px-6 py-8 sm:px-10 sm:py-10 lg:flex lg:min-h-[680px] lg:flex-col lg:justify-between lg:px-12 lg:py-12">
            <div className="hero-orb right-[-4.5rem] top-[-3rem] h-40 w-40 sm:h-52 sm:w-52" />
            <div className="relative z-[1] max-w-md">
              <span className="eyebrow !text-white/70 before:!bg-white/75">New account</span>
              <h1 className="mt-5 text-4xl font-semibold leading-[0.98] tracking-tight text-white sm:text-5xl">
                Start your BeyondCampus profile in one clean pass.
              </h1>
            </div>

            <div className="relative z-[1] mt-8 space-y-3 sm:mt-10">
              {[
                { icon: Sparkles, text: "A single account for stays and meal services" },
                { icon: ShieldCheck, text: "Supabase-backed authentication and sessions" },
                { icon: Users, text: "Onboarding designed for students, flat owners, and mess owners" },
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
              <span className="eyebrow">Create account</span>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary">Sign up</h2>
              <p className="mt-3 text-base leading-7 text-text-secondary">
                {intentConfig
                  ? `Create your ${intentConfig.signupLabel} and continue into the right onboarding flow after verification.`
                  : "Create your account and continue into onboarding right after verification."}
              </p>

              <form onSubmit={handleSignup} className="mt-8 space-y-5">
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
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="field pl-11"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="mt-6 text-sm text-text-secondary">
                Already have an account?{" "}
                <Link href={loginHref} className="font-medium text-text-primary underline underline-offset-4">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-text-secondary" /></div>}>
      <SignupContent />
    </Suspense>
  );
}
