import { create } from 'zustand';

const useUIStore = create((set) => ({
  isDetailsPanelOpen: false,
  isAIChatOpen: false,
  isSearchOpen: false,
  isLayerControlOpen: false,
  isAlertsPanelOpen: false,
  
  openDetailsPanel: () => set({ isDetailsPanelOpen: true }),
  closeDetailsPanel: () => set({ isDetailsPanelOpen: false, }),
  toggleDetailsPanel: () => set((s) => ({ isDetailsPanelOpen: !s.isDetailsPanelOpen })),
  
  openAIChat: () => set({ isAIChatOpen: true }),
  closeAIChat: () => set({ isAIChatOpen: false }),
  toggleAIChat: () => set((s) => ({ isAIChatOpen: !s.isAIChatOpen })),
  
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  
  openLayerControl: () => set({ isLayerControlOpen: true }),
  closeLayerControl: () => set({ isLayerControlOpen: false }),
  toggleLayerControl: () => set((s) => ({ isLayerControlOpen: !s.isLayerControlOpen })),
  
  openAlertsPanel: () => set({ isAlertsPanelOpen: true }),
  closeAlertsPanel: () => set({ isAlertsPanelOpen: false }),
  toggleAlertsPanel: () => set((s) => ({ isAlertsPanelOpen: !s.isAlertsPanelOpen })),
}));

export default useUIStore;
