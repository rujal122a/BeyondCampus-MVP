"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Camera, CheckCircle2, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface OwnerOnboardingData {
  full_name: string;
  avatar_url: string;
  bio: string;
}

export default function OwnerOnboardingPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<OwnerOnboardingData>({
    full_name: "",
    avatar_url: "",
    bio: "",
  });

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [isAuthLoading, router, user]);

  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) {
      return formData.avatar_url;
    }

    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    setIsUploading(true);
    const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, avatarFile);
    setIsUploading(false);

    if (uploadError) {
      toast.error("Error uploading avatar.");
      console.error(uploadError);
      return null;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    setIsSubmitting(true);

    try {
      let finalAvatarUrl = formData.avatar_url;

      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          finalAvatarUrl = uploadedUrl;
        }
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: formData.full_name,
        avatar_url: finalAvatarUrl,
        role: "property_owner",
        major: null,
        graduation_year: null,
        budget: null,
        lifestyle_tags: [],
        bio: formData.bio || null,
      });

      if (error) {
        throw error;
      }

      toast.success("Flat owner profile created successfully.");
      router.push("/list-your-property");
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Error saving profile.";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.full_name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (step < 2) {
      setStep((current) => current + 1);
      return;
    }

    void handleSubmit();
  };

  if (isAuthLoading || !user) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-text-secondary" />
      </div>
    );
  }

  return (
    <div className="page-shell px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-3">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium ${
                  step >= item
                    ? "border-surface bg-surface text-white"
                    : "border-border-subtle bg-white/25 text-text-secondary"
                }`}
              >
                {item}
              </div>
              {item < 2 ? (
                <div className={`h-px w-40 sm:w-56 ${step > item ? "bg-surface" : "bg-border-subtle/35"}`} />
              ) : null}
            </div>
          ))}
        </div>

        <div className="section-frame">
          <div className="mb-8 text-center">
            <span className="eyebrow">Flat owner onboarding</span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
              {step === 1 ? "Set up the flat owner identity" : "Add a short introduction"}
            </h1>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              className="space-y-8"
            >
              {step === 1 ? (
                <div className="space-y-8">
                  <div className="flex flex-col items-center text-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative"
                    >
                      <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-border-subtle bg-white/35">
                        {avatarPreview ? (
                          <Image
                            src={avatarPreview}
                            alt="Avatar preview"
                            fill
                            unoptimized
                            sizes="128px"
                            className="object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-10 w-10 text-text-secondary" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-surface/40 opacity-0 transition group-hover:opacity-100">
                          <Camera className="h-7 w-7 text-white" />
                        </div>
                      </div>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarSelect}
                    />
                    <p className="mt-3 text-sm text-text-secondary">Upload a profile or brand photo</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Full name or property brand</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(event) =>
                        setFormData((previous) => ({ ...previous, full_name: event.target.value }))
                      }
                      className="field"
                      placeholder="e.g. Shinde Student Homes"
                    />
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Bio or description</label>
                  <textarea
                    value={formData.bio}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, bio: event.target.value }))
                    }
                    className="textarea-field"
                    placeholder="Briefly describe your properties, locality, and the student stay experience."
                  />
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => (step === 1 ? router.push("/onboarding") : setStep((current) => current - 1))}
              className="btn-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button type="button" onClick={nextStep} disabled={isSubmitting || isUploading} className="btn-primary">
              {isSubmitting || isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : step === 2 ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {step === 2 ? "Complete profile" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
