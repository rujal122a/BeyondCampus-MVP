"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BedDouble, UtensilsCrossed, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { name: "Home", path: "/", icon: Home },
    { name: "Stays", path: "/stays", icon: BedDouble },
    { name: "Eats", path: "/eats", icon: UtensilsCrossed },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-6 inset-x-0 mx-auto w-[90%] max-w-2xl z-50 pointer-events-none"
        >
            <div className="pointer-events-auto backdrop-blur-xl bg-white/60 border border-white/50 rounded-full px-6 py-3 shadow-lg flex items-center justify-between">
                <Link href="/" className="font-bold text-lg tracking-tight text-slate-900 mr-8">
                    BeyondCampus.
                </Link>

                <div className="flex items-center gap-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    "relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2",
                                    isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-700 hover:bg-white/30"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-white/80 rounded-full border border-white/50 shadow-sm"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <div className="ml-4 pl-4 border-l border-white/30">
                    <button className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
                        <User className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}
