import { X } from 'lucide-react';
import useUIStore from '../../state/uiStore';
import useVesselStore from '../../state/vesselStore';
import VesselDetails from '../vessels/VesselDetails';
import styles from './SidePanel.module.css';

export default function SidePanel() {
  const { isDetailsPanelOpen, closeDetailsPanel } = useUIStore();
  const { selectedVessel, clearSelection } = useVesselStore();
  
  const handleClose = () => {
    closeDetailsPanel();
    clearSelection();
  };
  
  return (
    <div className={`${styles.panel} ${isDetailsPanelOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Vessel Details</h3>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close panel">
          <X size={18} />
        </button>
      </div>
      <div className={styles.content}>
        {selectedVessel ? (
          <VesselDetails vessel={selectedVessel} />
        ) : (
          <div className={styles.empty}>Select a vessel on the map</div>
        )}
      </div>
    </div>
  );
}
