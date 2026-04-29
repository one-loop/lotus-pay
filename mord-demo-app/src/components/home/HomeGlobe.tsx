"use client";

import { World, type Position } from "@/components/ui/globe";

const SAMPLE_ARCS: Position[] = [
  // Colombo, Sri Lanka: lat 6.927, lng 79.86
  { order: 1, startLat: 40.7128, startLng: -74.006, endLat: 6.927, endLng: 79.86, arcAlt: 0.5, color: "#67e8f9" }, // New York -> Colombo
  { order: 2, startLat: 51.5072, startLng: -0.1276, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.22, color: "#a78bfa" }, // London -> Paris
  { order: 3, startLat: 35.6762, startLng: 139.6503, endLat: 6.927, endLng: 79.86, arcAlt: 0.45, color: "#60a5fa" }, // Tokyo -> Colombo
  { order: 4, startLat: 1.3521, startLng: 103.8198, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.24, color: "#c4b5fd" }, // Singapore -> Dubai
  { order: 5, startLat: 37.7749, startLng: -122.4194, endLat: 6.927, endLng: 79.86, arcAlt: 0.55, color: "#818cf8" }, // San Francisco -> Colombo
  { order: 6, startLat: 25.2048, startLng: 55.2708, endLat: 28.6139, endLng: 77.209, arcAlt: 0.2, color: "#93c5fd" }, // Dubai -> New Delhi
  { order: 7, startLat: 48.8566, startLng: 2.3522, endLat: 6.927, endLng: 79.86, arcAlt: 0.42, color: "#c084fc" }, // Paris -> Colombo
  { order: 8, startLat: -33.8688, startLng: 151.2093, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.26, color: "#67e8f9" }, // Sydney -> Singapore
  { order: 9, startLat: 55.7558, startLng: 37.6173, endLat: 6.927, endLng: 79.86, arcAlt: 0.46, color: "#7dd3fc" }, // Moscow -> Colombo
  { order: 10, startLat: 28.6139, startLng: 77.209, endLat: 6.927, endLng: 79.86, arcAlt: 0.25, color: "#a78bfa" }, // New Delhi -> Colombo
  { order: 11, startLat: 35.6895, startLng: 51.389, endLat: 41.0082, endLng: 28.9784, arcAlt: 0.18, color: "#60a5fa" }, // Tehran -> Istanbul
  { order: 12, startLat: -23.5505, startLng: -46.6333, endLat: 6.927, endLng: 79.86, arcAlt: 0.58, color: "#93c5fd" }, // Sao Paulo -> Colombo
  { order: 13, startLat: -1.2921, startLng: 36.8219, endLat: 6.927, endLng: 79.86, arcAlt: 0.33, color: "#67e8f9" }, // Nairobi -> Colombo
  { order: 14, startLat: -26.2041, startLng: 28.0473, endLat: 6.927, endLng: 79.86, arcAlt: 0.48, color: "#c084fc" }, // Johannesburg -> Colombo
];

export default function HomeGlobe() {
  return (
    <div className="h-[650px] w-[650px] lg:h-[850px] lg:w-[850px]">
      <World
        data={SAMPLE_ARCS}
        globeConfig={{
          pointSize: 4,
          globeColor: "#4e2485",
          emissive: "#2a1150",
          showAtmosphere: true,
          atmosphereColor: "#ddd6fe",
          atmosphereAltitude: 0.14,
          polygonColor: "rgba(248, 240, 255, 0.4)",
          ambientLight: "#ede9fe",
          directionalLeftLight: "#faf5ff",
          directionalTopLight: "#ede9fe",
          pointLight: "#c4b5fd",
          arcTime: 1200,
          arcLength: 0.85,
          rings: 1,
          maxRings: 3,
          autoRotate: true,
          autoRotateSpeed: 0.6,
          initialPosition: { lat: 20, lng: 80 },
        }}
      />
    </div>
  );
}

