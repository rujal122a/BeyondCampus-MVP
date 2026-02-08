
"use client";

import { motion } from "framer-motion";
import { FlatCard } from "@/components/stays/flat-card";
import { FLATS } from "@/lib/mockData";

export default function StaysPage() {
    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Find Your Tribe</h1>
                    <p className="text-slate-600">
                        Join a live lobby or start your own. Split the rent, not the vibe.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2"
                >
                    <button className="px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-slate-600 text-sm font-medium hover:bg-white/80 transition-colors">
                        Filters
                    </button>
                    <button className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                        + List Your Flat
                    </button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FLATS.map((flat, index) => (
                    <motion.div
                        key={flat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="h-full"
                    >
                        <FlatCard flat={flat} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
