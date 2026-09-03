import { create } from 'zustand';

const useLayerStore = create((set) => ({
  layers: {
    vessels: true,
    ports: true,
    temperature: false,
    waves: false,
    wind: false,
    currents: false,
    storms: false,
    precipitation: false,
    riskZones: false,
  },
  
  toggleLayer: (layerName) => set((state) => ({
    layers: { ...state.layers, [layerName]: !state.layers[layerName] }
  })),
  
  setLayer: (layerName, value) => set((state) => ({
    layers: { ...state.layers, [layerName]: value }
  })),
}));

export default useLayerStore;
