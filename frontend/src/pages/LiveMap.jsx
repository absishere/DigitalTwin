import { useEffect } from 'react';
import AppShell from '../components/layout/AppShell';
import MarineMap from '../components/map/MarineMap';
import RadiusControl from '../components/vessels/RadiusControl';
import AIButton from '../components/ai/AIButton';
import AlertsPanel from '../components/layout/AlertsPanel';
import AIChatPanel from '../components/ai/AIChatPanel';
import SimulationPanel from '../components/layout/SimulationPanel';
import useVesselStore from '../state/vesselStore';
import useAlertStore from '../state/alertStore';

export default function LiveMap() {
  const initialize = useVesselStore((s) => s.initialize);
  const initAlerts = useAlertStore((s) => s.initialize);
  
  useEffect(() => {
    initialize();
    initAlerts();
  }, [initialize, initAlerts]);
  
  return (
    <>
      <AppShell>
        <MarineMap />
        <RadiusControl />
        <AIButton />
      </AppShell>
      <AlertsPanel />
      <AIChatPanel />
      <SimulationPanel />
    </>
  );
}
