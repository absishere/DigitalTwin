import useLayerStore from '../../state/layerStore';
import useUIStore from '../../state/uiStore';
import styles from './LayerControl.module.css';

const LAYER_LABELS = {
  vessels: 'Vessels',
  ports: 'Ports',
  temperature: 'Temperature',
  waves: 'Waves',
  wind: 'Wind',
  currents: 'Currents',
  storms: 'Storms',
  precipitation: 'Precipitation',
  riskZones: 'Risk Zones',
};

export default function LayerControl() {
  const { layers, toggleLayer } = useLayerStore();
  const { isLayerControlOpen, closeLayerControl } = useUIStore();
  
  if (!isLayerControlOpen) return null;
  
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Map Layers</h3>
        <button className={styles.closeBtn} onClick={closeLayerControl} aria-label="Close layer control">
          <X size={18} />
        </button>
      </div>
      <div className={styles.list}>
        {Object.keys(LAYER_LABELS).map((key) => (
          <button
            key={key}
            className={`${styles.item} ${layers[key] ? styles.active : ''}`}
            onClick={() => toggleLayer(key)}
          >
            <span className={styles.checkbox}>
              {layers[key] && <CheckIcon />}
            </span>
            <span className={styles.label}>{LAYER_LABELS[key]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
