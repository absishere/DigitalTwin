import { Target } from 'lucide-react';
import useVesselStore from '../../state/vesselStore';
import styles from './RadiusControl.module.css';

const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

export default function RadiusControl() {
  const { selectedRadius, setRadius } = useVesselStore();
  
  return (
    <div className={styles.container}>
      <div className={styles.label}>
        <Target size={14} />
        <span>Range</span>
      </div>
      <div className={styles.options}>
        {RADIUS_OPTIONS.map((r) => (
          <button
            key={r}
            className={`${styles.option} ${selectedRadius === r ? styles.active : ''}`}
            onClick={() => setRadius(r)}
            aria-label={`Set radius to ${r} km`}
          >
            {r}
          </button>
        ))}
      </div>
      <span className={styles.unit}>km</span>
    </div>
  );
}
