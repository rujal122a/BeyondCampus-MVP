"use client";

import { motion } from "framer-motion";
import { MessCard } from "@/components/eats/mess-card";
import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, Loader2, Map as MapIcon, UtensilsCrossed } from "lucide-react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { mapServiceToCard, mapServicesToMapItems } from "@/lib/data-mappers";
import type { Coordinates, MessServiceRecord } from "@/lib/types";

const MapView = dynamic(() => import("@/components/map/map-view"), {
  ssr: false,
  loading: () => (
    <div className="frame-panel flex h-[600px] items-center justify-center rounded-6xl text-text-secondary">
      Loading map
    </div>
  ),
});

export default function EatsPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [mapCenter, setMapCenter] = useState<Coordinates | undefined>(undefined);
  const [services, setServices] = useState<MessServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from("mess_services")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setServices((data ?? []) as MessServiceRecord[]);
      } catch (error) {
        console.error("Error fetching mess services:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchServices();
  }, []);

  const cards = useMemo(() => services.map(mapServiceToCard), [services]);
  const mapItems = useMemo(() => mapServicesToMapItems(services), [services]);

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
            <span className="eyebrow">Local mess services</span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary sm:text-6xl">
              Keep meals simple when the semester gets busy.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
              Compare meal plans, view schedules, and open nearby services on the map without
              leaving the same discovery flow.
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
                <p className="text-text-secondary">Loading local meal services...</p>
              </div>
            ) : cards.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((vendor, index) => (
                  <motion.div
                    key={vendor.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MessCard vendor={vendor} onShowOnMap={() => handleShowOnMap(vendor.coordinates)} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="section-frame flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-5 rounded-full border border-border-subtle p-4">
                  <UtensilsCrossed className="h-8 w-8 text-text-secondary" />
                </div>
                <h2 className="text-2xl font-semibold text-text-primary">No services listed yet</h2>
                <p className="mt-3 max-w-md text-text-secondary">
                  No mess providers are published yet, but the service directory is wired and ready.
                </p>
              </div>
            )}
          </>
        ) : (
          <MapView type="eats" items={mapItems} centerOn={mapCenter} />
        )}
      </div>
    </div>
  );
}
