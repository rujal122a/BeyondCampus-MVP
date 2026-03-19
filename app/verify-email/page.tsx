"use client";

import { ArrowRight, MailCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { getAuthIntentConfig, parseAuthIntent } from "@/lib/auth-intent";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const intent = parseAuthIntent(searchParams.get("intent"));

  const intentConfig = getAuthIntentConfig(intent);
  const loginHref = intent ? `/login?intent=${intent}` : "/login";

  return (
    <div className="page-shell flex min-h-screen items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="section-frame max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border-subtle bg-white/35">
          <MailCheck className="h-10 w-10 text-text-primary" />
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-text-primary">Check your inbox</h1>

        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-text-secondary">
          We sent a confirmation link to your email address. Open it to verify your account and{" "}
          {intentConfig?.verifyEmailCopy ?? "continue into onboarding"}.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Link href={loginHref} className="btn-primary">
            Go to login
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-sm text-text-secondary">
            Didn&apos;t receive the email? Check your spam folder first.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
