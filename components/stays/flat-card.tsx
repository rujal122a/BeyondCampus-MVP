"use client";

import { Users, Bed, Lock, Unlock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LobbyMember } from "@/lib/mockData";

interface FlatProps {
    flat: {
        id: number;
        title: string;
        location: string;
        price: number;
        type: string;
        images: string[]; // Keep as array for future carousel
        tags: string[];
        lobby: LobbyMember[];
        isLocked: boolean;
    };
}

export function FlatCard({ flat }: FlatProps) {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/stays/${flat.id}`);
    };

    const handleJoinClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation
        if (flat.isLocked) {
            toast.error("Lobby is full!");
        } else {
            toast.success("Joined Lobby!", { description: `You have drafted into ${flat.title}` });
        }
    };

    return (
        <GlassCard
            className="p-0 overflow-hidden flex flex-col h-full group cursor-pointer hover:border-aurora-purple/50 transition-colors"
            onClick={handleCardClick}
        >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={flat.images[0]}
                    alt={flat.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Bed className="w-3 h-3" />
                    {flat.type}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-aurora-purple transition-colors">{flat.title}</h3>
                        <p className="text-sm text-slate-500">{flat.location}</p>
                    </div>
                    <div className="text-right">
                        <span className="block text-lg font-bold text-slate-900">₹{flat.price.toLocaleString()}</span>
                        <span className="text-xs text-slate-500">/ person</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {flat.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Live Lobby Section */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Users className="w-3 h-3" /> Live Lobby ({flat.lobby.length}/4)
                        </span>
                        {flat.isLocked ? (
                            <span className="text-xs text-red-500 flex items-center gap-1"><Lock className="w-3 h-3" /> Full</span>
                        ) : (
                            <span className="text-xs text-green-500 flex items-center gap-1"><Unlock className="w-3 h-3" /> Joining...</span>
                        )}
                    </div>

                    <div className="flex -space-x-2 overflow-hidden mb-4 pl-1">
                        {flat.lobby.map((member) => (
                            <div key={member.id} className="relative group/avatar cursor-help">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aurora-purple to-aurora-blue p-[2px] ring-2 ring-white">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-slate-700">
                                        {member.avatar}
                                    </div>
                                </div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none z-10">
                                    {member.name} • {member.tags[0]}
                                </div>
                            </div>
                        ))}
                        {!flat.isLocked && (
                            <button className="w-8 h-8 rounded-full bg-slate-100 ring-2 ring-white flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                                +
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleJoinClick}
                        className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-900/20"
                    >
                        Join Lobby
                    </button>
                </div>
            </div>
        </GlassCard>
    );
}
