
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Users, Wifi, Wind, Shield, Coffee, ArrowLeft, Share2, Heart, Lock, Unlock, LucideIcon, Zap, MessageCircle, UserPlus } from "lucide-react";
import { FLATS } from "@/lib/mockData";
import { GlassCard } from "@/components/ui/glass-card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const MiniMap = dynamic(() => import("@/components/map/mini-map"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-2xl" />
});

const AMENITY_ICONS: Record<string, LucideIcon> = {
    "Wi-Fi": Wifi,
    "AC": Wind,
    "Power Backup": Zap,
    "Security": Shield,
    "Food": Coffee,
};

export default function FlatDetailsPage() {
    const { id } = useParams();
    const router = useRouter();

    const [isInterested, setIsInterested] = useState(false);

    // Derived state (no useEffect needed)
    const flat = FLATS.find((f) => f.id === Number(id));

    if (!flat) return <div className="min-h-screen flex items-center justify-center">Flat not found</div>;

    const handleToggleInterest = () => {
        if (isInterested) {
            setIsInterested(false);
            toast.info("Removed from list", { description: "You are no longer on the interested list." });
        } else {
            setIsInterested(true);
            toast.success("You're on the list!", { description: "You can now connect with others." });
        }
    };

    return (
        <div className="container mx-auto px-4 pb-20">
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Stays
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Col: Images */}
                <div className="space-y-4">
                    <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-lg">
                        <Image
                            src={flat.images[0]}
                            alt={flat.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button className="p-2 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition-colors">
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    {flat.images.length > 1 && (
                        <div className="grid grid-cols-3 gap-4">
                            {flat.images.slice(1).map((img, i) => (
                                <div key={i} className="relative h-24 rounded-xl overflow-hidden cursor-pointer">
                                    <Image src={img} alt="Gallery" fill className="object-cover hover:scale-110 transition-transform" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Col: Details */}
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h1 className="text-3xl font-bold text-slate-900">{flat.title}</h1>
                            <span className="text-2xl font-bold text-slate-900">₹{flat.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 mb-4">
                            <MapPin className="w-4 h-4" />
                            {flat.location} • {flat.distanceToCampus} from campus
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {flat.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">About this place</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            {flat.description}
                        </p>

                        <h4 className="font-bold text-slate-900 mb-3">Amenities</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {flat.amenities?.map(amenity => {
                                const Icon = AMENITY_ICONS[amenity] || Shield;
                                return (
                                    <div key={amenity} className="flex items-center gap-2 text-slate-600 text-sm">
                                        <Icon className="w-4 h-4 text-slate-400" />
                                        {amenity}
                                    </div>
                                )
                            })}
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-600" /> Interested People
                            </h3>
                            <span className="text-sm font-medium text-slate-500">{flat.lobby.length} Interested</span>
                        </div>

                        <div className="relative">
                            <div className={cn("space-y-4 transition-all duration-500", !isInterested && "blur-md opacity-50 pointer-events-none select-none")}>
                                {flat.lobby.map(member => (
                                    <div key={member.id} className="flex items-center justify-between bg-white/60 p-3 rounded-xl shadow-sm border border-white/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-700">
                                                {member.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{member.name}</p>
                                                <p className="text-xs text-slate-500">{member.tags[0]} • {member.tags[1]}</p>
                                            </div>
                                        </div>

                                        <button className="px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-bold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1.5 shadow-sm">
                                            <MessageCircle className="w-3.5 h-3.5 text-purple-600" /> Chat
                                        </button>
                                    </div>
                                ))}
                                {flat.lobby.length === 0 && <p className="text-sm text-slate-500 italic">No one has shown interest yet.</p>}

                                {isInterested && (
                                    <div className="pt-4 flex justify-center">
                                        <button
                                            onClick={handleToggleInterest}
                                            className="text-xs text-slate-400 hover:text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors"
                                        >
                                            No longer interested? Leave list
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!isInterested && (
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <button
                                        onClick={handleToggleInterest}
                                        className="px-6 py-3 rounded-full bg-slate-900 text-white font-bold shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 animate-in fade-in zoom-in duration-300"
                                    >
                                        <UserPlus className="w-5 h-5" /> I'm Interested
                                    </button>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
