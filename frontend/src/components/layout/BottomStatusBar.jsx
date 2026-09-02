import { Radio, Ship, AlertTriangle, Sparkles, Clock, Play } from 'lucide-react';
import useVesselStore from '../../state/vesselStore';
import useAlertStore from '../../state/alertStore';
import useUIStore from '../../state/uiStore';
import useSimStore from '../../state/simStore';
import styles from './BottomStatusBar.module.css';

export default function BottomStatusBar() {
  const { nearbyCount, primaryVessel } = useVesselStore();
  const { alertCount } = useAlertStore();
  const { toggleAIChat } = useUIStore();
  const { toggleAlertsPanel } = useUIStore();
  const { toggleSimulating, isSimulating, simulatedHours } = useSimStore();
  
  return (
    <footer className={styles.statusbar}>
      <div className={styles.left}>
        <div className={styles.statusItem}>
          <Radio size={14} className={styles.connected} />
          <span className={styles.connected}>AIS CONNECTED</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.statusItem}>
          <Ship size={14} />
          <span>{nearbyCount} NEARBY</span>
        </div>
        <div className={styles.divider} />
        <button className={styles.statusItem} onClick={toggleAlertsPanel} aria-label="View alerts" title="View alerts">
          <AlertTriangle size={14} className={alertCount > 0 ? styles.warning : ''} />
          <span className={alertCount > 0 ? styles.warning : ''}>{alertCount} ALERTS</span>
        </button>
        <div className={styles.divider} />
        <button className={styles.statusItem} onClick={toggleSimulating} aria-label="Toggle simulation" title="Toggle simulation">
          <Play size={14} className={isSimulating ? styles.connected : ''} />
          <span className={isSimulating ? styles.connected : ''}>{isSimulating ? `SIM T+${simulatedHours.toFixed(1)}h` : 'SIMULATE'}</span>
        </button>
        <div className={styles.divider} />
        <div className={styles.statusItem}>
          <Clock size={14} />
          <span>UPDATED 4s AGO</span>
        </div>
      </div>
      
      <div className={styles.right}>
        {primaryVessel && (
          <div className={styles.vesselInfo}>
            <span className={styles.vesselName}>{primaryVessel.name}</span>
            <span className={styles.vesselMeta}>
              {primaryVessel.speed} kn · {primaryVessel.heading}°
            </span>
          </div>
        )}
        <button className={styles.aiBtn} onClick={toggleAIChat} aria-label="Open AI assistant">
          <Sparkles size={14} />
          <span>Ask MarineVerse</span>
        </button>
      </div>
    </footer>
  );
}
