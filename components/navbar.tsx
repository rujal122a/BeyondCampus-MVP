"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BedDouble,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import { useState, useRef, useEffect } from "react";

const NAV_ITEMS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Stays", path: "/stays", icon: BedDouble },
  { name: "Eats", path: "/eats", icon: UtensilsCrossed },
];

export function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setShowDropdown(false);
    await supabase.auth.signOut();
  };

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pointer-events-none fixed inset-x-0 top-5 z-50 mx-auto w-[94%] max-w-6xl"
    >
      <div className="pointer-events-auto nav-panel flex items-center justify-between rounded-full px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-lg font-semibold tracking-tight">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(189,221,255,0.62)] bg-[linear-gradient(135deg,rgba(162,205,255,0.96)_0%,rgba(95,152,216,0.96)_100%)] text-sm font-bold text-white shadow-[0_12px_22px_rgba(42,81,128,0.22)]">
            B
          </span>
          <span>BeyondCampus</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-[linear-gradient(135deg,rgba(95,152,216,0.98)_0%,rgba(66,105,152,0.98)_100%)] text-white shadow-[0_14px_26px_rgba(42,81,128,0.22)]"
                    : "text-text-secondary hover:bg-white/45 hover:text-text-primary"
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="relative flex items-center gap-2" ref={dropdownRef}>
          {user ? (
            <>
              <button
                type="button"
                onClick={() => setShowDropdown((current) => !current)}
                className="btn-primary !rounded-full !px-4 !py-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </button>

              <AnimatePresence>
                {showDropdown ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="frame-panel absolute right-0 top-full mt-3 min-w-56 rounded-4xl p-2"
                  >
                    <div className="rounded-3xl px-3 py-3">
                      <p className="text-sm font-semibold text-text-primary">Signed in</p>
                      <p className="truncate text-xs text-text-secondary">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 rounded-3xl px-3 py-3 text-sm text-text-primary transition hover:bg-white/35"
                      onClick={() => setShowDropdown(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-3xl px-3 py-3 text-sm text-text-primary transition hover:bg-white/35"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn-ghost">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary">
                Join now
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="btn-secondary md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="pointer-events-auto mt-3 md:hidden"
          >
            <div className="nav-panel rounded-5xl p-3">
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-[linear-gradient(135deg,rgba(95,152,216,0.98)_0%,rgba(66,105,152,0.98)_100%)] text-white shadow-[0_12px_24px_rgba(42,81,128,0.2)]"
                          : "text-text-primary hover:bg-white/45"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
                {!user ? (
                  <div className="flex gap-2 pt-2">
                    <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-secondary flex-1">
                      Log in
                    </Link>
                    <Link href="/signup" onClick={() => setMenuOpen(false)} className="btn-primary flex-1">
                      Join now
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  );
}
