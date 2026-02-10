"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessCard } from "@/components/eats/mess-card";
import { MESS_VENDORS } from "@/lib/mockData";
import { useState } from "react";
import { Map as MapIcon, List, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/map/map-view"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-slate-50 z-50 flex items-center justify-center">Loading Map...</div>
});

export default function EatsPage() {
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);

    const handleShowOnMap = (coordinates?: { lat: number; lng: number }) => {
        if (coordinates) {
            setMapCenter(coordinates);
            setViewMode("map");
        }
    };

    return (
        <div className={cn("container mx-auto px-4", viewMode === "map" ? "pt-6" : "")}>
            {viewMode === "list" ? (
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

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-2"
                    >
                        <div className="flex bg-slate-100 p-1 rounded-full">
                            <button
                                onClick={() => setViewMode("list")}
                                className="px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 bg-white text-slate-900 shadow-sm"
                            >
                                <List className="w-4 h-4" /> List
                            </button>
                            <button
                                onClick={() => setViewMode("map")}
                                className="px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 text-slate-500 hover:text-slate-700"
                            >
                                <MapIcon className="w-4 h-4" /> Map
                            </button>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 items-center mb-6 gap-4">
                    <div className="hidden md:block"></div>

                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-left md:text-center">
                        BeyondCampus <span className="text-slate-500">Eats</span>
                    </h1>

                    <div className="flex justify-end">
                        <div className="flex bg-slate-100 p-1 rounded-full">
                            <button
                                onClick={() => setViewMode("list")}
                                className="px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 text-slate-500 hover:text-slate-700"
                            >
                                <List className="w-4 h-4" /> List
                            </button>
                            <button
                                onClick={() => setViewMode("map")}
                                className="px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 bg-white text-slate-900 shadow-sm"
                            >
                                <MapIcon className="w-4 h-4" /> Map
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {viewMode === "list" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MESS_VENDORS.map((vendor, index) => (
                        <motion.div
                            key={vendor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="h-full"
                        >
                            <MessCard
                                vendor={vendor}
                                onShowOnMap={() => handleShowOnMap(vendor.coordinates)}
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-50 relative">
                    <MapView type="eats" centerOn={mapCenter} />
                </div>
            )}
        </div>
    );
}
