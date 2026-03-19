"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Camera, CheckCircle2, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StudentOnboardingData {
  full_name: string;
  avatar_url: string;
  major: string;
  graduation_year: string;
  budget: string;
  lifestyle_tags: string[];
  bio: string;
}

const LIFESTYLE_TAGS = [
  "Night Owl",
  "Early Riser",
  "Vegetarian",
  "Non-Vegetarian",
  "Neat Freak",
  "Relaxed",
  "Studious",
  "Party Goer",
  "Pet Friendly",
  "Non-Smoker",
  "Gym Rat",
  "Introvert",
  "Extrovert",
];

export default function StudentOnboardingPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<StudentOnboardingData>({
    full_name: "",
    avatar_url: "",
    major: "",
    graduation_year: new Date().getFullYear().toString(),
    budget: "",
    lifestyle_tags: [],
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

  const toggleTag = (tag: string) => {
    setFormData((previous) => ({
      ...previous,
      lifestyle_tags: previous.lifestyle_tags.includes(tag)
        ? previous.lifestyle_tags.filter((item) => item !== tag)
        : [...previous.lifestyle_tags, tag],
    }));
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
        role: "seeker",
        major: formData.major || null,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year, 10) : null,
        budget: formData.budget ? parseInt(formData.budget, 10) : null,
        lifestyle_tags: formData.lifestyle_tags,
        bio: formData.bio || null,
      });

      if (error) {
        throw error;
      }

      toast.success("Profile created successfully.");
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error saving profile.";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.full_name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (step === 2 && !formData.major.trim()) {
      toast.error("Please enter your major.");
      return;
    }

    if (step < 3) {
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
        <div className="mx-auto mb-8 flex max-w-[42rem] items-center justify-center gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-medium ${
                  step >= item
                    ? "border-surface bg-surface text-white"
                    : "border-border-subtle bg-white/25 text-text-secondary"
                }`}
              >
                {item}
              </div>
              {item < 3 ? (
                <div className={`h-px w-40 sm:w-56 ${step > item ? "bg-surface" : "bg-border-subtle/35"}`} />
              ) : null}
            </div>
          ))}
        </div>

        <div className="section-frame">
          <div className="mb-8 text-center">
            <span className="eyebrow">Student onboarding</span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
              {step === 1 && "Start with your basics"}
              {step === 2 && "Add your academic details"}
              {step === 3 && "Define your living preferences"}
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
                    <p className="mt-3 text-sm text-text-secondary">Upload a profile photo</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Full name</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(event) =>
                        setFormData((previous) => ({ ...previous, full_name: event.target.value }))
                      }
                      className="field"
                      placeholder="e.g. Rujal Shinde"
                    />
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Major or course</label>
                    <input
                      type="text"
                      value={formData.major}
                      onChange={(event) =>
                        setFormData((previous) => ({ ...previous, major: event.target.value }))
                      }
                      className="field"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Graduation year</label>
                    <input
                      type="number"
                      value={formData.graduation_year}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          graduation_year: event.target.value,
                        }))
                      }
                      className="field"
                      placeholder="2028"
                    />
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium text-text-primary">
                      <span>Estimated monthly budget</span>
                      <span>Rs {formData.budget || "0"}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
                      value={formData.budget || 0}
                      onChange={(event) =>
                        setFormData((previous) => ({ ...previous, budget: event.target.value }))
                      }
                      className="w-full accent-surface"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-text-primary">Lifestyle tags</label>
                    <div className="flex flex-wrap gap-2">
                      {LIFESTYLE_TAGS.map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`rounded-full px-4 py-2 text-sm transition ${
                            formData.lifestyle_tags.includes(tag)
                              ? "bg-surface text-white"
                              : "border border-border-subtle/35 bg-white/25 text-text-secondary"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(event) =>
                        setFormData((previous) => ({ ...previous, bio: event.target.value }))
                      }
                      className="textarea-field"
                      placeholder="Tell flatmates a bit about yourself..."
                    />
                  </div>
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
              ) : step === 3 ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {step === 3 ? "Complete profile" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
