"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { Loader2, Home, Search } from "lucide-react";

export default function OnboardingSelectorPage() {
    const router = useRouter();
    const { user, isLoading } = useAuthStore();
    const [isRouting, setIsRouting] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    const handleSelection = (role: "seeker" | "lister") => {
        setIsRouting(true);
        router.push(role === "seeker" ? "/onboarding/student" : "/onboarding/owner");
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-offwhite">
                <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 grain"
            style={{ background: "linear-gradient(135deg, #3D4ADB 0%, #5B6AFF 100%)" }}>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-lg">B</span>
                    <span className="font-black text-2xl tracking-tight text-white">BeyondCampus</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">Welcome aboard!</h1>
                <p className="text-white/70 text-xl font-medium">How can we help you today?</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">
                {/* Student */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => handleSelection("seeker")}
                    disabled={isRouting}
                    className="bg-white p-8 rounded-4xl border border-transparent hover:border-brand-green hover:-translate-y-1 hover:shadow-2xl transition-all group text-left relative overflow-hidden"
                >
                    <div className="w-16 h-16 bg-purple-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-purple transition-all">
                        <Search className="w-8 h-8 text-brand-purple group-hover:text-white transition-colors" />
                    </div>
                    <h2 className="text-2xl font-black text-brand-black mb-3">I'm a Student</h2>
                    <p className="text-slate-500 text-base font-medium leading-relaxed">
                        Looking for a place to stay, roommates, or campus services.
                    </p>
                    <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-brand-green flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                        <span className="text-brand-black font-black text-lg">→</span>
                    </div>
                </motion.button>

                {/* Owner */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => handleSelection("lister")}
                    disabled={isRouting}
                    className="bg-white p-8 rounded-4xl border border-transparent hover:border-brand-green hover:-translate-y-1 hover:shadow-2xl transition-all group text-left relative overflow-hidden"
                >
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-black transition-all">
                        <Home className="w-8 h-8 text-brand-black group-hover:text-white transition-colors" />
                    </div>
                    <h2 className="text-2xl font-black text-brand-black mb-3">I'm a Property Owner</h2>
                    <p className="text-slate-500 text-base font-medium leading-relaxed">
                        Listing a property, PG, or offering student food services.
                    </p>
                    <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-brand-green flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                        <span className="text-brand-black font-black text-lg">→</span>
                    </div>
                </motion.button>
            </div>

            {isRouting && (
                <div className="mt-10 flex items-center gap-3 text-white/80 font-semibold">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Setting things up...
                </div>
            )}
        </div>
    );
}
