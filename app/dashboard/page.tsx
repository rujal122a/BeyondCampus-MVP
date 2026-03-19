"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import { mapListingToCard, mapServiceToCard } from "@/lib/data-mappers";
import { getProfileRoleLabel } from "@/lib/auth-intent";
import { isSupabaseStorageUrl } from "@/lib/image-utils";
import type { ListingCardData, ListingRecord, MessCardData, MessServiceRecord, ProfileRecord } from "@/lib/types";
import { Edit3, Home, Loader2, MapPin, Plus, User, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [listings, setListings] = useState<ListingCardData[]>([]);
  const [services, setServices] = useState<MessCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) {
        return;
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        const typedProfile = profileData as ProfileRecord;
        setProfile(typedProfile);

        if (typedProfile.role === "property_owner") {
          const { data: listingData, error: listingError } = await supabase
            .from("listings")
            .select("*")
            .eq("lister_id", user.id)
            .order("created_at", { ascending: false });

          if (listingError) {
            throw listingError;
          }

          setListings(((listingData ?? []) as ListingRecord[]).map(mapListingToCard));
        }

        if (typedProfile.role === "mess_owner") {
          const { data: serviceData, error: serviceError } = await supabase
            .from("mess_services")
            .select("*")
            .eq("vendor_id", user.id)
            .order("created_at", { ascending: false });

          if (serviceError) {
            throw serviceError;
          }

          setServices(((serviceData ?? []) as MessServiceRecord[]).map(mapServiceToCard));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-4">
        <div className="section-frame-dark flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading your dashboard
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="page-shell px-4 pb-16 pt-4 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <span className="eyebrow">Your workspace</span>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary sm:text-6xl">
                Manage your profile, listings, and next steps.
              </h1>
            </motion.div>

            {profile?.role === "property_owner" ? (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Link href="/list-your-property" className="btn-primary">
                  <Plus className="h-4 w-4" />
                  New listing
                </Link>
              </motion.div>
            ) : null}

            {profile?.role === "mess_owner" ? (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Link href="/list-your-service" className="btn-primary">
                  <Plus className="h-4 w-4" />
                  New service
                </Link>
              </motion.div>
            ) : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-frame"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-4xl border border-border-subtle bg-white/40">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name ?? "Profile avatar"}
                      fill
                      sizes="80px"
                      unoptimized={isSupabaseStorageUrl(profile.avatar_url)}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-8 w-8 text-text-secondary" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-text-primary">
                    {profile?.full_name ?? "Your profile"}
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary">{getProfileRoleLabel(profile?.role ?? null)}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-text-secondary">
                {profile?.major ? (
                  <div className="flex flex-col gap-1 rounded-3xl border border-border-subtle/25 bg-white/20 px-5 py-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary/70">Studies</span>
                    <span className="font-medium text-text-primary text-base">
                      {profile.major}
                      {profile.graduation_year ? ` • ${profile.graduation_year}` : ""}
                    </span>
                  </div>
                ) : null}
                {profile?.budget && profile.role === "seeker" ? (
                  <div className="flex flex-col gap-1 rounded-3xl border border-border-subtle/25 bg-white/20 px-5 py-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary/70">Budget</span>
                    <span className="font-medium text-text-primary text-base">
                      Rs {profile.budget.toLocaleString()}/mo
                    </span>
                  </div>
                ) : null}
              </div>

              {profile?.lifestyle_tags?.length ? (
                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                    Lifestyle tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.lifestyle_tags.map((tag) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {profile?.bio ? (
                <div className="mt-6 rounded-3xl border border-border-subtle/25 bg-white/20 px-6 py-5">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary/70 mb-2">About</span>
                  <p className="text-sm leading-relaxed text-text-primary/90">
                    {profile.bio}
                  </p>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => toast.info("Profile editing is planned, but not part of this release yet.")}
                className="btn-secondary mt-6 w-full"
              >
                <Edit3 className="h-4 w-4" />
                Edit profile coming soon
              </button>
            </motion.section>

            <div className="space-y-6">
              {profile?.role === "property_owner" && (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="section-frame"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-text-primary">My properties</h3>
                      <p className="mt-1 text-sm text-text-secondary">
                        Listings published from your flat owner profile.
                      </p>
                    </div>
                    <span className="chip">{listings.length} active cards</span>
                  </div>

                  {listings.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {listings.map((listing) => (
                        <Link
                          href={`/stays/${listing.id}`}
                          key={listing.id}
                          className="frame-panel overflow-hidden rounded-5xl transition hover:bg-white/35"
                        >
                          <div className="relative h-40 overflow-hidden">
                            <Image
                              src={listing.imageUrl}
                              alt={listing.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 50vw"
                              unoptimized={isSupabaseStorageUrl(listing.imageUrl)}
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-2 p-4">
                            <div className="flex items-start justify-between gap-4">
                              <h4 className="text-lg font-semibold text-text-primary">{listing.title}</h4>
                              <span className="text-sm font-semibold text-text-primary">
                                Rs {listing.price.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{listing.location}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-5xl border border-dashed border-border-subtle/45 bg-white/15 px-6 py-12 text-center">
                      <Home className="mx-auto h-8 w-8 text-text-secondary" />
                      <h4 className="mt-4 text-xl font-semibold text-text-primary">No properties listed yet</h4>
                      <p className="mt-3 text-sm text-text-secondary">
                        Create your first listing to see it appear here and in the public marketplace.
                      </p>
                    </div>
                  )}
                </motion.section>
              )}

              {profile?.role === "mess_owner" && (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="section-frame"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-text-primary">My services</h3>
                      <p className="mt-1 text-sm text-text-secondary">
                        Mess and tiffin offerings published from your mess owner profile.
                      </p>
                    </div>
                    <span className="chip">{services.length} active cards</span>
                  </div>

                  {services.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {services.map((service) => (
                        <Link
                          href={`/eats/${service.id}`}
                          key={service.id}
                          className="frame-panel overflow-hidden rounded-5xl transition hover:bg-white/35"
                        >
                          <div className="relative h-40 overflow-hidden">
                            <Image
                              src={service.imageUrl}
                              alt={service.name}
                              fill
                              sizes="(max-width: 640px) 100vw, 50vw"
                              unoptimized={isSupabaseStorageUrl(service.imageUrl)}
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-2 p-4">
                            <div className="flex items-start justify-between gap-4">
                              <h4 className="text-lg font-semibold text-text-primary">{service.name}</h4>
                              <span className="text-sm font-semibold text-text-primary">
                                Rs {service.pricePerMonth.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                              <UtensilsCrossed className="h-4 w-4" />
                              <span className="truncate">{service.cuisine}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-5xl border border-dashed border-border-subtle/45 bg-white/15 px-6 py-12 text-center">
                      <UtensilsCrossed className="mx-auto h-8 w-8 text-text-secondary" />
                      <h4 className="mt-4 text-xl font-semibold text-text-primary">No services listed yet</h4>
                      <p className="mt-3 text-sm text-text-secondary">
                        Publish your first mess or tiffin service to see it appear here and in the eats directory.
                      </p>
                    </div>
                  )}
                </motion.section>
              )}

              {profile?.role === "seeker" && (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="section-frame"
                >
                  <h3 className="text-2xl font-semibold text-text-primary">Saved stays</h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-text-secondary">
                    Saved properties are not wired in this release yet, so this section is being held
                    as a planned workspace area rather than a broken feature.
                  </p>
                  <div className="mt-6">
                    <Link href="/stays" className="btn-primary">
                      Explore stays
                    </Link>
                  </div>
                </motion.section>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
