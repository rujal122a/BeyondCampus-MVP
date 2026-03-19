"use client";

import { motion } from "framer-motion";
import { FlatCard } from "@/components/stays/flat-card";
import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, Loader2, Map as MapIcon, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { mapListingToCard, mapListingsToMapItems } from "@/lib/data-mappers";
import type { Coordinates, ListingRecord } from "@/lib/types";

const MapView = dynamic(() => import("@/components/map/map-view"), {
  ssr: false,
  loading: () => (
    <div className="frame-panel flex h-[600px] items-center justify-center rounded-6xl text-text-secondary">
      Loading map
    </div>
  ),
});

export default function StaysPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [mapCenter, setMapCenter] = useState<Coordinates | undefined>(undefined);
  const [listings, setListings] = useState<ListingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .neq("is_active", false)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setListings((data ?? []) as ListingRecord[]);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchListings();
  }, []);

  const cards = useMemo(() => listings.map(mapListingToCard), [listings]);
  const mapItems = useMemo(() => mapListingsToMapItems(listings), [listings]);

  const handleShowOnMap = (coordinates?: Coordinates) => {
    if (!coordinates) {
      return;
    }

    setMapCenter(coordinates);
    setViewMode("map");
  };

  return (
    <div className="page-shell px-4 pb-16 pt-4 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
            <span className="eyebrow">Live housing inventory</span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary sm:text-6xl">
              Find your next stay with campus context built in.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
              Browse verified-looking student housing, compare distances, and jump to the map
              without leaving the flow.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
            <div className="frame-panel inline-flex rounded-full p-1">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  viewMode === "list" ? "bg-surface text-white" : "text-text-secondary"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  List
                </span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  viewMode === "map" ? "bg-surface text-white" : "text-text-secondary"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  Map
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        {viewMode === "list" ? (
          <>
            {isLoading ? (
              <div className="section-frame flex flex-col items-center justify-center py-24 text-center">
                <Loader2 className="mb-4 h-8 w-8 animate-spin text-text-secondary" />
                <p className="text-text-secondary">Loading live properties...</p>
              </div>
            ) : cards.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((flat, index) => (
                  <motion.div
                    key={flat.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FlatCard flat={flat} onShowOnMap={() => handleShowOnMap(flat.coordinates)} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="section-frame flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-5 rounded-full border border-border-subtle p-4">
                  <MapPin className="h-8 w-8 text-text-secondary" />
                </div>
                <h2 className="text-2xl font-semibold text-text-primary">No active stays yet</h2>
                <p className="mt-3 max-w-md text-text-secondary">
                  The marketplace is ready, but there are no published properties to show right now.
                </p>
              </div>
            )}
          </>
        ) : (
          <MapView type="stays" items={mapItems} centerOn={mapCenter} />
        )}
      </div>
    </div>
  );
}
