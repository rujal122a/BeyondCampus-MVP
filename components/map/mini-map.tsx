"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const propertyIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MiniMapProps {
  coordinates: { lat: number; lng: number };
  title: string;
}

export default function MiniMap({ coordinates, title }: MiniMapProps) {
  return (
    <div className="relative z-0 h-full w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={16}
        scrollWheelZoom={false}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <Marker position={[coordinates.lat, coordinates.lng]} icon={propertyIcon}>
          <Popup>{title}</Popup>
        </Marker>
      </MapContainer>
      <div className="pointer-events-none absolute inset-0 z-[400] rounded-2xl border border-black/10" />
    </div>
  );
}
