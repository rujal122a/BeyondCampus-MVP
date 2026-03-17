"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import { Loader2, User, Home, Plus, MapPin, Edit3 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Profile {
    full_name: string;
    avatar_url: string;
    role: "seeker" | "lister" | "both";
    budget: number | null;
    lifestyle_tags: string[];
    major: string;
    graduation_year: number | null;
    bio: string;
}

interface ListingPreview {
    id: string;
    title: string;
    price: number;
    location: string;
    image_url: string;
}

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [listings, setListings] = useState<ListingPreview[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            if (!user) return;
            try {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;
                setProfile(profileData);

                if (profileData && (profileData.role === 'lister' || profileData.role === 'both')) {
                    const { data: listingData, error: listingError } = await supabase
                        .from('listings')
                        .select('id, title, price, location, images')
                        .eq('owner_id', user.id);

                    if (!listingError && listingData) {
                        setListings(listingData.map((l: any) => ({
                            id: l.id,
                            title: l.title,
                            price: l.price,
                            location: l.location,
                            image_url: l.images && l.images.length > 0 ? l.images[0] : ''
                        })));
                    }
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchDashboardData();
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-offwhite">
                <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-brand-offwhite pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <span className="badge bg-purple-50 text-brand-purple border-purple-200 mb-3 inline-flex">
                                👋 Your Account
                            </span>
                            <h1 className="text-4xl font-black text-brand-black tracking-tight mt-2">Dashboard</h1>
                            <p className="text-slate-500 font-medium mt-1">Manage your profile and properties.</p>
                        </motion.div>

                        {(profile?.role === 'lister' || profile?.role === 'both') && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <Link href="/list-your-property">
                                    <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-black text-white font-bold hover:opacity-80 transition shadow-lg shadow-black/10">
                                        <Plus className="w-4 h-4" /> New Listing
                                    </button>
                                </Link>
                            </motion.div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white rounded-4xl overflow-hidden border border-slate-100 shadow-sm h-fit"
                        >
                            {/* Purple header band */}
                            <div className="h-24 grain" style={{ background: "linear-gradient(135deg, #3D4ADB 0%, #5B6AFF 100%)" }} />

                            <div className="px-8 pb-8">
                                {/* Avatar */}
                                <div className="relative -mt-12 mb-5">
                                    <div className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl bg-slate-100 overflow-hidden">
                                        {profile?.avatar_url ? (
                                            <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-10 h-10 text-slate-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <h2 className="text-xl font-black text-brand-black">{profile?.full_name || "User"}</h2>
                                <span className="inline-block mt-1 mb-6 px-3 py-1 bg-purple-50 text-brand-purple text-xs font-bold rounded-full uppercase tracking-wider">
                                    {profile?.role === 'both' ? 'Seeker & Lister' : profile?.role}
                                </span>

                                <div className="space-y-3 mb-6">
                                    {profile?.major && (
                                        <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                                            <span className="text-slate-400 font-medium text-sm">Studies</span>
                                            <span className="text-brand-black font-bold text-sm">{profile.major} '{profile.graduation_year?.toString().slice(-2)}</span>
                                        </div>
                                    )}
                                    {profile?.budget && profile.role !== 'lister' && (
                                        <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                                            <span className="text-slate-400 font-medium text-sm">Budget</span>
                                            <span className="text-brand-black font-bold text-sm">₹{profile.budget.toLocaleString()}/mo</span>
                                        </div>
                                    )}
                                </div>

                                {profile?.lifestyle_tags && profile.lifestyle_tags.length > 0 && (
                                    <div className="mb-6">
                                        <span className="text-slate-400 font-medium text-xs uppercase tracking-wider block mb-2.5">Vibe</span>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.lifestyle_tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-brand-offwhite text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {profile?.bio && (
                                    <blockquote className="bg-brand-offwhite rounded-2xl p-4 border-l-2 border-brand-purple mb-6">
                                        <p className="text-slate-600 text-sm leading-relaxed italic">"{profile.bio}"</p>
                                    </blockquote>
                                )}

                                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-brand-offwhite transition-colors text-sm">
                                    <Edit3 className="w-4 h-4" /> Edit Profile
                                </button>
                            </div>
                        </motion.div>

                        {/* Content Area */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* My Properties */}
                            {(profile?.role === 'lister' || profile?.role === 'both') && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-black text-brand-black flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-brand-purple flex items-center justify-center">
                                                <Home className="w-4 h-4 text-white" />
                                            </div>
                                            My Properties
                                        </h3>
                                        <span className="bg-purple-50 text-brand-purple px-3 py-1 rounded-full text-xs font-bold">
                                            {listings.length} Active
                                        </span>
                                    </div>

                                    {listings.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {listings.map(listing => (
                                                <Link href={`/stays/${listing.id}`} key={listing.id}
                                                    className="group rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all bg-brand-offwhite block"
                                                >
                                                    <div className="h-36 bg-slate-200 relative overflow-hidden">
                                                        {listing.image_url ? (
                                                            <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Home className="w-8 h-8 text-slate-300" />
                                                            </div>
                                                        )}
                                                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-black text-brand-black shadow-sm">
                                                            ₹{listing.price?.toLocaleString()}/mo
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-white">
                                                        <h4 className="font-bold text-brand-black truncate group-hover:text-brand-purple transition-colors">{listing.title}</h4>
                                                        <div className="flex items-center gap-1 text-slate-400 text-xs mt-1 font-medium">
                                                            <MapPin className="w-3 h-3" />
                                                            <span className="truncate">{listing.location}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 px-4 rounded-3xl border-2 border-dashed border-slate-200 bg-brand-offwhite">
                                            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                                <Home className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-500 font-medium mb-4">No properties listed yet.</p>
                                            <Link href="/list-your-property">
                                                <button className="px-6 py-2.5 rounded-full bg-brand-black text-white font-bold text-sm hover:opacity-80 transition">
                                                    Create first listing
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Saved Properties */}
                            {profile?.role !== 'lister' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.35 }}
                                    className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm"
                                >
                                    <h3 className="text-xl font-black text-brand-black flex items-center gap-2.5 mb-6">
                                        <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-orange-500" />
                                        </div>
                                        Saved Properties
                                    </h3>
                                    <div className="text-center py-12 px-4 rounded-3xl border-2 border-dashed border-slate-200 bg-brand-offwhite">
                                        <p className="text-slate-500 font-medium mb-4">No saved properties yet.</p>
                                        <Link href="/stays">
                                            <button className="px-6 py-2.5 rounded-full bg-brand-black text-white font-bold text-sm hover:opacity-80 transition">
                                                Explore Stays
                                            </button>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
