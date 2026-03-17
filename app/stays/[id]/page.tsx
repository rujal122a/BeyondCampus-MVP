"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { MapPin, Bed, Tag, ShieldAlert, Phone, ArrowLeft, Loader2, IndianRupee, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/map/map-view"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-2xl"></div>
});

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200";

interface ListingDetail {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    type: string;
    images: string[];
    amenities: string[];
    houseRules: string[];
    distanceToCampus: string;
    owner: {
        id: string;
        full_name: string;
        avatar_url: string;
        role: string;
    } | null;
}

export default function ListingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    
    const [listing, setListing] = useState<ListingDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        async function fetchListingDetails() {
            if (!params.id) return;

            try {
                // Fetch listing
                const { data: listingData, error: listingError } = await supabase
                    .from('listings')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (listingError || !listingData) throw listingError || new Error("Listing not found");

                // Fetch owner profile
                let ownerProfile = null;
                const { data: ownerData } = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url, role')
                    .eq('id', listingData.lister_id)
                    .single();
                
                if (ownerData) {
                    ownerProfile = ownerData;
                }

                setListing({
                    id: listingData.id,
                    title: listingData.title,
                    description: listingData.description,
                    location: listingData.location,
                    price: listingData.rent_price || 0,
                    type: listingData.type || "2BHK",
                    images: listingData.image_urls && listingData.image_urls.length > 0 ? listingData.image_urls : [FALLBACK_IMAGE],
                    amenities: listingData.amenities || [],
                    houseRules: listingData.house_rules || [],
                    distanceToCampus: listingData.distance_from_campus || "N/A",
                    owner: ownerProfile
                });

            } catch (error) {
                console.error("Error fetching listing details:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchListingDetails();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Listing not found</h1>
                    <p className="text-slate-500 mb-6">This property may have been removed or is no longer available.</p>
                    <button onClick={() => router.push('/stays')} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition w-full">
                        Back to Stays
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 pb-20">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors mb-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to listings
                </button>

                {/* Hero / Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">{listing.title}</h1>
                        <div className="flex items-center gap-2 text-slate-500 font-medium text-lg">
                            <MapPin className="w-5 h-5" /> {listing.location} 
                            <span className="text-slate-300">•</span>
                            <span>{listing.distanceToCampus} from campus</span>
                        </div>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-end shrink-0">
                        <div className="text-4xl font-black text-indigo-600 tracking-tight">
                            ₹{listing.price.toLocaleString()}
                            <span className="text-lg text-slate-500 font-semibold align-baseline">/mo</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 shadow-sm rounded-full text-sm font-bold mt-2 text-slate-700">
                            <Bed className="w-4 h-4 text-slate-400" /> {listing.type}
                        </div>
                    </motion.div>
                </div>

                {/* Image Gallery */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px]">
                    <div className="md:col-span-3 bg-slate-200 rounded-3xl overflow-hidden relative group shadow-sm border border-slate-200">
                        <img 
                            src={listing.images[activeImageIndex]} 
                            alt="Property" 
                            className="w-full h-full object-cover transition-opacity duration-300" 
                        />
                        {listing.images.length > 1 && (
                            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                                <ImageIcon className="w-3.5 h-3.5" /> {activeImageIndex + 1}/{listing.images.length}
                            </div>
                        )}
                    </div>
                    <div className="hidden md:flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar">
                        {listing.images.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setActiveImageIndex(idx)}
                                className={`w-full h-32 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${activeImageIndex === idx ? 'border-indigo-600 scale-[1.02] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                            >
                                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Mobile Thumbnails */}
                {listing.images.length > 1 && (
                    <div className="flex md:hidden gap-3 overflow-x-auto pb-2 snap-x">
                        {listing.images.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setActiveImageIndex(idx)}
                                className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 snap-center ${activeImageIndex === idx ? 'border-indigo-600' : 'border-transparent opacity-70'}`}
                            >
                                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">About this place</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
                        </div>

                        {listing.amenities.length > 0 && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-indigo-500" /> Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                                    {listing.amenities.map(amenity => (
                                        <div key={amenity} className="flex items-center gap-2 text-slate-700 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            {amenity}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {listing.houseRules.length > 0 && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-orange-500" /> House Rules</h2>
                                <ul className="space-y-3">
                                    {listing.houseRules.map(rule => (
                                        <li key={rule} className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {/* Map Area placeholder */}
                        <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200 h-[300px]">
                            <MapView type="stays" />
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 sticky top-28">
                            
                            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Listed By</h3>
                            
                            {listing.owner ? (
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                                    <img src={listing.owner.avatar_url || "https://avatar.vercel.sh/student"} alt={listing.owner.full_name} className="w-14 h-14 rounded-full border-2 border-indigo-100 object-cover" />
                                    <div>
                                        <div className="font-bold text-slate-900">{listing.owner.full_name}</div>
                                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 inline-block px-2 py-0.5 rounded-full mt-1">Verified Owner</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                                    <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200"></div>
                                    <div>
                                        <div className="font-bold text-slate-900">Anonymous Owner</div>
                                        <div className="text-xs text-slate-500">Member</div>
                                    </div>
                                </div>
                            )}

                            {user ? (
                                <button className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 active:scale-95">
                                    <Phone className="w-5 h-5"/> Contact Owner
                                </button>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm font-medium text-slate-500 mb-3">Please sign in to contact the owner directly.</p>
                                    <Link href="/login">
                                        <button className="w-full py-3 rounded-xl bg-slate-100 text-slate-900 font-bold hover:bg-slate-200 transition">
                                            Log in to Connect
                                        </button>
                                    </Link>
                                </div>
                            )}
                            
                            <p className="text-xs text-center text-slate-400 mt-4 font-medium flex items-center justify-center gap-1.5">
                                <ShieldAlert className="w-3.5 h-3.5" /> Ensure you physically verify the property before making any payments.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
