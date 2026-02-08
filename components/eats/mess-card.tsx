"use client";

import { Star, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import Image from "next/image";
import { toast } from "sonner";

interface MessProps {
    vendor: {
        id: number;
        name: string;
        rating: number;
        cuisine: string;
        pricePerMonth: number;
        todayMenu: string[];
        image: string;
        deliveryTime?: string;
    };
}

export function MessCard({ vendor }: MessProps) {
    const handleViewPlans = () => {
        toast.info(`Viewing plans for ${vendor.name}`, {
            description: "Subscription flows are coming soon!",
        });
    };

    return (
        <GlassCard className="p-0 overflow-hidden flex flex-col h-full group">
            <div className="relative h-40 w-full overflow-hidden">
                <Image
                    src={vendor.image}
                    alt={vendor.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <UtensilsCrossed className="w-3 h-3" />
                    {vendor.cuisine}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-aurora-orange transition-colors">{vendor.name}</h3>
                    <div className="flex items-center gap-1 bg-yellow-100 px-1.5 py-0.5 rounded text-xs font-bold text-yellow-700">
                        <Star className="w-3 h-3 fill-yellow-700" />
                        {vendor.rating}
                    </div>
                </div>

                <div className="mb-4">
                    <span className="text-2xl font-bold text-slate-900">₹{vendor.pricePerMonth.toLocaleString()}</span>
                    <span className="text-xs text-slate-500"> / month</span>
                </div>

                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex-grow mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Today&apos;s Menu</span>
                    <ul className="space-y-1">
                        {vendor.todayMenu.map((item, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    onClick={handleViewPlans}
                    className="w-full py-2.5 rounded-xl border-2 border-slate-900 text-slate-900 font-bold text-sm hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                >
                    View Plans
                </button>
            </div>
        </GlassCard>
    );
}
