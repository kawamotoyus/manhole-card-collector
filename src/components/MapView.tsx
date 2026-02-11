"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ManholeCard } from "@/types/card";
import Link from "next/link";
import { useEffect } from "react";

// Fix Leaflet's default icon path issues in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  cards: ManholeCard[];
}

const MapView = ({ cards }: MapViewProps) => {
  // Parsing coordinates (e.g., "35°41'22.1\"N 139°41'30.2\"E") to decimal
  const parseCoordinates = (coordString: string): [number, number] | null => {
    try {
      const parts = coordString.match(/([\d.]+)°([\d.]+)'([\d.]+)"([NS])\s+([\d.]+)°([\d.]+)'([\d.]+)"([EW])/);
      if (!parts) return null;

      const latDeg = parseFloat(parts[1]);
      const latMin = parseFloat(parts[2]);
      const latSec = parseFloat(parts[3]);
      let lat = latDeg + latMin / 60 + latSec / 3600;
      if (parts[4] === "S") lat = -lat;

      const lngDeg = parseFloat(parts[5]);
      const lngMin = parseFloat(parts[6]);
      const lngSec = parseFloat(parts[7]);
      let lng = lngDeg + lngMin / 60 + lngSec / 3600;
      if (parts[8] === "W") lng = -lng;

      return [lat, lng];
    } catch (e) {
      console.error("Failed to parse coordinates", e);
      return null;
    }
  };

  // Center the map on Japan approximately
  const defaultCenter: [number, number] = [36.2048, 138.2529];
  const defaultZoom = 5;

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--card-border)" }}>
      <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cards.map((card) => {
          const position = parseCoordinates(card.coordinates);
          if (!position) return null;

          return (
            <Marker key={card.id} position={position}>
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <strong>{card.city}</strong><br />
                  <span style={{ fontSize: "0.8rem" }}>{card.prefecture}</span><br />
                  <Link href={`/cards/${card.id}`} style={{ color: "#3b82f6", display: "block", marginTop: "5px" }}>
                    詳細を見る
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
