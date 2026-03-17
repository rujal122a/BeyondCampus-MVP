"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BedDouble, UtensilsCrossed, User, LogOut, Home, Menu, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

const NAV_ITEMS = [
    { name: "Home", path: "/", icon: Home },
    { name: "Stays", path: "/stays", icon: BedDouble },
    { name: "Eats", path: "/eats", icon: UtensilsCrossed },
];

export function Navbar() {
    const pathname = usePathname();
    const { user } = useAuthStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        setShowDropdown(false);
        await supabase.auth.signOut();
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-5 inset-x-0 mx-auto w-[92%] max-w-5xl z-50 pointer-events-none"
        >
            <div className="pointer-events-auto backdrop-blur-xl bg-white/75 border border-white/60 rounded-full px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-between">
                
                {/* Logo */}
                <Link href="/" className="font-black text-xl tracking-tight text-brand-black shrink-0 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-brand-purple flex items-center justify-center text-white text-xs font-black">B</span>
                    BeyondCampus
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    "relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap",
                                    isActive
                                        ? "text-brand-black bg-white shadow-sm border border-black/5"
                                        : "text-slate-500 hover:text-brand-black hover:bg-black/5"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2 shrink-0 relative">
                    {user ? (
                        <>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="w-9 h-9 rounded-full bg-brand-black text-white flex items-center justify-center hover:opacity-80 transition shadow-sm focus:outline-none"
                            >
                                <User className="w-4 h-4" />
                            </button>

                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-1"
                                    >
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-sm font-bold text-slate-900 truncate">Account</p>
                                            <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <LayoutDashboard className="w-4 h-4 text-brand-purple" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-brand-black transition-colors px-3 py-2"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="px-5 py-2 rounded-full bg-brand-black text-white text-sm font-bold hover:opacity-80 transition-all shadow-sm"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden ml-1 w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-black/5 transition"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto mt-2 mx-2 bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden"
                    >
                        <div className="p-4 space-y-1">
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.path;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
                                            isActive
                                                ? "bg-brand-purple text-white"
                                                : "text-slate-600 hover:bg-slate-100"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            {!user && (
                                <div className="pt-2 border-t border-slate-100 flex gap-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold bg-brand-black text-white"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
