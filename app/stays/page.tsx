"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FlatCard } from "@/components/stays/flat-card";
import { useState, useEffect } from "react";
import { Map as MapIcon, List, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { Flat } from "@/lib/mockData";

const MapView = dynamic(() => import("@/components/map/map-view"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-brand-offwhite z-50 flex items-center justify-center text-slate-500 font-medium">Loading Map...</div>
});

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800";

export default function StaysPage() {
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);
    const [listings, setListings] = useState<Flat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchListings() {
            try {
                const { data, error } = await supabase
                    .from('listings')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    const mappedListings: Flat[] = data.map((l: any) => ({
                        id: l.id,
                        title: l.title,
                        location: l.location,
                        price: l.rent_price || 0,
                        type: l.type || "2BHK",
                        images: l.image_urls && l.image_urls.length > 0 ? l.image_urls : [FALLBACK_IMAGE],
                        tags: l.amenities || [],
                        lobby: [],
                        ownerContact: "Contact via Dashboard",
                        isLocked: l.is_active === false,
                        description: l.description,
                        amenities: l.amenities || [],
                        houseRules: l.house_rules || [],
                        distanceToCampus: l.distance_from_campus || "N/A",
                        coordinates: l.coordinates
                    }));
                    setListings(mappedListings);
                }
            } catch (error) {
                console.error("Error fetching listings:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchListings();
    }, []);

    const handleShowOnMap = (coordinates?: { lat: number; lng: number }) => {
        if (coordinates) {
            setMapCenter(coordinates);
            setViewMode("map");
        }
    };

    return (
        <div className="min-h-screen bg-brand-offwhite">
            <div className={cn("max-w-7xl mx-auto px-4 sm:px-6", viewMode === "map" ? "pt-6" : "pt-8 pb-16")}>

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <span className="badge bg-purple-50 text-brand-purple border-purple-200 mb-3 inline-flex">
                            🏠 Available Now
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-black tracking-tight mt-2 mb-2">
                            Find Your Stay
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">
                            Direct connections. Verified spaces. Zero brokerage.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex bg-white border border-slate-200 p-1 rounded-full shadow-sm">
                            <button
                                onClick={() => setViewMode("list")}
                                className={cn(
                                    "px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                                    viewMode === "list"
                                        ? "bg-brand-black text-white shadow-sm"
                                        : "text-slate-500 hover:text-brand-black"
                                )}
                            >
                                <List className="w-4 h-4" /> List
                            </button>
                            <button
                                onClick={() => setViewMode("map")}
                                className={cn(
                                    "px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                                    viewMode === "map"
                                        ? "bg-brand-black text-white shadow-sm"
                                        : "text-slate-500 hover:text-brand-black"
                                )}
                            >
                                <MapIcon className="w-4 h-4" /> Map
                            </button>
                        </div>
                    </motion.div>
                </div>

                {viewMode === "list" ? (
                    <>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-32">
                                <div className="w-14 h-14 rounded-full bg-brand-purple/10 flex items-center justify-center mb-4">
                                    <Loader2 className="w-7 h-7 animate-spin text-brand-purple" />
                                </div>
                                <p className="text-slate-500 font-semibold">Loading live properties...</p>
                            </div>
                        ) : listings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listings.map((flat, index) => (
                                    <motion.div
                                        key={flat.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                        className="h-full"
                                    >
                                        <FlatCard flat={flat} onShowOnMap={() => handleShowOnMap(flat.coordinates)} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center">
                                <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
                                    <MapPin className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-black mb-2">No properties found</h3>
                                <p className="text-slate-500 max-w-md font-medium">
                                    There are currently no active property listings. Be the first to list a property!
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-[600px] rounded-4xl overflow-hidden shadow-xl border border-slate-200 bg-slate-50 relative">
                        <MapView type="stays" centerOn={mapCenter} />
                    </div>
                )}
            </div>
        </div>
    );
}
