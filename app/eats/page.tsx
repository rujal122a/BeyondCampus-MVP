
"use client";

import { motion } from "framer-motion";
import { MessCard } from "@/components/eats/mess-card";
import { MESS_VENDORS } from "@/lib/mockData";

export default function EatsPage() {
    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Fuel Your Hustle</h1>
                    <p className="text-slate-600">
                        Verified mess services & tiffin providers. Taste of home, zero effort.
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MESS_VENDORS.map((vendor, index) => (
                    <motion.div
                        key={vendor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="h-full"
                    >
                        <MessCard vendor={vendor} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
