import { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Thermometer, Wind, Waves, Navigation, CloudRain, AlertTriangle } from 'lucide-react';
import useSimStore from '../../state/simStore';
import useVesselStore from '../../state/vesselStore';
import { mockEnvironment, weatherIcons } from '../../mock/environment';
import styles from './SimulationPanel.module.css';

export default function SimulationPanel() {
  const { simulatedHours, isSimulating, simulationSpeed, incrementHours, resetSimulation, toggleSimulating, setSimulationSpeed } = useSimStore();
  const { primaryVessel, nearbyVessels } = useVesselStore();
  const intervalRef = useRef(null);

  if (!isSimulating) return null;

  useEffect(() => {
    if (isSimulating) {
      intervalRef.current = setInterval(() => {
        incrementHours();
      }, 1000 / simulationSpeed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSimulating, simulationSpeed, incrementHours]);

  const currentEnv = mockEnvironment.primary;
  const forecast = mockEnvironment.forecast.find(f => f.hours === Math.round(simulatedHours)) || mockEnvironment.forecast[Math.min(Math.floor(simulatedHours), mockEnvironment.forecast.length - 1)] || mockEnvironment.forecast[mockEnvironment.forecast.length - 1];
  
  const adjacentShips = nearbyVessels.slice(0, 5);
  
  const generateSimAlerts = () => {
    const alerts = [];
    if (simulatedHours >= 4 && forecast && forecast.waves > 3) {
      alerts.push({ severity: 'medium', title: 'Increasing Wave Heights', message: `Wave heights expected to reach ${forecast.waves.toFixed(1)}m in ${Math.max(0, 6 - simulatedHours).toFixed(1)} hours.` });
    }
    if (simulatedHours >= 5 && forecast && forecast.wind > 25) {
      alerts.push({ severity: 'high', title: 'Strong Winds Forecast', message: `Sustained winds of ${forecast.wind.toFixed(0)} knots expected. Consider reducing speed.` });
    }
    if (simulatedHours >= 3) {
      alerts.push({ severity: 'low', title: 'Route Deviation Detected', message: '3 vessels within 5nm have altered course. Monitor traffic density.' });
    }
    return alerts;
  };
  
  const simAlerts = generateSimAlerts();

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Clock size={18} className={styles.icon} />
          <h3 className={styles.title}>Simulation</h3>
        </div>
        <div className={styles.timeDisplay}>
          T+{simulatedHours.toFixed(1)}h / 12h
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.controls}>
          <button className={styles.btn} onClick={toggleSimulating} aria-label={isSimulating ? 'Pause' : 'Play'}>
            {isSimulating ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button className={styles.btn} onClick={resetSimulation} aria-label="Reset">
            <RotateCcw size={18} />
          </button>
          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>Speed: {simulationSpeed}x</label>
            <input
              type="range"
              min="1"
              max="10"
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${(simulatedHours / 12) * 100}%` }} />
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Current Conditions</h4>
        <div className={styles.grid}>
          <div className={styles.card}>
            <Thermometer size={14} />
            <span className={styles.label}>Sea Temp</span>
            <span className={styles.value}>{currentEnv.seaSurfaceTemp}°C</span>
          </div>
          <div className={styles.card}>
            <Navigation size={14} />
            <span className={styles.label}>Current</span>
            <span className={styles.value}>{currentEnv.currentSpeed} kn</span>
          </div>
          <div className={styles.card}>
            <Wind size={14} />
            <span className={styles.label}>Wind</span>
            <span className={styles.value}>{currentEnv.windSpeed} kn</span>
          </div>
          <div className={styles.card}>
            <Waves size={14} />
            <span className={styles.label}>Waves</span>
            <span className={styles.value}>{currentEnv.waveHeight.toFixed(1)} m</span>
          </div>
          <div className={styles.card}>
            <CloudRain size={14} />
            <span className={styles.label}>Weather</span>
            <span className={styles.value}>{weatherIcons[currentEnv.weather] || currentEnv.weather}</span>
          </div>
          <div className={styles.card}>
            <span className={styles.label}>Visibility</span>
            <span className={styles.value}>{currentEnv.visibility} km</span>
          </div>
        </div>
      </div>

      {simulatedHours > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Forecast at T+{simulatedHours.toFixed(1)}h</h4>
          <div className={styles.grid}>
            <div className={styles.card}>
              <Thermometer size={14} />
              <span className={styles.label}>Temp</span>
              <span className={styles.value}>{forecast.temp.toFixed(1)}°C</span>
            </div>
            <div className={styles.card}>
              <Wind size={14} />
              <span className={styles.label}>Wind</span>
              <span className={styles.value}>{forecast.wind.toFixed(0)} kn</span>
            </div>
            <div className={styles.card}>
              <Waves size={14} />
              <span className={styles.label}>Waves</span>
              <span className={styles.value}>{forecast.waves.toFixed(1)} m</span>
            </div>
            <div className={styles.card}>
              <CloudRain size={14} />
              <span className={styles.label}>Weather</span>
              <span className={styles.value}>{weatherIcons[forecast.weather] || forecast.weather}</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Adjacent Ships ({adjacentShips.length})</h4>
        <div className={styles.list}>
          {adjacentShips.map((ship) => (
            <div key={ship.id} className={styles.listItem}>
              <span className={styles.shipName}>{ship.name}</span>
              <span className={styles.shipMeta}>{ship.type} · {ship.speed.toFixed(1)} kn</span>
            </div>
          ))}
        </div>
      </div>

      {simAlerts.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Simulation Alerts</h4>
          <div className={styles.list}>
            {simAlerts.map((alert, idx) => (
              <div key={idx} className={styles.alertItem}>
                <AlertTriangle size={14} className={alert.severity === 'high' ? styles.warning : ''} />
                <div>
                  <div className={styles.alertTitle}>{alert.title}</div>
                  <div className={styles.alertMsg}>{alert.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
