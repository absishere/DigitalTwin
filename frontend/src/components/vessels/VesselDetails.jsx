import { Navigation, MapPin, AlertTriangle } from 'lucide-react';
import useVesselStore from '../../state/vesselStore';
import { formatLat, formatLng, formatSpeed, formatHeading, getCompassDirection, getVesselTypeLabel, getVesselTypeColor, getRiskColor, getRiskLabel, getStatusColor, haversineDistance, formatDistance } from '../../utils/geo';
import styles from './VesselDetails.module.css';

export default function VesselDetails({ vessel }) {
  const { primaryVessel } = useVesselStore();
  const isPrimary = vessel.id === primaryVessel?.id;
  const distance = !isPrimary && primaryVessel
    ? haversineDistance(primaryVessel.lat, primaryVessel.lng, vessel.lat, vessel.lng)
    : null;
  
  const typeColor = getVesselTypeColor(vessel.type);
  const riskColor = getRiskColor(vessel.risk);
  const statusColor = getStatusColor(vessel.status);
  
  return (
    <div className={styles.details}>
      {/* Vessel identity header */}
      <div className={styles.header}>
        <div className={styles.vesselIcon} style={{ borderColor: typeColor }}>
          <Navigation size={24} style={{ color: typeColor, transform: `rotate(${vessel.heading}deg)` }} />
        </div>
        <div className={styles.identity}>
          {isPrimary && <span className={styles.yourVessel}>YOUR VESSEL</span>}
          <h2 className={styles.name}>{vessel.name}</h2>
          <span className={styles.type} style={{ color: typeColor }}>{getVesselTypeLabel(vessel.type)}</span>
        </div>
      </div>
      
      {/* Status badge */}
      <div className={styles.statusBadge} style={{ borderColor: statusColor }}>
        <span className={styles.statusDot} style={{ background: statusColor }} />
        <span>{vessel.status?.toUpperCase()}</span>
      </div>
      
      {/* Key stats */}
      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Speed</span>
          <span className={styles.statValue}>{formatSpeed(vessel.speed)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Heading</span>
          <span className={styles.statValue}>{formatHeading(vessel.heading)} {getCompassDirection(vessel.heading)}</span>
        </div>
        {distance !== null && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>Distance</span>
            <span className={styles.statValue}>{formatDistance(distance)}</span>
          </div>
        )}
        <div className={styles.stat}>
          <span className={styles.statLabel}>Course</span>
          <span className={styles.statValue}>{formatHeading(vessel.course)}</span>
        </div>
      </div>
      
      {/* Detailed info */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Position</h4>
        <div className={styles.infoRow}>
          <MapPin size={14} />
          <span>{formatLat(vessel.lat)}, {formatLng(vessel.lng)}</span>
        </div>
      </div>
      
      {isPrimary && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Identifiers</h4>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>IMO</span>
              <span className={styles.infoValue}>{vessel.imo}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>MMSI</span>
              <span className={styles.infoValue}>{vessel.mmsi}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Call Sign</span>
              <span className={styles.infoValue}>{vessel.callSign}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Flag</span>
              <span className={styles.infoValue}>{vessel.flag}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Voyage</h4>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Destination</span>
            <span className={styles.infoValue}>{vessel.destination || 'N/A'}</span>
          </div>
          {vessel.eta && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>ETA</span>
              <span className={styles.infoValue}>{new Date(vessel.eta).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>
      </div>
      
      {isPrimary && vessel.length && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Vessel Dimensions</h4>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Length</span>
              <span className={styles.infoValue}>{vessel.length} m</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Beam</span>
              <span className={styles.infoValue}>{vessel.beam} m</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Draft</span>
              <span className={styles.infoValue}>{vessel.draft} m</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Risk */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Risk Assessment</h4>
        <div className={styles.riskBadge} style={{ background: `${riskColor}15`, borderColor: `${riskColor}40` }}>
          <AlertTriangle size={16} style={{ color: riskColor }} />
          <span style={{ color: riskColor, fontWeight: 600 }}>{getRiskLabel(vessel.risk)}</span>
        </div>
      </div>
      
      {/* Mock marine conditions */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Marine Conditions</h4>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Waves</span>
            <span className={styles.infoValue}>2.4 m</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Wind</span>
            <span className={styles.infoValue}>18 kn</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Temperature</span>
            <span className={styles.infoValue}>27°C</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Visibility</span>
            <span className={styles.infoValue}>12 km</span>
          </div>
        </div>
      </div>
    </div>
  );
}
