"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * Optional path to redirect to after successful login.
   * If not provided, will redirect to /login without a next param.
   */
  redirectTo?: string;
}

export function LoginPromptModal({ open, onClose, redirectTo }: LoginPromptModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const loginHref = redirectTo ? `/login?next=${encodeURIComponent(redirectTo)}` : "/login";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200/40 bg-white/95 p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-text-secondary transition hover:bg-slate-100 hover:text-text-primary"
          aria-label="Close login prompt"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-2xl font-semibold text-text-primary">Login required</h2>
        <p className="mt-4 text-sm leading-7 text-text-secondary">
          You need to be logged in to view full details for this stay.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => router.push(loginHref)}
            className="btn-primary w-full sm:w-auto"
          >
            Log in
          </button>
          <button type="button" onClick={onClose} className="btn-secondary w-full sm:w-auto">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
