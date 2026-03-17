"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { MapPin, UtensilsCrossed, Star, Clock, Phone, ArrowLeft, Loader2, CheckCircle2, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { GlassCard } from "@/components/ui/glass-card";

const MapView = dynamic(() => import("@/components/map/map-view"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-2xl"></div>
});

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800";

interface ServiceDetail {
    id: string;
    name: string;
    description: string;
    cuisine: string;
    price: number;
    deliveryTime: string;
    todayMenu: string[];
    image: string;
    rating: number;
    vendor: {
        id: string;
        full_name: string;
        avatar_url: string;
    } | null;
}

export default function ServiceDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    
    const [service, setService] = useState<ServiceDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchServiceDetails() {
            if (!params.id) return;

            try {
                // Fetch service
                const { data: serviceData, error: serviceError } = await supabase
                    .from('mess_services')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (serviceError || !serviceData) throw serviceError || new Error("Service not found");

                // Fetch vendor profile
                let vendorProfile = null;
                const { data: vendorData } = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url')
                    .eq('id', serviceData.vendor_id)
                    .single();
                
                if (vendorData) {
                    vendorProfile = vendorData;
                }

                setService({
                    id: serviceData.id,
                    name: serviceData.name,
                    description: serviceData.description,
                    cuisine: serviceData.cuisine,
                    price: serviceData.price_per_month,
                    deliveryTime: serviceData.delivery_time || "12:00 PM - 2:00 PM",
                    todayMenu: serviceData.today_menu || [],
                    image: serviceData.image_url || FALLBACK_IMAGE,
                    rating: serviceData.rating || 4.5,
                    vendor: vendorProfile
                });

            } catch (error) {
                console.error("Error fetching service details:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchServiceDetails();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
                    <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Service not found</h1>
                    <p className="text-slate-500 mb-6">This mess or tiffin service may have been removed or is currently unavailable.</p>
                    <button onClick={() => router.push('/eats')} className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition w-full">
                        Back to Eats
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 pb-20">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Back Navigation */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors mb-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Eats
                </button>

                {/* Banner Image */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative h-[300px] md:h-[400px] w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900">
                    <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold mb-3 shadow-md">
                                    <UtensilsCrossed className="w-3.5 h-3.5" /> {service.cuisine}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">{service.name}</h1>
                                <div className="flex items-center gap-4 text-white/90 font-medium text-sm md:text-base">
                                    <span className="flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded backdrop-blur text-yellow-300 font-bold">
                                        <Star className="w-4 h-4 fill-yellow-300" /> {service.rating} Rating
                                    </span>
                                </div>
                            </div>
                            
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shrink-0 mt-2 md:mt-0 text-white text-right">
                                <div className="text-sm font-medium text-white/70 mb-1">Monthly Subscription</div>
                                <div className="text-3xl font-black">
                                    ₹{service.price.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">About this Mess</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{service.description}</p>
                        </div>

                        {service.todayMenu.length > 0 && (
                            <GlassCard className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100 relative overflow-hidden">
                                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                                    <UtensilsCrossed className="w-5 h-5 text-orange-500" /> Today's Menu
                                </h2>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                                    {service.todayMenu.map((item, idx) => (
                                        <div key={idx} className="bg-white/80 backdrop-blur border border-white p-4 rounded-2xl flex items-center gap-3 shadow-sm">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                                            </div>
                                            <span className="font-bold text-slate-800">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        )}
                        
                        {/* Map Area placeholder */}
                        <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200 h-[300px]">
                            <MapView type="eats" />
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 sticky top-28">
                            
                            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Service Details</h3>
                            
                            <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                                <div className="flex items-center justify-between text-slate-600">
                                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> Timings</span>
                                    <span className="font-bold text-slate-900">{service.deliveryTime}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> Status</span>
                                    <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">Accepting Orders</span>
                                </div>
                            </div>

                            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Managed By</h3>
                            
                            {service.vendor ? (
                                <div className="flex items-center gap-4 mb-6">
                                    <img src={service.vendor.avatar_url || "https://avatar.vercel.sh/vendor"} alt={service.vendor.full_name} className="w-12 h-12 rounded-full ring-2 ring-orange-50 object-cover" />
                                    <div>
                                        <div className="font-bold text-slate-900">{service.vendor.full_name}</div>
                                        <div className="text-xs text-slate-500">Verified Vendor</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200"></div>
                                    <div>
                                        <div className="font-bold text-slate-900">Local Vendor</div>
                                        <div className="text-xs text-slate-500">Partner</div>
                                    </div>
                                </div>
                            )}

                            {user ? (
                                <div className="space-y-3">
                                    <button className="w-full py-4 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition shadow-xl shadow-orange-600/20 flex items-center justify-center gap-2 active:scale-95">
                                        Subscribe Now
                                    </button>
                                    <button className="w-full py-3 rounded-xl bg-slate-100 text-slate-900 font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2 active:scale-95">
                                        <Phone className="w-4 h-4"/> Contact Vendor
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm font-medium text-slate-500 mb-3">Please sign in to subscribe to this mess.</p>
                                    <Link href="/login">
                                        <button className="w-full py-3 rounded-xl bg-slate-100 text-slate-900 font-bold hover:bg-slate-200 transition">
                                            Log in to Connect
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
