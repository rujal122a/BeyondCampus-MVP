"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { ArrowLeft, BedDouble, Loader2, MapPin, Phone, ShieldAlert } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FALLBACK_PROPERTY_IMAGE } from "@/lib/data-mappers";
import { isSupabaseStorageUrl } from "@/lib/image-utils";
import type { ListingRecord, MapItem, ProfileRecord } from "@/lib/types";
import { toast } from "sonner";
import InterestedPeople from "@/components/stays/interested-people";

const MapView = dynamic(() => import("@/components/map/map-view"), {
  ssr: false,
  loading: () => <div className="frame-panel h-[320px] animate-pulse rounded-6xl" />,
});

interface ListingDetailView {
  listing: ListingRecord;
  owner: ProfileRecord | null;
  currentUserProfile: ProfileRecord | null;
}

export default function ListingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoadingAuth = useAuthStore((state) => state.isLoading);
  const [detail, setDetail] = useState<ListingDetailView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    async function fetchListingDetails() {
      if (!params.id || !user) {
        return;
      }

      try {
        const { data: listingData, error: listingError } = await supabase
          .from("listings")
          .select("*")
          .eq("id", params.id)
          .single();

        if (listingError || !listingData) {
          throw listingError ?? new Error("Listing not found.");
        }

        const typedListing = listingData as ListingRecord;

        const { data: ownerData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", typedListing.lister_id)
          .single();

        const { data: currentUserProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setDetail({
          listing: typedListing,
          owner: (ownerData as ProfileRecord | null) ?? null,
          currentUserProfile: (currentUserProfile as ProfileRecord | null) ?? null,
        });
      } catch (error) {
        console.error("Error fetching listing details:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchListingDetails();
  }, [params.id, user]);

  if (isLoadingAuth) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-text-secondary" />
      </div>
    );
  }

  if (!user) {
    const returnTo = params.id ? `/stays/${params.id}` : "/stays";

    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-4">
        <div className="section-frame max-w-lg text-center">
          <h1 className="text-3xl font-semibold text-text-primary">Login required</h1>
          <p className="mt-4 text-base leading-7 text-text-secondary">
            You need to be logged in to view full details for this stay.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => router.push(`/login?next=${encodeURIComponent(returnTo)}`)}
              className="btn-primary w-full sm:w-auto"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => router.push("/stays")}
              className="btn-secondary w-full sm:w-auto"
            >
              Back to stays
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-text-secondary" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-4">
        <div className="section-frame max-w-lg text-center">
          <h1 className="text-3xl font-semibold text-text-primary">Listing not found</h1>
          <p className="mt-4 text-base leading-7 text-text-secondary">
            This property may have been removed or is no longer available.
          </p>
          <button type="button" onClick={() => router.push("/stays")} className="btn-primary mt-6">
            Back to stays
          </button>
        </div>
      </div>
    );
  }

  const listing = detail.listing;
  const images = listing.image_urls?.length ? listing.image_urls : [FALLBACK_PROPERTY_IMAGE];
  const mapItems: MapItem[] = listing.coordinates
    ? [
        {
          id: listing.id,
          title: listing.title,
          subtitle: listing.location,
          priceLabel: `Rs ${(listing.rent_price ?? 0).toLocaleString()}/mo`,
          imageUrl: images[0],
          coordinates: listing.coordinates,
        },
      ]
    : [];

  return (
    <div className="page-shell px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button type="button" onClick={() => router.back()} className="btn-ghost mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to stays
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl mb-4">
            {listing.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-text-secondary text-base lg:text-lg">
            <div className="inline-flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {listing.location}
            </div>
            {listing.type && (
              <>
                <span className="hidden sm:inline text-border-subtle">•</span>
                <div className="inline-flex items-center gap-2">
                  <BedDouble className="h-5 w-5" />
                  {listing.type}
                </div>
              </>
            )}
            {listing.distance_from_campus && (
              <>
                <span className="hidden sm:inline text-border-subtle">•</span>
                <div className="inline-flex items-center gap-2">
                  {listing.distance_from_campus}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mb-12">
          <div className="relative h-[300px] w-full overflow-hidden rounded-4xl sm:h-[400px] lg:h-[500px] shadow-sm border border-border-subtle/20 group bg-surface/5">
            <Image
              src={images[activeImageIndex]}
              alt={listing.title}
              fill
              sizes="(max-width: 1024px) 100vw, 100vw"
              unoptimized={isSupabaseStorageUrl(images[activeImageIndex])}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    activeImageIndex === index ? "border-surface opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${listing.title} preview ${index + 1}`}
                    fill
                    sizes="112px"
                    unoptimized={isSupabaseStorageUrl(image)}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div className="space-y-12">
            
            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-6">About this place</h2>
              <div className="prose prose-lg text-text-secondary max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed text-base lg:text-lg">
                  {listing.description || "No description provided yet."}
                </p>
              </div>
            </section>

            <hr className="border-border-subtle/20" />

            {listing.amenities?.length ? (
              <section>
                <h2 className="text-2xl font-semibold text-text-primary mb-6">What this place offers</h2>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                  {listing.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3 text-text-secondary">
                      <div className="h-1.5 w-1.5 rounded-full bg-text-secondary/50" />
                      <span className="text-base font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {listing.house_rules?.length ? (
              <>
                <hr className="border-border-subtle/20" />
                <section>
                  <h2 className="text-2xl font-semibold text-text-primary mb-6">House rules</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {listing.house_rules.map((rule) => (
                      <div
                        key={rule}
                        className="flex items-start gap-3 rounded-2xl bg-black/5 p-4"
                      >
                         <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-text-primary/70" />
                         <span className="leading-relaxed text-text-secondary">{rule}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            ) : null}

            {mapItems.length > 0 && (
              <>
                <hr className="border-border-subtle/20" />
                <section>
                  <h2 className="text-2xl font-semibold text-text-primary mb-6">Where you&apos;ll be</h2>
                  <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-border-subtle/20 shadow-sm relative z-0">
                     <MapView type="stays" items={mapItems} centerOn={listing.coordinates ?? undefined} />
                  </div>
                </section>
              </>
            )}

            {(detail.currentUserProfile?.role === 'seeker' || user?.id === listing.lister_id) && (
              <>
                <hr className="border-border-subtle/20" />
                <section>
                   <InterestedPeople listingId={listing.id} isOwner={user?.id === listing.lister_id} />
                </section>
              </>
            )}
          </div>

          <aside>
            <div className="sticky top-28 space-y-6">
              
              <div className="section-frame-dark flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="mb-2 flex items-baseline">
                    <span className="text-4xl font-bold tracking-tight text-white">
                      Rs {(listing.rent_price ?? 0).toLocaleString()}
                    </span>
                    <span className="text-white/60 text-lg ml-2 font-medium">/ month</span>
                  </div>
                  {listing.deposit_amount ? (
                    <div className="text-white/70 text-sm mt-1">
                      + Rs {listing.deposit_amount.toLocaleString()} deposit
                    </div>
                  ) : null}
                </div>
                
                <hr className="border-white/10 my-6" />
                
                <div className="space-y-4">
                   <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/50 mb-4">
                     Listed By
                   </p>
                   <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10">
                      {detail.owner?.avatar_url ? (
                        <Image
                          src={detail.owner.avatar_url}
                          alt={detail.owner.full_name ?? "Owner avatar"}
                          fill
                          sizes="56px"
                          unoptimized={isSupabaseStorageUrl(detail.owner.avatar_url)}
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-white/50 font-semibold text-xl">
                           {detail.owner?.full_name?.charAt(0) ?? "O"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {detail.owner?.full_name ?? "Flat owner"}
                      </p>
                      <p className="text-sm text-white/60">Verified profile</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  {!user ? (
                    <Link href={`/login?next=/stays/${String(params.id)}`} className="w-full bg-white text-surface hover:bg-white/90 py-3.5 px-6 rounded-full font-bold text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center text-center">
                      Log in to connect
                    </Link>
                  ) : detail.currentUserProfile?.role === 'seeker' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => toast.info("Direct contact is planned, but not part of this release yet.")}
                        className="w-full bg-white text-surface hover:bg-white/90 py-3.5 px-6 rounded-full font-bold text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <Phone className="h-5 w-5" />
                        Contact Owner
                      </button>
                      <button type="button" onClick={() => toast.info("Saved to favorites (demo)")} className="w-full bg-transparent border border-white/30 text-white hover:bg-white/10 py-3.5 px-6 rounded-full font-semibold text-base transition-all flex items-center justify-center gap-2">
                        Save listing
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="rounded-3xl border border-accent-amber/30 bg-accent-amber/10 p-5 flex gap-4">
                <ShieldAlert className="h-6 w-6 shrink-0 text-accent-amber" />
                <p className="text-sm leading-relaxed text-text-secondary">
                  <strong>Safety Tip.</strong> Never transfer money or communicate outside the official website before meeting in person.
                </p>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
