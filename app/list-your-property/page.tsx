"use client";

import { useEffect, useRef, useState } from "react";
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
  Home,
  Image as ImageIcon,
  IndianRupee,
  Loader2,
  MapPin,
  ShieldAlert,
  Tag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const PROPERTY_TYPES = ["1BHK", "2BHK", "3BHK", "4BHK", "PG SGL", "PG DBL"] as const;
type PropertyType = (typeof PROPERTY_TYPES)[number];

interface ListingData {
  title: string;
  location: string;
  price: string;
  type: PropertyType;
  description: string;
  distanceToCampus: string;
}

const COMMON_AMENITIES = [
  "Wi-Fi",
  "AC",
  "Geyser",
  "RO Water",
  "Power Backup",
  "Washing Machine",
  "Fridge",
  "Parking",
  "Lift",
  "Security Guard",
  "Gym",
];

const COMMON_RULES = [
  "No Smoking",
  "No Pets",
  "No loud music after 11 PM",
  "Vegetarian only",
  "Girls only",
  "Boys only",
  "Family only",
];

const STEPS_META = [
  { title: "Basic details", sub: "Capture the essentials first." },
  { title: "Property details", sub: "Add the context students need to compare options." },
  { title: "Upload photos", sub: "Good visuals help listings feel credible." },
];

export default function ListYourPropertyPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [formData, setFormData] = useState<ListingData>({
    title: "",
    location: "",
    price: "",
    type: "2BHK",
    description: "",
    distanceToCampus: "",
  });
  const [amenities, setAmenities] = useState<string[]>([]);
  const [houseRules, setHouseRules] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function verifyAccess() {
      if (!user) {
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      const role = profile?.role;

      if (!role) {
        router.replace("/onboarding/owner");
        return;
      }

      if (role !== "property_owner") {
        toast.error("This page is only available for flat owner accounts.");
        router.replace("/dashboard");
        return;
      }

      setIsCheckingAccess(false);
    }

    void verifyAccess();
  }, [router, user]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const filesArray = Array.from(event.target.files);

    if (imageFiles.length + filesArray.length > 5) {
      toast.error("You can upload up to 5 images.");
      return;
    }

    setImageFiles((previous) => [...previous, ...filesArray]);
    setImagePreviews((previous) => [
      ...previous,
      ...filesArray.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (index: number) => {
    setImageFiles((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
    setImagePreviews((previous) => {
      const nextPreviews = [...previous];
      URL.revokeObjectURL(nextPreviews[index]);
      nextPreviews.splice(index, 1);
      return nextPreviews;
    });
  };

  const toggleItem = (
    item: string,
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList((current) => (current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (!user || imageFiles.length === 0) {
      return [];
    }

    const urls: string[] = [];

    for (let index = 0; index < imageFiles.length; index += 1) {
      const file = imageFiles[index];
      const fileName = `${user.id}-${Date.now()}-${index}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("listing-images").upload(fileName, file);

      if (error) {
        toast.error(`Failed to upload ${file.name}.`);
        continue;
      }

      const { data } = supabase.storage.from("listing-images").getPublicUrl(fileName);
      urls.push(data.publicUrl);
    }

    return urls;
  };

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    setIsSubmitting(true);
    toast.info("Uploading images and publishing listing...");

    try {
      const imageUrls = await uploadImages();
      const { error } = await supabase.from("listings").insert([
        {
          lister_id: user.id,
          title: formData.title,
          location: formData.location,
          rent_price: parseInt(formData.price, 10) || 0,
          type: formData.type,
          description: formData.description,
          distance_from_campus: formData.distanceToCampus,
          amenities,
          house_rules: houseRules,
          image_urls: imageUrls,
          is_active: true,
          coordinates: null,
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success("Property listed successfully.");
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred.";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  const validateStep = () => {
    if (
      step === 1 &&
      (!formData.title.trim() ||
        !formData.location.trim() ||
        !formData.price ||
        !formData.distanceToCampus.trim())
    ) {
      toast.error("Please fill in all basic details.");
      return false;
    }

    if (step === 2 && (!formData.description.trim() || amenities.length === 0)) {
      toast.error("Please add a description and at least one amenity.");
      return false;
    }

    if (step === 3 && imageFiles.length === 0) {
      toast.error("Please upload at least one image.");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }

    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    void handleSubmit();
  };

  if (!user || isCheckingAccess) {
    return (
      <ProtectedRoute>
        <div className="page-shell flex min-h-screen items-center justify-center px-4">
          <div className="section-frame-dark flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            Preparing the flat owner listing flow
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
              <div key={item} className="flex flex-1 items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium ${
                    step >= item
                      ? "border-surface bg-surface text-white"
                      : "border-border-subtle bg-white/25 text-text-secondary"
                  }`}
                >
                  {item}
                </div>
                {item < 3 ? (
                  <div className={`h-px flex-1 ${step > item ? "bg-surface" : "bg-border-subtle/35"}`} />
                ) : null}
              </div>
            ))}
          </div>

          <div className="section-frame">
            <div className="mb-8 text-center">
              <span className="eyebrow">List your property</span>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
                {STEPS_META[step - 1].title}
              </h1>
              <p className="mt-3 text-base leading-7 text-text-secondary">{STEPS_META[step - 1].sub}</p>
            </div>

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
                    <div className="space-y-2">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-text-primary">
                        <Home className="h-4 w-4" />
                        Property title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(event) =>
                          setFormData((previous) => ({ ...previous, title: event.target.value }))
                        }
                        className="field"
                        placeholder="e.g. Spacious 3BHK near WCE Gate"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="inline-flex items-center gap-2 text-sm font-medium text-text-primary">
                          <Tag className="h-4 w-4" />
                          Property type
                        </label>
                        <select
                          value={formData.type}
                          onChange={(event) =>
                            setFormData((previous) => ({
                              ...previous,
                              type: event.target.value as PropertyType,
                            }))
                          }
                          className="select-field"
                        >
                          {PROPERTY_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type.replace("PG SGL", "PG (Single)").replace("PG DBL", "PG (Double)")}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="inline-flex items-center gap-2 text-sm font-medium text-text-primary">
                          <IndianRupee className="h-4 w-4" />
                          Monthly rent
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(event) =>
                            setFormData((previous) => ({ ...previous, price: event.target.value }))
                          }
                          className="field"
                          placeholder="e.g. 5000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-text-primary">
                        <MapPin className="h-4 w-4" />
                        Location or area
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(event) =>
                          setFormData((previous) => ({ ...previous, location: event.target.value }))
                        }
                        className="field"
                        placeholder="e.g. Vishrambag, near D-Mart"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Distance to campus</label>
                      <input
                        type="text"
                        value={formData.distanceToCampus}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            distanceToCampus: event.target.value,
                          }))
                        }
                        className="field"
                        placeholder="e.g. 500m or 5 min walk"
                      />
                    </div>
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            description: event.target.value,
                          }))
                        }
                        className="textarea-field"
                        placeholder="Describe the property, neighborhood, and living setup."
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-text-primary">Amenities</label>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_AMENITIES.map((amenity) => (
                          <button
                            type="button"
                            key={amenity}
                            onClick={() => toggleItem(amenity, setAmenities)}
                            className={`rounded-full px-4 py-2 text-sm transition ${
                              amenities.includes(amenity)
                                ? "bg-surface text-white"
                                : "border border-border-subtle/35 bg-white/25 text-text-secondary"
                            }`}
                          >
                            {amenity}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-text-primary">
                        <ShieldAlert className="h-4 w-4" />
                        House rules
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_RULES.map((rule) => (
                          <button
                            type="button"
                            key={rule}
                            onClick={() => toggleItem(rule, setHouseRules)}
                            className={`rounded-full px-4 py-2 text-sm transition ${
                              houseRules.includes(rule)
                                ? "bg-surface-muted text-white"
                                : "border border-border-subtle/35 bg-white/25 text-text-secondary"
                            }`}
                          >
                            {rule}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-52 w-full flex-col items-center justify-center rounded-5xl border border-dashed border-border-subtle bg-white/25 text-text-secondary transition hover:bg-white/35"
                    >
                      <ImageIcon className="mb-3 h-10 w-10" />
                      <span className="text-base font-medium text-text-primary">Upload listing photos</span>
                      <span className="mt-1 text-sm">PNG or JPG, up to 5 images</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />

                    {imagePreviews.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={preview} className="relative aspect-square overflow-hidden rounded-4xl border border-border-subtle">
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              fill
                              unoptimized
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute right-3 top-3 rounded-full bg-surface/80 p-2 text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </>
                ) : null}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((current) => current - 1)}
                className={`btn-secondary ${step === 1 ? "pointer-events-none opacity-0" : ""}`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button type="button" onClick={nextStep} disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : step === 3 ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {step === 3 ? "Publish listing" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
