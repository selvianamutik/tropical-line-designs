"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(
  () => import("@/components/contact/leaflet-map"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full rounded-md shadow-xl bg-neutral-200 animate-pulse flex items-center justify-center font-inter text-neutral-500">
        Loading map...
      </div>
    )
  }
);

export function MapClient() {
  return <LeafletMap />;
}