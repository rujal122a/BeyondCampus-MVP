"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChefHat,
  DollarSign,
  ImagePlus,
  Info,
  Loader2,
  Plus,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface ServiceData {
  name: string;
  description: string;
  cuisine: string;
  pricePerMonth: string;
  deliveryTime: string;
  todayMenu: string[];
}

export default function ListYourServicePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
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

  useEffect(() => {
    async function verifyAccess() {
      if (!user) {
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      const role = profile?.role;

      if (!role) {
        router.replace("/onboarding/mess-owner");
        return;
      }

      if (role !== "mess_owner") {
        toast.error("This page is only available for mess owner accounts.");
        router.replace("/dashboard");
        return;
      }

      setIsCheckingAccess(false);
    }

    void verifyAccess();
  }, [router, user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleAddMenuItem = () => {
    if (!menuItemInput.trim()) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      todayMenu: [...previous.todayMenu, menuItemInput.trim()],
    }));
    setMenuItemInput("");
  };

  const handleRemoveMenuItem = (index: number) => {
    setFormData((previous) => ({
      ...previous,
      todayMenu: previous.todayMenu.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const checkStepValidity = () => {
    if (step === 1 && (!formData.name || !formData.cuisine || !formData.description)) {
      toast.error("Please fill all required fields before proceeding.");
      return false;
    }

    if (step === 2 && (!formData.pricePerMonth || formData.todayMenu.length === 0)) {
      toast.error("Please add a price and at least one menu item.");
      return false;
    }

    if (step === 3 && !imageFile) {
      toast.error("Please upload a banner image for your service.");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (!checkStepValidity()) {
      return;
    }

    setStep((current) => current + 1);
  };

  const prevStep = () => setStep((current) => Math.max(1, current - 1));

  const handleSubmit = async () => {
    if (!checkStepValidity() || !user) {
      return;
    }

    setIsSubmitting(true);
    toast.loading("Setting up your kitchen...", { id: "submit-service" });

    try {
      let imageUrl =
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800";

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `mess-banners/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage.from("listing-images").getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        vendor_id: user.id,
        name: formData.name,
        description: formData.description,
        cuisine: formData.cuisine,
        price_per_month: Number(formData.pricePerMonth),
        delivery_time: formData.deliveryTime,
        today_menu: formData.todayMenu,
        image_url: imageUrl,
        rating: 5.0,
      };

      const { error: insertError } = await supabase.from("mess_services").insert([payload]);

      if (insertError) {
        throw insertError;
      }

      toast.success("Service created successfully.", { id: "submit-service" });
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create service.";
      console.error("Submission error:", error);
      toast.error(message, { id: "submit-service" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || isCheckingAccess) {
    return (
      <ProtectedRoute>
        <div className="page-shell flex min-h-screen items-center justify-center px-4">
          <div className="section-frame-dark flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            Preparing the mess owner listing flow
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="page-shell px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className={`flex items-center gap-3 ${item < 3 ? "flex-1" : ""}`}>
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-medium ${
                    step >= item
                      ? "border-surface bg-surface text-white"
                      : "border-border-subtle bg-white/25 text-text-secondary"
                  }`}
                >
                  {step > item ? <CheckCircle2 className="h-4 w-4" /> : item}
                </div>
                {item < 3 ? (
                  <div className={`h-px flex-1 ${step > item ? "bg-surface" : "bg-border-subtle/35"}`} />
                ) : null}
              </div>
            ))}
          </div>

          <div className="section-frame">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-6"
              >
                {step === 1 ? (
                  <>
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border-subtle bg-surface text-white">
                        <ChefHat className="h-6 w-6" />
                      </div>
                      <h1 className="text-4xl font-semibold tracking-tight text-text-primary">Basic details</h1>
                      <p className="mt-3 text-base leading-7 text-text-secondary">
                        Tell students what your mess or tiffin service offers.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Service name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Annapurna Home Foods"
                          className="field"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Cuisine or specialty</label>
                        <input
                          type="text"
                          name="cuisine"
                          value={formData.cuisine}
                          onChange={handleInputChange}
                          placeholder="e.g. Maharashtrian, North Indian Thali"
                          className="field"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Tell students what makes your meals dependable."
                          className="textarea-field"
                        />
                      </div>
                    </div>
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border-subtle bg-surface text-white">
                        <UtensilsCrossed className="h-6 w-6" />
                      </div>
                      <h1 className="text-4xl font-semibold tracking-tight text-text-primary">Pricing and menu</h1>
                      <p className="mt-3 text-base leading-7 text-text-secondary">
                        Add the information students compare first.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Monthly subscription price</label>
                        <div className="relative">
                          <DollarSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                          <input
                            type="number"
                            name="pricePerMonth"
                            value={formData.pricePerMonth}
                            onChange={handleInputChange}
                            placeholder="2500"
                            className="field pl-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Timings</label>
                        <input
                          type="text"
                          name="deliveryTime"
                          value={formData.deliveryTime}
                          onChange={handleInputChange}
                          placeholder="12:30 PM - 2:00 PM"
                          className="field"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-text-primary">Sample menu items</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={menuItemInput}
                            onChange={(event) => setMenuItemInput(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                handleAddMenuItem();
                              }
                            }}
                            placeholder="e.g. Paneer Butter Masala"
                            className="field flex-1"
                          />
                          <button type="button" onClick={handleAddMenuItem} className="btn-primary">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {formData.todayMenu.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {formData.todayMenu.map((item, index) => (
                              <span key={`${item}-${index}`} className="chip !pr-2">
                                {item}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMenuItem(index)}
                                  className="ml-2 rounded-full p-1 text-text-secondary"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border-subtle bg-surface text-white">
                        <ImagePlus className="h-6 w-6" />
                      </div>
                      <h1 className="text-4xl font-semibold tracking-tight text-text-primary">Cover photo</h1>
                      <p className="mt-3 text-base leading-7 text-text-secondary">
                        Upload a clean banner image for your service.
                      </p>
                    </div>

                    <label className="block">
                      <div className="relative flex h-64 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-5xl border border-dashed border-border-subtle bg-white/25 text-center transition hover:bg-white/35">
                        <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />

                        {imagePreview ? (
                          <>
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              unoptimized
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover opacity-65"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="btn-secondary">Change photo</div>
                            </div>
                          </>
                        ) : (
                          <>
                            <ImagePlus className="mb-3 h-10 w-10 text-text-secondary" />
                            <span className="text-base font-medium text-text-primary">Click to upload photo</span>
                            <span className="mt-1 text-sm text-text-secondary">JPG or PNG up to 5MB</span>
                          </>
                        )}
                      </div>
                    </label>

                    <div className="rounded-5xl border border-border-subtle/35 bg-white/20 p-4 text-sm leading-7 text-text-secondary">
                      <div className="inline-flex items-start gap-3">
                        <Info className="mt-1 h-4 w-4 shrink-0" />
                        <span>
                          High-quality visuals make local services feel more trustworthy to first-time student users.
                        </span>
                      </div>
                    </div>
                  </>
                ) : null}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1 || isSubmitting}
                className={`btn-secondary ${step === 1 ? "pointer-events-none opacity-0" : ""}`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              {step < 3 ? (
                <button type="button" onClick={nextStep} className="btn-primary">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Publishing..." : "Publish service"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
