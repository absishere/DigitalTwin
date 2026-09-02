export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatCoordinate(value, positive, negative) {
  const num = Math.abs(value).toFixed(4);
  return `${num}° ${value >= 0 ? positive : negative}`;
}

export function formatLat(lat) {
  return formatCoordinate(lat, 'N', 'S');
}

export function formatLng(lng) {
  return formatCoordinate(lng, 'E', 'W');
}

export function formatSpeed(knots) {
  return `${Number(knots).toFixed(1)} kn`;
}

export function formatHeading(degrees) {
  return `${Math.round(degrees)}°`;
}

export function getCompassDirection(degrees) {
  const val = Math.floor((degrees / 22.5) + 0.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[(val % 16)];
}

export function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function getVesselTypeLabel(type) {
  const labels = {
    container: 'Container Ship',
    tanker: 'Tanker',
    passenger: 'Passenger',
    fishing: 'Fishing',
    tug: 'Tug',
    other: 'Other'
  };
  return labels[type] || 'Unknown';
}

export function getVesselTypeColor(type) {
  const colors = { 
    container: '#3b82f6', 
    tanker: '#f97316', 
    passenger: '#a855f7', 
    fishing: '#22c55e', 
    tug: '#6b7280', 
    other: '#94a3b8' 
  };
  return colors[type] || colors.other;
}

export function getRiskColor(risk) {
  const colors = { 
    low: '#22c55e', 
    medium: '#f59e0b', 
    high: '#ef4444' 
  };
  return colors[risk] || '#94a3b8';
}

export function getRiskLabel(risk) {
  return (risk || 'UNKNOWN').toUpperCase();
}

export function getStatusColor(status) {
  const colors = { 
    underway: '#22c55e', 
    anchored: '#f59e0b', 
    moored: '#3b82f6' 
  };
  return colors[status] || '#94a3b8';
}
