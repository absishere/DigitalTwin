import { useMemo } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { getVesselTypeColor, getRiskColor, formatSpeed } from '../../utils/geo';

export default function VesselMarker({ vessel, isPrimary, isSelected, onClick }) {
  // Create a custom DivIcon with an SVG ship shape
  // The ship SVG should be a simple arrow/chevron pointing UP by default
  // Apply CSS transform rotate(heading deg) to point in vessel's heading direction
  // Color the ship fill by vessel type using getVesselTypeColor(vessel.type)
  // Show a small risk dot (3px circle) at the bottom using getRiskColor(vessel.risk)
  // If isPrimary: make it larger (32x32 vs 24x24), add a pulsing ring animation, use white/bright color
  // If isSelected: add a highlight ring
  // Tooltip on hover: vessel name + speed
  
  const icon = useMemo(() => {
    const size = isPrimary ? 36 : 22;
    const color = isPrimary ? '#00b4d8' : getVesselTypeColor(vessel.type);
    const riskColor = getRiskColor(vessel.risk);
    const selectedRing = isSelected ? `<circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1}" fill="none" stroke="#00b4d8" stroke-width="2" opacity="0.8"/>` : '';
    const pulseRing = isPrimary ? `<div style="position:absolute;top:50%;left:50%;width:${size}px;height:${size}px;transform:translate(-50%,-50%);border-radius:50%;border:2px solid #00b4d8;animation:pulse-ring 2s ease-out infinite;"></div>` : '';
    
    // Ship SVG - hull shape pointing UP by default
    const html = `
      <div style="width:${size}px;height:${size}px;position:relative;transform:rotate(${vessel.heading || 0}deg);transition:transform 0.3s ease;">
        ${pulseRing}
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          ${selectedRing ? `<circle cx="12" cy="12" r="11" fill="none" stroke="#00b4d8" stroke-width="1.5" opacity="0.6"/>` : ''}
          <path d="M12 2 L8 8 L6 18 L10 22 L14 22 L18 18 L16 8 Z" fill="${color}" stroke="${isPrimary ? '#fff' : 'rgba(0,0,0,0.3)'}" stroke-width="${isPrimary ? 1.5 : 0.8}" stroke-linejoin="round"/>
          <circle cx="12" cy="20" r="2" fill="${riskColor}"/>
        </svg>
      </div>
    `;
    
    return L.divIcon({
      html,
      className: 'vessel-marker',  // empty class to avoid leaflet default
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }, [vessel.heading, vessel.type, vessel.risk, isPrimary, isSelected]);
  
  return (
    <Marker
      position={[vessel.lat, vessel.lng]}
      icon={icon}
      eventHandlers={{ click: () => onClick && onClick(vessel) }}
      zIndexOffset={isPrimary ? 1000 : isSelected ? 500 : 0}
    >
      <Tooltip direction="top" offset={[0, -14]}>
        <div style={{ fontWeight: isPrimary ? 700 : 500, fontSize: '12px' }}>
          {isPrimary ? '⚓ ' : ''}{vessel.name}
        </div>
        <div style={{ fontSize: '11px', color: '#8899b0' }}>
          {formatSpeed(vessel.speed)} · {vessel.heading}°
        </div>
      </Tooltip>
    </Marker>
  );
}
