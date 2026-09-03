export const mockAlerts = [
  { 
    id: 'a1', 
    type: 'weather', 
    severity: 'high', 
    title: 'Severe Wave Conditions Ahead', 
    message: 'Wave heights of 5.8m detected on current route. Recommend reviewing heading and securing cargo.', 
    timestamp: '2026-09-02T18:00:00Z', 
    lat: 16.5, 
    lng: 68.2, 
    active: true 
  },
  { 
    id: 'a2', 
    type: 'wind', 
    severity: 'medium', 
    title: 'Strong Winds Detected', 
    message: 'Sustained winds of 35 knots with gusts up to 45 knots in your vicinity. Exercise caution.', 
    timestamp: '2026-09-02T19:00:00Z', 
    lat: 18.8, 
    lng: 72.5, 
    active: true 
  },
  { 
    id: 'a3', 
    type: 'traffic', 
    severity: 'low', 
    title: 'Heavy Traffic Area', 
    message: 'Approaching high-density traffic area near Mumbai port limits. Maintain sharp lookout.', 
    timestamp: '2026-09-02T19:15:00Z', 
    lat: 18.9, 
    lng: 72.8, 
    active: true 
  },
  { 
    id: 'a4', 
    type: 'route', 
    severity: 'medium', 
    title: 'Route Risk Increased', 
    message: 'Overall risk score for the planned route has increased to medium due to developing weather systems along the path.', 
    timestamp: '2026-09-02T17:30:00Z', 
    active: true 
  },
  { 
    id: 'a5', 
    type: 'info', 
    severity: 'low', 
    title: 'Route Conditions Improved', 
    message: 'Earlier localized squall has dissipated. Conditions returning to normal.', 
    timestamp: '2026-09-01T12:00:00Z', 
    active: false 
  }
];
