import { create } from 'zustand';

const useSimStore = create((set, get) => ({
  simulatedHours: 0,
  isSimulating: false,
  simulationSpeed: 1,
  
  setSimulatedHours: (hours) => set({ simulatedHours: Math.max(0, Math.min(12, hours)) }),
  incrementHours: () => set((state) => ({ simulatedHours: Math.min(12, state.simulatedHours + 0.5) })),
  resetSimulation: () => set({ simulatedHours: 0, isSimulating: false }),
  toggleSimulating: () => set((state) => ({ isSimulating: !state.isSimulating })),
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
}));

export default useSimStore;
