"use client";

import { Clock3, Map, MoveRight, Star, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { MessCardData } from "@/lib/types";
import { isSupabaseStorageUrl } from "@/lib/image-utils";

interface MessCardProps {
  vendor: MessCardData;
  onShowOnMap?: () => void;
}

export function MessCard({ vendor, onShowOnMap }: MessCardProps) {
  return (
    <article className="frame-panel overflow-hidden rounded-5xl">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={vendor.imageUrl}
          alt={vendor.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={isSupabaseStorageUrl(vendor.imageUrl)}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/55 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/75 px-3 py-1 text-xs font-semibold text-text-primary backdrop-blur">
          {vendor.cuisine}
        </div>
        <div className="absolute right-4 top-4 rounded-full border border-white/70 bg-white/75 px-3 py-1 text-xs font-semibold text-text-primary backdrop-blur">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-current" />
            {vendor.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold text-text-primary">{vendor.name}</h3>
            <div className="text-right text-sm font-semibold text-text-primary">
              Rs {vendor.pricePerMonth.toLocaleString()}
              <div className="text-xs font-normal text-text-secondary">per month</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Clock3 className="h-4 w-4" />
            <span>{vendor.deliveryTime}</span>
          </div>
        </div>

        <div className="rounded-4xl border border-border-subtle/30 bg-white/20 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            Today&apos;s menu
          </div>
          <div className="space-y-2">
            {vendor.todayMenu.slice(0, 3).map((item) => (
              <p key={item} className="text-sm text-text-primary">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          {onShowOnMap ? (
            <button type="button" onClick={onShowOnMap} className="btn-secondary flex-1">
              <Map className="h-4 w-4" />
              Show on map
            </button>
          ) : null}
          <Link href={`/eats/${vendor.id}`} className="btn-primary flex-1">
            View service
            <MoveRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
