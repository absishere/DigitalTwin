import { useMap } from 'react-leaflet';
import { Plus, Minus, Crosshair, Maximize, Layers } from 'lucide-react';
import useMapStore from '../../state/mapStore';
import useUIStore from '../../state/uiStore';
import useVesselStore from '../../state/vesselStore';
import styles from './MapControls.module.css';

export default function MapControls() {
  const map = useMap();
  const { recenter } = useMapStore();
  const { toggleLayerControl } = useUIStore();
  const primaryVessel = useVesselStore(s => s.primaryVessel); // need this import
  
  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleRecenter = () => {
    if (primaryVessel) {
      map.flyTo([primaryVessel.lat, primaryVessel.lng], 12, { duration: 1 });
    }
    recenter();
  };
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  
  return (
    <div className={styles.controls}>
      <button className={styles.btn} onClick={handleZoomIn} title="Zoom in" aria-label="Zoom in">
        <Plus size={18} />
      </button>
      <button className={styles.btn} onClick={handleZoomOut} title="Zoom out" aria-label="Zoom out">
        <Minus size={18} />
      </button>
      <div className={styles.divider} />
      <button className={styles.btn} onClick={handleRecenter} title="Recenter on vessel" aria-label="Recenter on vessel">
        <Crosshair size={18} />
      </button>
      <button className={styles.btn} onClick={handleFullscreen} title="Fullscreen" aria-label="Toggle fullscreen">
        <Maximize size={18} />
      </button>
      <div className={styles.divider} />
      <button className={styles.btn} onClick={toggleLayerControl} title="Layers" aria-label="Toggle layers">
        <Layers size={18} />
      </button>
    </div>
  );
}
