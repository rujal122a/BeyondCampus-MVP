"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { ArrowLeft, Clock3, Loader2, Phone, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FALLBACK_SERVICE_IMAGE } from "@/lib/data-mappers";
import { isSupabaseStorageUrl } from "@/lib/image-utils";
import type { MapItem, MessServiceRecord, ProfileRecord } from "@/lib/types";
import { toast } from "sonner";

const MapView = dynamic(() => import("@/components/map/map-view"), {
  ssr: false,
  loading: () => <div className="frame-panel h-[320px] animate-pulse rounded-6xl" />,
});

interface ServiceDetailView {
  service: MessServiceRecord;
  vendor: ProfileRecord | null;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [detail, setDetail] = useState<ServiceDetailView | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchServiceDetails() {
      if (!params.id) {
        return;
      }

      try {
        const { data: serviceData, error: serviceError } = await supabase
          .from("mess_services")
          .select("*")
          .eq("id", params.id)
          .single();

        if (serviceError || !serviceData) {
          throw serviceError ?? new Error("Service not found.");
        }

        const typedService = serviceData as MessServiceRecord;

        const { data: vendorData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", typedService.vendor_id)
          .single();

        setDetail({
          service: typedService,
          vendor: (vendorData as ProfileRecord | null) ?? null,
        });
      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchServiceDetails();
  }, [params.id]);

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
          <h1 className="text-3xl font-semibold text-text-primary">Service not found</h1>
          <p className="mt-4 text-base leading-7 text-text-secondary">
            This mess or tiffin service may have been removed or is currently unavailable.
          </p>
          <button type="button" onClick={() => router.push("/eats")} className="btn-primary mt-6">
            Back to eats
          </button>
        </div>
      </div>
    );
  }

  const service = detail.service;
  const image = service.image_url ?? FALLBACK_SERVICE_IMAGE;
  const menu = service.today_menu ?? [];
  const mapItems: MapItem[] = service.coordinates
    ? [
        {
          id: service.id,
          title: service.name,
          subtitle: service.cuisine,
          priceLabel: `Rs ${service.price_per_month.toLocaleString()}/mo`,
          imageUrl: image,
          coordinates: service.coordinates,
        },
      ]
    : [];

  return (
    <div className="page-shell px-4 pb-16 pt-4 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          <ArrowLeft className="h-4 w-4" />
          Back to eats
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-frame-dark"
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <span className="eyebrow !border-white/35 !bg-white/8 !text-white/70">Meal plan detail</span>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                {service.name}
              </h1>
              <div className="space-y-2 text-sm text-white/70">
                <div>{service.cuisine}</div>
                <div className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {service.delivery_time ?? "12:00 PM - 2:00 PM"}
                </div>
              </div>
            </div>

            <div className="rounded-5xl border border-white/14 bg-white/6 p-6 text-right">
              <p className="text-sm uppercase tracking-[0.18em] text-white/45">Monthly subscription</p>
              <p className="mt-3 text-4xl font-semibold text-white">
                Rs {service.price_per_month.toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-white/60">Per month</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <div className="section-frame">
              <div className="relative h-[380px] overflow-hidden rounded-5xl sm:h-[460px]">
                <Image
                  src={image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  unoptimized={isSupabaseStorageUrl(image)}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="section-frame">
              <h2 className="text-2xl font-semibold text-text-primary">About this service</h2>
              <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-text-secondary">
                {service.description || "No description provided yet."}
              </p>
            </div>

            {menu.length ? (
              <div className="section-frame">
                <h2 className="text-2xl font-semibold text-text-primary">Today&apos;s menu</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {menu.map((item) => (
                    <div
                      key={item}
                      className="rounded-4xl border border-border-subtle/30 bg-white/20 px-4 py-4 text-sm text-text-secondary"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {mapItems.length > 0 ? <MapView type="eats" items={mapItems} centerOn={service.coordinates ?? undefined} /> : null}
          </div>

          <aside className="space-y-6">
            <div className="section-frame sticky top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                Managed by
              </p>

              <div className="mt-5 flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-4xl border border-border-subtle bg-white/35">
                  {detail.vendor?.avatar_url ? (
                    <Image
                      src={detail.vendor.avatar_url}
                      alt={detail.vendor.full_name ?? "Vendor avatar"}
                      fill
                      sizes="64px"
                      unoptimized={isSupabaseStorageUrl(detail.vendor.avatar_url)}
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="text-lg font-semibold text-text-primary">
                    {detail.vendor?.full_name ?? "Mess owner"}
                  </p>
                  <p className="text-sm text-text-secondary">Verified mess owner profile</p>
                </div>
              </div>

              {user ? (
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => toast.info("Subscriptions are planned, but not part of this release yet.")}
                    className="btn-primary w-full"
                  >
                    <UtensilsCrossed className="h-4 w-4" />
                    Subscribe coming soon
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.info("Direct vendor contact is planned, but not part of this release yet.")}
                    className="btn-secondary w-full"
                  >
                    <Phone className="h-4 w-4" />
                    Contact vendor coming soon
                  </button>
                </div>
              ) : (
                <Link href="/login" className="btn-primary mt-6 w-full">
                  Log in to connect
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
