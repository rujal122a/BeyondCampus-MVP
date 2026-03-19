import Link from "next/link";
import { BedDouble, Home, Instagram, Linkedin, Twitter, UtensilsCrossed } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-[linear-gradient(135deg,rgba(66,63,61,0.99)_0%,rgba(73,69,67,0.99)_50%,rgba(63,60,58,0.99)_100%)] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="blue-chip mb-4 w-fit">Campus-first living</div>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(189,221,255,0.4)] bg-[linear-gradient(135deg,rgba(162,205,255,0.96)_0%,rgba(95,152,216,0.96)_100%)] text-sm font-bold text-white shadow-[0_12px_22px_rgba(42,81,128,0.2)]">
                B
              </span>
              <span className="text-xl font-semibold tracking-tight">BeyondCampus</span>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/70">
              The community living operating system for students who need a better stay, a better
              meal plan, and a simpler move.
            </p>
            <div className="mt-6 flex items-center gap-3 text-white/80">
              <a
                href="#"
                aria-label="Twitter"
                className="btn-secondary !rounded-full !border-white/18 !bg-white/8 !text-white hover:!bg-[rgba(155,201,255,0.16)] hover:!text-white"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="btn-secondary !rounded-full !border-white/18 !bg-white/8 !text-white hover:!bg-[rgba(155,201,255,0.16)] hover:!text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="btn-secondary !rounded-full !border-white/18 !bg-white/8 !text-white hover:!bg-[rgba(155,201,255,0.16)] hover:!text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Platform
            </h4>
            <div className="space-y-3 text-sm text-white/80">
              <Link href="/" className="flex items-center gap-2 transition hover:text-white">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link href="/stays" className="flex items-center gap-2 transition hover:text-white">
                <BedDouble className="h-4 w-4" />
                Stays
              </Link>
              <Link href="/eats" className="flex items-center gap-2 transition hover:text-white">
                <UtensilsCrossed className="h-4 w-4" />
                Eats
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Account
            </h4>
            <div className="space-y-3 text-sm text-white/80">
              <Link href="/login" className="block transition hover:text-white">
                Log in
              </Link>
              <Link href="/signup?intent=student" className="block transition hover:text-white">
                Student sign up
              </Link>
              <Link href="/signup?intent=property_owner" className="block transition hover:text-white">
                Flat owner sign up
              </Link>
              <Link href="/signup?intent=mess_owner" className="block transition hover:text-white">
                Mess owner sign up
              </Link>
              <Link href="/dashboard" className="block transition hover:text-white">
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/12 pt-6 text-sm text-white/55">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 BeyondCampus. All rights reserved.</p>
            <p>Made for students who want a calmer off-campus move.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
