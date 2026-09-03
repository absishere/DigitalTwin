import { create } from 'zustand';
import { getActiveAlerts } from '../services/alertService';

const useAlertStore = create((set) => ({
  alerts: [],
  alertCount: 0,
  
  initialize: async () => {
    const alerts = await getActiveAlerts();
    set({ alerts, alertCount: alerts.length });
  },
}));

export default useAlertStore;
