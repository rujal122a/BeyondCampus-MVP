"use client";

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Coordinates, MapItem } from "@/lib/types";

type LeafletDefaultIcon = L.Icon.Default & { _getIconUrl?: string };

delete (L.Icon.Default.prototype as LeafletDefaultIcon)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const campusIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const listingIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER: Coordinates = { lat: 16.8457, lng: 74.6015 };

function MapController({
  centerOn,
  items,
}: {
  centerOn?: Coordinates;
  items: MapItem[];
}) {
  const map = useMap();

  useEffect(() => {
    if (centerOn) {
      map.flyTo([centerOn.lat, centerOn.lng], 16, { duration: 0.8 });
      return;
    }

    if (items.length > 1) {
      const bounds = L.latLngBounds(
        items.map((item) => [item.coordinates.lat, item.coordinates.lng] as [number, number])
      );
      map.fitBounds(bounds.pad(0.25));
    }
  }, [centerOn, items, map]);

  return null;
}

interface MapViewProps {
  type: "stays" | "eats";
  items: MapItem[];
  centerOn?: Coordinates;
}

export default function MapView({ type, items, centerOn }: MapViewProps) {
  const itemLabel = type === "stays" ? "Available stays" : "Local services";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="frame-panel h-[600px] overflow-hidden rounded-6xl"
    >
      <div className="relative h-full w-full overflow-hidden rounded-6xl">
        <MapContainer
          center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
          zoom={15}
          scrollWheelZoom
          className="h-full w-full"
          zoomControl={false}
        >
          <MapController centerOn={centerOn} items={items} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <Marker position={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]} icon={campusIcon}>
            <Popup>
              <div className="space-y-1 py-1 text-sm text-text-primary">
                <p className="font-semibold">Walchand College</p>
                <p className="text-xs text-text-secondary">Campus center</p>
              </div>
            </Popup>
          </Marker>

          {items.map((item) => (
            <Marker
              key={item.id}
              position={[item.coordinates.lat, item.coordinates.lng]}
              icon={listingIcon}
            >
              <Popup>
                <div className="min-w-[180px] space-y-3 py-1 text-text-primary">
                  {item.imageUrl ? (
                    <div className="relative h-24 overflow-hidden rounded-2xl">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="180px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="space-y-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs text-text-secondary">{item.subtitle}</p>
                    <p className="text-sm font-semibold">{item.priceLabel}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="pointer-events-none absolute left-5 top-5 z-[1000] max-w-xs rounded-4xl border border-white/60 bg-white/70 px-4 py-3 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-surface px-2 py-2 text-white">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Campus anchored map</p>
              <p className="text-xs text-text-secondary">
                Walchand College plus live {itemLabel.toLowerCase()}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
