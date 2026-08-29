"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type EcolePourCarte = {
  id: string;
  slug: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
};

export default function CarteEcoles({ ecoles }: { ecoles: EcolePourCarte[] }) {
  return (
    <MapContainer
      center={[7.54, -5.5471]}
      zoom={7}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>
        {ecoles.map((ecole) => (
          <Marker key={ecole.id} position={[ecole.latitude, ecole.longitude]}>
            <Popup>
              <p className="font-semibold">{ecole.name}</p>
              <p className="text-sm text-zinc-500">{ecole.type}</p>
              <Link
                href={`/ecole/${ecole.slug}`}
                className="text-sm text-blue-600 underline"
              >
                Voir l&apos;école
              </Link>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}