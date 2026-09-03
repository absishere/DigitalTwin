import { create } from 'zustand';
import { getPrimaryVessel, getNearbyVessels } from '../services/vesselService';

const useVesselStore = create((set, get) => ({
  primaryVessel: null,
  nearbyVessels: [],
  selectedVessel: null,
  selectedRadius: 25,
  nearbyCount: 0,
  loading: false,
  
  initialize: async () => {
    set({ loading: true });
    const primary = await getPrimaryVessel();
    const nearby = await getNearbyVessels(primary.lat, primary.lng, get().selectedRadius);
    set({ primaryVessel: primary, nearbyVessels: nearby, nearbyCount: nearby.length, loading: false });
  },
  
  setRadius: async (radius) => {
    const { primaryVessel } = get();
    if (!primaryVessel) return;
    set({ selectedRadius: radius });
    const nearby = await getNearbyVessels(primaryVessel.lat, primaryVessel.lng, radius);
    set({ nearbyVessels: nearby, nearbyCount: nearby.length });
  },
  
  selectVessel: (vessel) => set({ selectedVessel: vessel }),
  clearSelection: () => set({ selectedVessel: null }),
}));

export function simulateVesselPosition(vessel, hours) {
  if (!vessel || hours <= 0) return vessel;
  
  const speedKnots = vessel.speed || 0;
  const heading = vessel.heading || 0;
  const distanceNm = speedKnots * hours;
  const distanceKm = distanceNm * 1.852;
  
  const latRad = (vessel.lat * Math.PI) / 180;
  const lngRad = (vessel.lng * Math.PI) / 180;
  const headingRad = (heading * Math.PI) / 180;
  
  const earthRadius = 6371;
  const d = distanceKm / earthRadius;
  
  const newLat = Math.asin(
    Math.sin(latRad) * Math.cos(d) +
    Math.cos(latRad) * Math.sin(d) * Math.cos(headingRad)
  );
  
  const newLng = lngRad + Math.atan2(
    Math.sin(headingRad) * Math.sin(d) * Math.cos(latRad),
    Math.cos(d) - Math.sin(latRad) * Math.sin(newLat)
  );
  
  return {
    ...vessel,
    lat: (newLat * 180) / Math.PI,
    lng: (newLng * 180) / Math.PI,
  };
}

export default useVesselStore;
