import { create } from 'zustand';

const useMapStore = create((set) => ({
  center: [18.0, 71.0],  // Arabian Sea
  zoom: 11,
  recenterTrigger: 0,  // increment to trigger recenter
  isFullscreen: false,
  
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  recenter: () => set((state) => ({ recenterTrigger: state.recenterTrigger + 1 })),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
}));

export default useMapStore;
