import { useMemo } from 'react';
import { Polyline } from 'react-leaflet';
import useVesselStore from '../../state/vesselStore';
import useSimStore from '../../state/simStore';
import { getRouteWaypoints } from '../../mock/routes';

const ROUTE_COLOR = '#00b4d8';

export default function RouteLine() {
  const primaryVessel = useVesselStore((s) => s.primaryVessel);
  const { simulatedHours } = useSimStore();
  
  const positions = useMemo(() => {
    if (!primaryVessel) return [];
    const route = getRouteWaypoints(primaryVessel.destination);
    if (!route || route.length < 2) return [];
    
    const fullRoute = [route[0], ...route.slice(1)];
    
    if (simulatedHours <= 0) return fullRoute;
    
    const totalSegments = fullRoute.length - 1;
    const fraction = Math.min(simulatedHours / 12, 1);
    const targetIndex = Math.floor(fraction * totalSegments);
    const segmentFraction = (fraction * totalSegments) - targetIndex;
    
    if (targetIndex >= totalSegments) return fullRoute;
    
    const start = fullRoute[targetIndex];
    const end = fullRoute[targetIndex + 1];
    const interpolated = [
      start[0] + (end[0] - start[0]) * segmentFraction,
      start[1] + (end[1] - start[1]) * segmentFraction,
    ];
    
    return [...fullRoute.slice(0, targetIndex + 1), interpolated];
  }, [primaryVessel, simulatedHours]);
  
  if (positions.length < 2) return null;
  
  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: ROUTE_COLOR,
        weight: 2,
        opacity: 0.5,
        dashArray: '8 6',
      }}
    />
  );
}
