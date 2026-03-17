"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, ArrowLeft, Image as ImageIcon, CheckCircle2, Home, MapPin, IndianRupee, Tag, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface ListingData {
    title: string;
    location: string;
    price: string;
    type: "1BHK" | "2BHK" | "3BHK" | "4BHK" | "PG DBL" | "PG SGL";
    description: string;
    distanceToCampus: string;
}

const COMMON_AMENITIES = ["Wi-Fi", "AC", "Geyser", "RO Water", "Power Backup", "Washing Machine", "Fridge", "Parking", "Lift", "Security Guard", "Gym"];
const COMMON_RULES = ["No Smoking", "No Pets", "No loud music after 11 PM", "Vegetarian only", "Girls only", "Boys only", "Family only"];

const STEPS_META = [
    { title: "Basic Details.", sub: "Let's start with the essentials." },
    { title: "The Experience.", sub: "What makes this place special?" },
    { title: "Show it off.", sub: "Add photos to attract the right people." },
];

export default function ListYourPropertyPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ListingData>({ title: "", location: "", price: "", type: "2BHK", description: "", distanceToCampus: "" });
    const [amenities, setAmenities] = useState<string[]>([]);
    const [houseRules, setHouseRules] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            if (imageFiles.length + filesArray.length > 5) { toast.error("Max 5 images."); return; }
            setImageFiles(prev => [...prev, ...filesArray]);
            setImagePreviews(prev => [...prev, ...filesArray.map(f => URL.createObjectURL(f))]);
        }
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => { const n = [...prev]; URL.revokeObjectURL(n[index]); n.splice(index, 1); return n; });
    };

    const toggle = (item: string, list: string[], setList: (v: string[]) => void) => {
        setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
    };

    const uploadImages = async (): Promise<string[]> => {
        if (!user || imageFiles.length === 0) return [];
        const urls: string[] = [];
        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            const fileName = `${user.id}-${Date.now()}-${i}.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage.from('listing-images').upload(fileName, file);
            if (error) { toast.error(`Failed to upload ${file.name}`); continue; }
            const { data } = supabase.storage.from('listing-images').getPublicUrl(fileName);
            urls.push(data.publicUrl);
        }
        return urls;
    };

    const handleSubmit = async () => {
        if (!user) return;
        setIsSubmitting(true);
        toast.info("Uploading images and publishing listing...");
        try {
            const imageUrls = await uploadImages();
            const { error } = await supabase.from('listings').insert([{
                lister_id: user.id, title: formData.title, location: formData.location,
                rent_price: parseInt(formData.price) || 0, type: formData.type, description: formData.description,
                distance_from_campus: formData.distanceToCampus, amenities, house_rules: houseRules,
                image_urls: imageUrls, is_active: true, coordinates: null
            }]);
            if (error) throw error;
            toast.success("Property listed successfully!");
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.message || "An error occurred.");
            setIsSubmitting(false);
        }
    };

    const validateStep = () => {
        if (step === 1 && (!formData.title.trim() || !formData.location.trim() || !formData.price || !formData.distanceToCampus)) {
            toast.error("Please fill in all basic details."); return false;
        }
        if (step === 2 && (!formData.description.trim() || amenities.length === 0)) {
            toast.error("Please provide a description and at least one amenity."); return false;
        }
        if (step === 3 && imageFiles.length === 0) {
            toast.error("Please upload at least one image."); return false;
        }
        return true;
    };

    const nextStep = () => { if (validateStep()) { if (step < 3) setStep(step + 1); else handleSubmit(); } };

    const inputClass = "w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 outline-none transition-all font-medium placeholder:text-slate-400";

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-brand-offwhite pb-20">
                {/* Progress Bar */}
                <div className="w-full h-1 bg-slate-200 fixed top-0 left-0 z-50">
                    <motion.div
                        className="h-full bg-brand-purple"
                        initial={{ width: "33%" }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                </div>

                <div className="max-w-2xl mx-auto px-4 py-12">
                    {/* Step indicators */}
                    <div className="flex items-center justify-center gap-2 mb-10">
                        {[1, 2, 3].map(s => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${s === step ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/30" : s < step ? "bg-brand-green text-brand-black" : "bg-slate-200 text-slate-400"}`}>
                                    {s < step ? "✓" : s}
                                </div>
                                {s < 3 && <div className={`w-12 h-0.5 rounded-full transition-all ${s < step ? "bg-brand-purple" : "bg-slate-200"}`} />}
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-black text-brand-black mb-2">
                            {STEPS_META[step - 1].title}
                        </h1>
                        <p className="text-slate-500 font-medium">{STEPS_META[step - 1].sub}</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                                className="p-8 sm:p-10"
                            >
                                {/* STEP 1 */}
                                {step === 1 && (
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-brand-black flex items-center gap-2"><Home className="w-4 h-4 text-brand-purple" /> Property Title</label>
                                            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputClass} placeholder="e.g. Spacious 3BHK near WCE Gate" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-brand-black flex items-center gap-2"><Tag className="w-4 h-4 text-brand-purple" /> Property Type</label>
                                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-brand-purple outline-none font-medium">
                                                    {["1BHK", "2BHK", "3BHK", "4BHK", "PG SGL", "PG DBL"].map(t => <option key={t} value={t}>{t.replace("PG SGL", "PG (Single)").replace("PG DBL", "PG (Double)")}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-brand-black flex items-center gap-2"><IndianRupee className="w-4 h-4 text-brand-purple" /> Monthly Rent</label>
                                                <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className={inputClass} placeholder="e.g. 5000" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-brand-black flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-purple" /> Location / Area</label>
                                            <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className={inputClass} placeholder="e.g. Vishrambag, near D-Mart" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-brand-black">Distance to Campus</label>
                                            <input type="text" value={formData.distanceToCampus} onChange={e => setFormData({ ...formData, distanceToCampus: e.target.value })} className={inputClass} placeholder="e.g. 500m or 5 min walk" />
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2 */}
                                {step === 2 && (
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-brand-black">Description</label>
                                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 outline-none transition-all font-medium resize-none min-h-[120px] placeholder:text-slate-400"
                                                placeholder="Describe the property, neighborhood, and vibe..." />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-brand-black">Amenities</label>
                                            <div className="flex flex-wrap gap-2">
                                                {COMMON_AMENITIES.map(a => (
                                                    <button key={a} onClick={() => toggle(a, amenities, setAmenities)}
                                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${amenities.includes(a) ? "bg-brand-purple text-white shadow-md shadow-brand-purple/25" : "bg-brand-offwhite text-slate-600 border border-slate-200 hover:border-brand-purple hover:text-brand-purple"}`}>
                                                        {a}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-brand-black flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-orange-500" /> House Rules</label>
                                            <div className="flex flex-wrap gap-2">
                                                {COMMON_RULES.map(r => (
                                                    <button key={r} onClick={() => toggle(r, houseRules, setHouseRules)}
                                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${houseRules.includes(r) ? "bg-orange-500 text-white shadow-md shadow-orange-500/25" : "bg-brand-offwhite text-slate-600 border border-slate-200 hover:border-orange-400 hover:text-orange-600"}`}>
                                                        {r}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3 */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div onClick={() => fileInputRef.current?.click()}
                                            className="w-full h-48 border-2 border-dashed border-brand-purple/30 bg-purple-50/50 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 hover:border-brand-purple transition-all group">
                                            <ImageIcon className="w-10 h-10 text-brand-purple/50 group-hover:text-brand-purple transition-colors mb-3" />
                                            <p className="font-bold text-brand-purple">Click to upload photos</p>
                                            <p className="text-sm font-medium text-brand-purple/50 mt-1">PNG, JPG up to 5MB (Max 5)</p>
                                            <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
                                        </div>
                                        {imagePreviews.length > 0 && (
                                            <div className="space-y-3">
                                                <label className="text-sm font-bold text-brand-black">Uploaded Photos ({imagePreviews.length}/5)</label>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                    {imagePreviews.map((preview, index) => (
                                                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group shadow-sm">
                                                            <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                            <button onClick={() => removeImage(index)}
                                                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Footer Actions */}
                        <div className="bg-brand-offwhite px-8 sm:px-10 py-5 border-t border-slate-100 flex items-center justify-between">
                            <button
                                onClick={() => setStep(step - 1)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${step === 1 ? "opacity-0 pointer-events-none" : "text-slate-500 hover:bg-slate-200 hover:text-slate-900"}`}
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-3 rounded-full font-bold bg-brand-black text-white hover:opacity-80 transition shadow-lg shadow-black/10 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                ) : step === 3 ? (
                                    <><CheckCircle2 className="w-4 h-4" /> Publish Listing</>
                                ) : (
                                    <>Continue <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
