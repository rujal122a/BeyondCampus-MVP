"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Image as ImageIcon, Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface OwnerOnboardingData {
    full_name: string;
    avatar_url: string;
    bio: string;
}

export default function OwnerOnboardingPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuthStore();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push('/login');
        }
    }, [isAuthLoading, user, router]);

    // Avatar state
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<OwnerOnboardingData>({
        full_name: "",
        avatar_url: "",
        bio: ""
    });

    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const uploadAvatar = async (): Promise<string | null> => {
        if (!avatarFile || !user) return formData.avatar_url;

        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        setIsUploading(true);
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile);

        setIsUploading(false);

        if (uploadError) {
            toast.error('Error uploading avatar');
            console.error(uploadError);
            return null;
        }

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleSubmit = async () => {
        if (!user) return;
        setIsSubmitting(true);

        try {
            let finalAvatarUrl = formData.avatar_url;
            if (avatarFile) {
                const uploadedUrl = await uploadAvatar();
                if (uploadedUrl) finalAvatarUrl = uploadedUrl;
            }

            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                full_name: formData.full_name,
                avatar_url: finalAvatarUrl,
                role: "lister",
                major: null,
                graduation_year: null,
                budget: null,
                lifestyle_tags: [],
                bio: formData.bio || null
            });

            if (error) throw error;

            toast.success('Owner profile created successfully!');
            router.push('/dashboard');

        } catch (error: any) {
            toast.error(error.message || 'Error saving profile');
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (step === 1 && !formData.full_name.trim()) {
            toast.error('Please enter your full name');
            return;
        }
        if (step < 2) setStep(step + 1);
        else handleSubmit();
    };

    if (isAuthLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="w-full h-1 bg-slate-200 fixed top-0 left-0 z-50">
                <motion.div
                    className="h-full bg-brand-purple"
                    initial={{ width: "50%" }}
                    animate={{ width: `${(step / 2) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            <div className="flex-1 flex items-center justify-center p-4 py-12">
                <div className="w-full max-w-xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            {step === 1 && "Owner Profile Setup"}
                            {step === 2 && "A bit about yourself"}
                        </h1>
                        <p className="text-slate-500 text-lg font-medium">
                            {step === 1 && "Let's list your details"}
                            {step === 2 && "Introduce yourself to students"}
                        </p>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="p-8 sm:p-10"
                            >
                                {/* STEP 1 */}
                                {step === 1 && (
                                    <div className="space-y-8">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                                <div className="w-32 h-32 rounded-full border-4 border-slate-50 overflow-hidden bg-slate-100 flex items-center justify-center shadow-lg relative">
                                                    {avatarPreview ? (
                                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-10 h-10 text-slate-400" />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Camera className="w-8 h-8 text-white" />
                                                    </div>
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleAvatarSelect}
                                                />
                                                <p className="mt-3 text-sm font-medium text-slate-500 hover:text-brand-purple transition-colors">
                                                    Upload Photo
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-700">Full Name / Business Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.full_name}
                                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 outline-none transition-all text-lg font-medium"
                                                placeholder="e.g. BeyondCampus Stays"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2 */}
                                {step === 2 && (
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-700">Bio / Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                                            <textarea
                                                value={formData.bio}
                                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 outline-none transition-all font-medium resize-none"
                                                placeholder="Briefly describe what makes your stays or services great..."
                                                rows={5}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="p-8 sm:p-10 pt-0 flex items-center justify-between border-t border-slate-50 mt-auto">
                            <button
                                onClick={() => step === 1 ? router.push('/onboarding') : setStep(step - 1)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-900`}
                            >
                                <ArrowLeft className="w-5 h-5" /> Back
                            </button>

                            <button
                                onClick={nextStep}
                                disabled={isSubmitting || isUploading}
                                className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-brand-black text-white hover:bg-[#2a2d42] transition-all shadow-lg shadow-brand-black/20 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                            >
                                {isSubmitting || isUploading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : step === 2 ? (
                                    <><CheckCircle2 className="w-5 h-5" /> Complete Profile</>
                                ) : (
                                    <>Continue <ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
