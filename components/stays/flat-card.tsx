"use client";

import { MapPin, ArrowRight, Bed, Map, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Flat } from "@/lib/mockData";

interface FlatCardProps {
    flat: Flat;
    onShowOnMap?: () => void;
}

export function FlatCard({ flat, onShowOnMap }: FlatCardProps) {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/stays/${flat.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
        >
            {/* Image */}
            <div className="relative h-52 w-full overflow-hidden">
                <Image
                    src={flat.images[0]}
                    alt={flat.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Type badge */}
                <div className="absolute top-4 left-4 bg-brand-black/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Bed className="w-3 h-3" />
                    {flat.type}
                </div>

                {/* Price overlay */}
                <div className="absolute bottom-4 left-4">
                    <span className="bg-white text-brand-black font-black text-base px-3 py-1 rounded-full shadow-lg">
                        ₹{flat.price.toLocaleString()}<span className="font-medium text-xs text-slate-500">/mo</span>
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-3">
                    <h3 className="text-lg font-bold text-brand-black group-hover:text-brand-purple transition-colors line-clamp-1">
                        {flat.title}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-500 text-sm mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{flat.location}</span>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {flat.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-brand-offwhite text-slate-600 border border-slate-200 font-medium">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Interested people */}
                {flat.lobby.length > 0 && (
                    <div className="flex items-center gap-2 mb-4 p-3 rounded-2xl bg-purple-50 border border-purple-100">
                        <Users className="w-4 h-4 text-brand-purple shrink-0" />
                        <span className="text-xs font-semibold text-brand-purple">
                            {flat.lobby.length} {flat.lobby.length === 1 ? "person" : "people"} interested
                        </span>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2">
                    {onShowOnMap && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onShowOnMap(); }}
                            className="px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-600 bg-brand-offwhite hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5"
                        >
                            <Map className="w-3.5 h-3.5" /> Map
                        </button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/stays/${flat.id}`); }}
                        className="flex-1 px-4 py-2.5 rounded-2xl text-sm font-bold text-white bg-brand-black hover:bg-brand-purple transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        View Details <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
