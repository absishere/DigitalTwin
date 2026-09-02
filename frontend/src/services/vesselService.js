import { primaryVessel, mockVessels } from '../mock/vessels';
import { mockPorts } from '../mock/ports';
import { haversineDistance } from '../utils/geo';

const delay = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

export async function getPrimaryVessel() {
  await delay();
  return primaryVessel;
}

export async function getNearbyVessels(lat, lng, radiusKm) {
  await delay();
  return mockVessels.filter(v => {
    if (v.id === primaryVessel.id) return false;
    const dist = haversineDistance(lat, lng, v.lat, v.lng);
    return dist <= radiusKm;
  });
}

export async function searchVessels(query) {
  await delay();
  if (!query) {
    return { vessels: [], ports: [] };
  }
  
  const lowerQuery = query.toLowerCase();
  
  const allVessels = [primaryVessel, ...mockVessels];
  const matchedVessels = allVessels.filter(v => 
    v.name.toLowerCase().includes(lowerQuery) || 
    (v.imo && v.imo.toString().includes(lowerQuery)) ||
    (v.mmsi && v.mmsi.toString().includes(lowerQuery))
  );
  
  const matchedPorts = mockPorts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.code.toLowerCase().includes(lowerQuery)
  );
  
  return { vessels: matchedVessels, ports: matchedPorts };
}

export async function getVesselById(id) {
  await delay();
  if (primaryVessel.id === id) return primaryVessel;
  return mockVessels.find(v => v.id === id) || null;
}
