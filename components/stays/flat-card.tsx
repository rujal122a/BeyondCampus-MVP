"use client";

import { BedDouble, Map, MapPin, MoveRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ListingCardData } from "@/lib/types";
import { isSupabaseStorageUrl } from "@/lib/image-utils";
import { useAuthStore } from "@/store/authStore";
import { LoginPromptModal } from "@/components/ui/LoginPromptModal";

interface FlatCardProps {
  flat: ListingCardData;
  onShowOnMap?: () => void;
}

export function FlatCard({ flat, onShowOnMap }: FlatCardProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleViewStay = () => {
    if (user) {
      router.push(`/stays/${flat.id}`);
      return;
    }

    setShowLoginPrompt(true);
  };

  const handleShowOnMap = () => {
    if (user) {
      if (onShowOnMap) onShowOnMap();
      return;
    }

    setShowLoginPrompt(true);
  };

  return (
    <>
      <article className="frame-panel overflow-hidden rounded-5xl">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={flat.imageUrl}
            alt={flat.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            unoptimized={isSupabaseStorageUrl(flat.imageUrl)}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/55 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/70 bg-white/75 px-3 py-1 text-xs font-semibold text-text-primary backdrop-blur">
              {flat.type}
            </span>
            {flat.isInactive ? (
              <span className="rounded-full border border-white/70 bg-white/75 px-3 py-1 text-xs font-semibold text-text-primary backdrop-blur">
                Inactive
              </span>
            ) : null}
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold text-text-primary">{flat.title}</h3>
              <div className="text-right text-sm font-semibold text-text-primary">
                Rs {flat.price.toLocaleString()}
                <div className="text-xs font-normal text-text-secondary">per month</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{flat.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <BedDouble className="h-4 w-4" />
              <span>{flat.distanceToCampus}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {flat.amenities.slice(0, 4).map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            {onShowOnMap ? (
              <button type="button" onClick={handleShowOnMap} className="btn-secondary flex-1">
                <Map className="h-4 w-4" />
                Show on map
              </button>
            ) : null}
            <button type="button" onClick={handleViewStay} className="btn-primary flex-1">
              View stay
              <MoveRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>

      <LoginPromptModal
        open={showLoginPrompt}
        redirectTo={`/stays/${flat.id}`}
        onClose={() => setShowLoginPrompt(false)}
      />
    </>
  );
}
