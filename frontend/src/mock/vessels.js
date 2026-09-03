export const primaryVessel = {
  id: 'v-primary',
  name: 'MV OCEAN STAR',
  type: 'container',
  imo: '9706906',
  mmsi: '419001234',
  lat: 18.0,
  lng: 71.0,
  speed: 14.2,
  heading: 247,
  course: 245,
  destination: 'ROTTERDAM',
  eta: '2026-09-18T18:42:00Z',
  status: 'underway',
  risk: 'medium',
  callSign: 'VTOC1',
  flag: 'India',
  flagCode: 'IN',
  draft: 12.5,
  length: 299,
  beam: 48.2,
  yearBuilt: 2018
};

const vesselNames = [
  'MV PACIFIC STAR', 'MT ARABIAN PEARL', 'FV KRISHNA', 'MV SEA BREEZE', 'MT DESERT LION',
  'SS HORIZON', 'MV AQUA', 'FV POSEIDON', 'MT OLYMPUS', 'MV STARLIGHT',
  'TUG TITAN', 'MV NAVIGATOR', 'MT VANGUARD', 'FV NEPTUNE', 'MV ENDEAVOUR',
  'MT EXPLORER', 'MV MARINER', 'FV DOLPHIN', 'MV VOYAGER', 'MT TRIDENT',
  'TUG HERCULES', 'MV ODYSSEY', 'MT PIONEER', 'FV SHARK', 'MV PHOENIX',
  'MT APEX', 'MV ZENITH', 'FV WHALE', 'MV SUMMIT', 'MT CREST',
  'TUG GOLIATH', 'MV PINNACLE', 'MT CROWN', 'FV ORCA', 'MV MAJESTY'
];
const types = ['container', 'tanker', 'passenger', 'fishing', 'tug', 'other'];
const statuses = ['underway', 'anchored', 'moored'];
const risks = ['low', 'medium', 'high'];
const destinations = ['Singapore', 'Dubai', 'Colombo', 'Chennai', 'Mumbai', 'Karachi', 'Muscat', 'Doha', 'Jeddah'];

export const mockVessels = vesselNames.map((name, i) => {
  // Deterministic fake randomness based on index
  const seed = i * 1337 + 42;
  const rand = (min, max) => min + ((seed * 9301 + 49297) % 233280 / 233280) * (max - min);
  
  let latOffset = 0;
  let lngOffset = 0;
  
  // Distribute vessels across distances
  if (i < 8) { 
    // Within ~5km
    latOffset = rand(-0.04, 0.04);
    lngOffset = rand(-0.04, 0.04);
  } else if (i < 23) { 
    // Within ~25km
    latOffset = rand(-0.22, 0.22);
    lngOffset = rand(-0.22, 0.22);
  } else { 
    // Within ~100km
    latOffset = rand(-0.9, 0.9);
    lngOffset = rand(-0.9, 0.9);
  }

  const type = types[Math.floor(rand(0, types.length))];
  const mmsi = '419' + Math.floor(rand(100000, 999999));
  const imo = '9' + Math.floor(rand(100000, 999999));
  
  return {
    id: `v-${i + 1}`,
    name,
    type,
    imo,
    mmsi,
    lat: 18.0 + latOffset,
    lng: 71.0 + lngOffset,
    speed: rand(0, 22),
    heading: rand(0, 360),
    course: rand(0, 360),
    destination: destinations[Math.floor(rand(0, destinations.length))],
    status: statuses[Math.floor(rand(0, statuses.length))],
    risk: risks[Math.floor(rand(0, risks.length))],
    callSign: 'C' + Math.floor(rand(1000, 9999)),
    flag: 'India',
    draft: rand(4, 15),
    length: rand(20, 300),
    beam: rand(5, 50)
  };
});
