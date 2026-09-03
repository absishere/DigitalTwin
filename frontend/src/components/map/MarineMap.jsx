import { useEffect, useRef, memo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import VesselLayer from './VesselLayer';
import MapControls from './MapControls';
import RouteLine from './RouteLine';
import LayerControl from './LayerControl';
import useMapStore from '../../state/mapStore';
import useVesselStore from '../../state/vesselStore';
import styles from './MarineMap.module.css';

function MapController() {
  const map = useMap();
  const { recenterTrigger } = useMapStore();
  const primaryVessel = useVesselStore((s) => s.primaryVessel);
  const prevTrigger = useRef(recenterTrigger);
  
  useEffect(() => {
    if (recenterTrigger !== prevTrigger.current && primaryVessel) {
      map.flyTo([primaryVessel.lat, primaryVessel.lng], 12, { duration: 1 });
      prevTrigger.current = recenterTrigger;
    }
  }, [recenterTrigger, primaryVessel, map]);
  
  return null;
}

const MarineMap = memo(function MarineMap() {
  const { center, zoom } = useMapStore();
  
  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={center}
        zoom={zoom}
        className={styles.map}
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />
        <MapController />
        <VesselLayer />
        <MapControls />
        <RouteLine />
      </MapContainer>
      <LayerControl />
    </div>
  );
});

export default MarineMap;
