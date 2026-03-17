"use client";

import { Star, UtensilsCrossed, CheckCircle2, Map, ArrowRight } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface MessCardProps {
    vendor: {
        id: number;
        name: string;
        rating: number;
        cuisine: string;
        pricePerMonth: number;
        todayMenu: string[];
        image: string;
        deliveryTime?: string;
        coordinates?: { lat: number; lng: number };
    };
    onShowOnMap?: () => void;
}

export function MessCard({ vendor, onShowOnMap }: MessCardProps) {
    const handleViewPlans = () => {
        toast.info(`Viewing plans for ${vendor.name}`, {
            description: "Subscription flows are coming soon!",
        });
    };

    return (
        <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={vendor.image}
                    alt={vendor.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                
                {/* Rating */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-brand-black text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {vendor.rating}
                </div>

                {/* Cuisine badge */}
                <div className="absolute top-4 left-4 bg-brand-black/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3 h-3" />
                    {vendor.cuisine}
                </div>

                {/* Price overlay */}
                <div className="absolute bottom-4 left-4">
                    <span className="bg-white text-brand-black font-black text-base px-3 py-1 rounded-full shadow-lg">
                        ₹{vendor.pricePerMonth.toLocaleString()}<span className="font-medium text-xs text-slate-500">/mo</span>
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-brand-black group-hover:text-emerald-600 transition-colors mb-3">
                    {vendor.name}
                </h3>

                {/* Today's Menu */}
                {vendor.todayMenu.length > 0 && (
                    <div className="bg-brand-offwhite rounded-2xl p-4 border border-slate-100 flex-grow mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Today's Menu</span>
                        <ul className="space-y-1.5">
                            {vendor.todayMenu.slice(0, 3).map((item, i) => (
                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2 font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-auto flex gap-2">
                    {onShowOnMap && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onShowOnMap(); }}
                            className="px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-600 bg-brand-offwhite hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5"
                        >
                            <Map className="w-3.5 h-3.5" /> Map
                        </button>
                    )}
                    <button
                        onClick={handleViewPlans}
                        className="flex-1 py-2.5 rounded-2xl text-sm font-bold text-white bg-brand-black hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        View Plans <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
