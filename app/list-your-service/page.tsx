"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, ArrowLeft, ImagePlus, UtensilsCrossed, CheckCircle2, DollarSign, ChefHat, Info, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

interface ServiceData {
    name: string;
    description: string;
    cuisine: string;
    pricePerMonth: string; // Keep as string for input, parse to number on submit
    deliveryTime: string;
    todayMenu: string[];
}

export default function ListYourServicePage() {
    const router = useRouter();
    const { user } = useAuthStore();
    
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form Data
    const [formData, setFormData] = useState<ServiceData>({
        name: "",
        description: "",
        cuisine: "",
        pricePerMonth: "",
        deliveryTime: "12:30 PM - 1:30 PM",
        todayMenu: [],
    });
    
    const [menuItemInput, setMenuItemInput] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // If not logged in, show auth wall
    if (user === undefined) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
    if (user === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
                    <ChefHat className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Login Required</h1>
                    <p className="text-slate-500 mb-6">You need to be logged in to list a mess or tiffin service.</p>
                    <button onClick={() => router.push('/login')} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition w-full">
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddMenuItem = () => {
        if (menuItemInput.trim()) {
            setFormData({ ...formData, todayMenu: [...formData.todayMenu, menuItemInput.trim()] });
            setMenuItemInput("");
        }
    };

    const handleRemoveMenuItem = (index: number) => {
        const newMenu = [...formData.todayMenu];
        newMenu.splice(index, 1);
        setFormData({ ...formData, todayMenu: newMenu });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const checkStepValidity = () => {
        switch (step) {
            case 1:
                if (!formData.name || !formData.cuisine || !formData.description) {
                    toast.error("Please fill all required fields before proceeding.");
                    return false;
                }
                return true;
            case 2:
                if (!formData.pricePerMonth || formData.todayMenu.length === 0) {
                    toast.error("Please add a price and at least one menu item.");
                    return false;
                }
                return true;
            case 3:
                if (!imageFile) {
                    toast.error("Please upload a banner image for your service.");
                    return false;
                }
                return true;
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (checkStepValidity()) setStep((s) => s + 1);
    };

    const prevStep = () => setStep((s) => Math.max(1, s - 1));

    const handleSubmit = async () => {
        if (!checkStepValidity() || !user) return;
        
        setIsSubmitting(true);
        toast.loading("Setting up your kitchen...", { id: "submit-service" });

        try {
            // 1. Upload Image
            let imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800"; // fallback
            
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                const filePath = `mess-banners/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('listing-images')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('listing-images')
                    .getPublicUrl(filePath);

                if (publicUrlData) imageUrl = publicUrlData.publicUrl;
            }

            // 2. Insert into DB
            const payload = {
                vendor_id: user.id,
                name: formData.name,
                description: formData.description,
                cuisine: formData.cuisine,
                price_per_month: Number(formData.pricePerMonth),
                delivery_time: formData.deliveryTime,
                today_menu: formData.todayMenu,
                image_url: imageUrl,
                rating: 5.0, // Initial perfect rating
            };

            const { error: insertError } = await supabase
                .from('mess_services')
                .insert([payload]);

            if (insertError) throw insertError;

            toast.success("Service created successfully!", { id: "submit-service" });
            router.push('/eats');

        } catch (error: any) {
            console.error("Submission error:", error);
            toast.error(error.message || "Failed to create service.", { id: "submit-service" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Step UI Renderers
    const renderStep1 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChefHat className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Basic Details</h2>
                <p className="text-slate-500">Tell us about your mess or tiffin service.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Service Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Annapurna Home Foods"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Cuisine Type / Speciality *</label>
                    <input
                        type="text"
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleInputChange}
                        placeholder="e.g. Pure Veg Maharashtrian, North Indian Thali"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Tell students what makes your food special..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                </div>
            </div>
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UtensilsCrossed className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Pricing & Menu</h2>
                <p className="text-slate-500">Set your monthly rates and sample menu items.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Subscription Price (₹) *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <DollarSign className="w-5 h-5 text-slate-400" />
                        </div>
                        <input
                            type="number"
                            name="pricePerMonth"
                            value={formData.pricePerMonth}
                            onChange={handleInputChange}
                            placeholder="2500"
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-bold text-lg"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Timings (e.g., Lunch hours)</label>
                    <input
                        type="text"
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleInputChange}
                        placeholder="12:30 PM - 2:00 PM"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Sample Menu Items (Add at least 1) *</label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={menuItemInput}
                            onChange={(e) => setMenuItemInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMenuItem())}
                            placeholder="e.g. Paneer Butter Masala"
                            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        />
                        <button
                            type="button"
                            onClick={handleAddMenuItem}
                            className="px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition flex items-center justify-center font-bold"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    {formData.todayMenu.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                            {formData.todayMenu.map((item, index) => (
                                <div key={index} className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-sm font-medium text-slate-700 shadow-sm animate-in fade-in scale-in duration-200">
                                    <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />
                                    {item}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveMenuItem(index)}
                                        className="ml-1 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImagePlus className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Cover Photo</h2>
                <p className="text-slate-500">Upload an appetizing photo of your thali or mess setup.</p>
            </div>

            <div className="space-y-4">
                <label className="block w-full cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 rounded-2xl group outline-none">
                    <div className={cn(
                        "relative w-full h-64 border-2 border-dashed rounded-2xl overflow-hidden transition-all flex flex-col items-center justify-center gap-2",
                        imagePreview ? "border-transparent bg-slate-900" : "border-slate-300 bg-slate-50 hover:bg-slate-100 group-hover:border-blue-400"
                    )}>
                        <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                        />

                        {imagePreview ? (
                            <>
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-cover opacity-60"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/90 backdrop-blur text-slate-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition">
                                        <ImagePlus className="w-5 h-5" /> Change Photo
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-500 mb-2 group-hover:scale-110 transition-transform">
                                    <ImagePlus className="w-8 h-8" />
                                </div>
                                <span className="text-sm font-bold text-slate-700">Click to upload photo</span>
                                <span className="text-xs text-slate-400">JPG, PNG up to 5MB</span>
                            </>
                        )}
                    </div>
                </label>
                
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mt-4">
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                        High-quality images significantly increase the chances of students subscribing to your mess. Show them your best dish!
                    </p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
            <div className="max-w-xl w-full">
                {/* Progress Indicators */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300",
                                    step === s ? "bg-orange-600 text-white shadow-md shadow-orange-600/20" :
                                    step > s ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"
                                )}>
                                    {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                                </div>
                                {s !== 3 && (
                                    <div className={cn(
                                        "w-8 h-1 rounded-full transition-colors duration-300",
                                        step > s ? "bg-slate-900" : "bg-slate-200"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {step === 1 && <div key="step1">{renderStep1()}</div>}
                        {step === 2 && <div key="step2">{renderStep2()}</div>}
                        {step === 3 && <div key="step3">{renderStep3()}</div>}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
                        <button
                            onClick={prevStep}
                            disabled={step === 1 || isSubmitting}
                            className={cn(
                                "px-6 py-3 rounded-xl font-bold transition flex items-center gap-2",
                                step === 1 ? "opacity-0 cursor-default" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            )}
                        >
                            <ArrowLeft className="w-5 h-5" /> Back
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={nextStep}
                                className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-600/20 flex items-center gap-2"
                            >
                                Next <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-xl shadow-slate-900/20 flex items-center gap-2 disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</>
                                ) : (
                                    <><CheckCircle2 className="w-5 h-5" /> Publish Service</>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
