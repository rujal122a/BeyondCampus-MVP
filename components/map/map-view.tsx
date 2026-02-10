"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { X, MapPin, Navigation } from "lucide-react";
import L from "leaflet";
import { useEffect, useState } from "react";
import { FLATS, MESS_VENDORS } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";

// Fix Leaflet Default Icon Issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Icons
const collegeIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const propertyIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const userIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});


interface MapViewProps {
    type: "stays" | "eats";
    onClose?: () => void; // Optional now
    centerOn?: { lat: number; lng: number }; // New prop
}

// Default Center (Walchand College)
const DEFAULT_CENTER = { lat: 16.8457, lng: 74.6015 };

function MapController({ centerOn }: { centerOn?: { lat: number; lng: number } }) {
    const map = useMap();
    useEffect(() => {
        if (centerOn) {
            map.flyTo([centerOn.lat, centerOn.lng], 16);
        }
    }, [centerOn, map]);
    return null;
}

export default function MapView({ type, onClose, centerOn }: MapViewProps) {
    const items = type === "stays" ? FLATS : MESS_VENDORS;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full h-[600px] rounded-3xl overflow-hidden relative shadow-xl border border-slate-200 bg-slate-50"
        >
            <MapContainer
                center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
                zoom={15}
                scrollWheelZoom={true}
                className="w-full h-full"
                zoomControl={false}
            >
                {/* Controller to handle external center updates */}
                <MapController centerOn={centerOn} />

                {/* Minimalist Tile Layer (CartoDB Positron) */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {/* Walchand College Marker */}
                <Marker position={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]} icon={collegeIcon}>
                    <Popup className="font-sans">
                        <div className="text-center p-1">
                            <h3 className="font-bold text-slate-900 text-sm">Walchand College</h3>
                            <p className="text-xs text-slate-500">Sangli</p>
                        </div>
                    </Popup>
                </Marker>

                {/* Property Markers */}
                {items.map((item: any) => (
                    item.coordinates && (
                        <Marker
                            key={item.id}
                            position={[item.coordinates.lat, item.coordinates.lng]}
                            icon={propertyIcon}
                        >
                            <Popup className="font-sans">
                                <div className="p-1 min-w-[150px]">
                                    <div className="w-full h-24 rounded-lg bg-slate-100 mb-2 overflow-hidden relative">
                                        <img src={item.images?.[0] || item.image} alt={item.title || item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-sm">{item.title || item.name}</h3>
                                    <p className="text-xs text-slate-500 mb-1">{item.location || item.cuisine}</p>
                                    <p className="font-bold text-indigo-600 text-sm">₹{item.price || item.pricePerMonth}/mo</p>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>

            {/* Overlay Info */}
            <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">Walchand College</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Campus Center</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-slate-900" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">Available Stays</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Verified Listings</p>
                    </div>
                </div>
            </div>

        </motion.div>
    );
}
