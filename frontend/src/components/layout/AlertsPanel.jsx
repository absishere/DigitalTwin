import { X, AlertTriangle, MapPin } from 'lucide-react';
import useUIStore from '../../state/uiStore';
import useAlertStore from '../../state/alertStore';
import styles from './AlertsPanel.module.css';

export default function AlertsPanel() {
  const { isAlertsPanelOpen, closeAlertsPanel } = useUIStore();
  const { alerts } = useAlertStore();
  
  if (!isAlertsPanelOpen) return null;
  
  const severityColor = (severity) => {
    if (severity === 'high') return '#ef4444';
    if (severity === 'medium') return '#f59e0b';
    return '#3b82f6';
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Active Alerts ({alerts.length})</h3>
        <button className={styles.closeBtn} onClick={closeAlertsPanel} aria-label="Close alerts">
          <X size={18} />
        </button>
      </div>
      <div className={styles.list}>
        {alerts.length === 0 ? (
          <div className={styles.empty}>No active alerts</div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <AlertTriangle size={14} style={{ color: severityColor(alert.severity) }} />
                <span className={styles.itemTitle}>{alert.title}</span>
              </div>
              <p className={styles.itemMessage}>{alert.message}</p>
              <div className={styles.itemMeta}>
                <span className={styles.severity} style={{ color: severityColor(alert.severity) }}>
                  {alert.severity.toUpperCase()}
                </span>
                <span className={styles.time}>{formatTime(alert.timestamp)}</span>
                {alert.lat && alert.lng && (
                  <span className={styles.coords}>
                    <MapPin size={12} />
                    {alert.lat.toFixed(1)}°N, {alert.lng.toFixed(1)}°E
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
