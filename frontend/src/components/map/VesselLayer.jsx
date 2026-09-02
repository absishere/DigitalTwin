import { Circle } from 'react-leaflet';
import VesselMarker from './VesselMarker';
import useVesselStore, { simulateVesselPosition } from '../../state/vesselStore';
import useUIStore from '../../state/uiStore';
import useSimStore from '../../state/simStore';

export default function VesselLayer() {
  const { primaryVessel, nearbyVessels, selectedVessel, selectVessel, selectedRadius } = useVesselStore();
  const { openDetailsPanel } = useUIStore();
  const { simulatedHours } = useSimStore();
  
  const handleVesselClick = (vessel) => {
    selectVessel(vessel);
    openDetailsPanel();
  };
  
  if (!primaryVessel) return null;
  
  const displayPrimary = simulatedHours > 0 ? simulateVesselPosition(primaryVessel, simulatedHours) : primaryVessel;
  const displayNearby = simulatedHours > 0
    ? nearbyVessels.map(v => simulateVesselPosition(v, simulatedHours))
    : nearbyVessels;
  
  return (
    <>
      <Circle
        center={[displayPrimary.lat, displayPrimary.lng]}
        radius={selectedRadius * 1000}
        pathOptions={{
          color: '#00b4d8',
          weight: 1,
          opacity: 0.3,
          fillColor: '#00b4d8',
          fillOpacity: 0.03,
          dashArray: '6 4',
        }}
      />
      
      {displayNearby.map((vessel) => (
        <VesselMarker
          key={vessel.id}
          vessel={vessel}
          isPrimary={false}
          isSelected={selectedVessel?.id === vessel.id}
          onClick={handleVesselClick}
        />
      ))}
      
      <VesselMarker
        vessel={displayPrimary}
        isPrimary={true}
        isSelected={selectedVessel?.id === primaryVessel.id}
        onClick={handleVesselClick}
      />
    </>
  );
}
