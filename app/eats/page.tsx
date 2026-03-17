"use client";

import { motion } from "framer-motion";
import { MessCard } from "@/components/eats/mess-card";
import { useState, useEffect } from "react";
import { Map as MapIcon, List, UtensilsCrossed, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

const MapView = dynamic(() => import("@/components/map/map-view"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-brand-offwhite z-50 flex items-center justify-center text-slate-500 font-medium">Loading Map...</div>
});

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800";

interface ServiceResponse {
    id: string | number;
    name: string;
    description: string;
    cuisine: string;
    price_per_month: number;
    delivery_time: string;
    today_menu: string[];
    image_url: string;
    rating: number;
    coordinates?: { lat: number; lng: number };
}

export default function EatsPage() {
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);
    const [vendors, setVendors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchServices() {
            try {
                const { data, error } = await supabase
                    .from('mess_services')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    const mappedVendors = data.map((v: ServiceResponse) => ({
                        id: v.id,
                        name: v.name,
                        rating: v.rating || 4.5,
                        cuisine: v.cuisine,
                        pricePerMonth: v.price_per_month,
                        todayMenu: v.today_menu || [],
                        image: v.image_url || FALLBACK_IMAGE,
                        deliveryTime: v.delivery_time,
                        description: v.description,
                        coordinates: v.coordinates
                    }));
                    setVendors(mappedVendors);
                }
            } catch (error) {
                console.error("Error fetching mess services:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchServices();
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
                        <span className="badge bg-green-50 text-emerald-700 border-green-200 mb-3 inline-flex">
                            🍱 Fresh & Local
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-black tracking-tight mt-2 mb-2">
                            Fuel Your Hustle
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">
                            Verified mess services & tiffin providers. Taste of home, zero effort.
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
                                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                                    <Loader2 className="w-7 h-7 animate-spin text-emerald-500" />
                                </div>
                                <p className="text-slate-500 font-semibold">Loading local mess spots...</p>
                            </div>
                        ) : vendors.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {vendors.map((vendor, index) => (
                                    <motion.div
                                        key={vendor.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                        className="h-full"
                                    >
                                        <MessCard vendor={vendor} onShowOnMap={() => handleShowOnMap(vendor.coordinates)} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center">
                                <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
                                    <UtensilsCrossed className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-black mb-2">No services found</h3>
                                <p className="text-slate-500 max-w-md font-medium">
                                    No active mess providers listed yet. Be the first to list yours!
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-[600px] rounded-4xl overflow-hidden shadow-xl border border-slate-200 bg-slate-50 relative">
                        <MapView type="eats" centerOn={mapCenter} />
                    </div>
                )}
            </div>
        </div>
    );
}
