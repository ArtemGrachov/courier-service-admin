import { useEffect, useRef, type ComponentType } from 'react';
import { Box } from '@mui/material';
import L from 'leaflet';

import type { IOrder } from '~/types/models/order';
import type { IGeoPos } from '~/types/models/geo-pos';

import 'leaflet/dist/leaflet.css';

interface IProps {
  orders?: IOrder[];
}

interface IMarkerData {
  key: string;
  location: IGeoPos;
}

interface IMarker {
  lMarker: L.Marker;
  key: string | number;
}

const Map: ComponentType<IProps> = ({ orders }) => {
  const mapRef = useRef<HTMLElement | null>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<Record<string | number, IMarker>>({});

  useEffect(() => {
    renderMarkers();
  }, [orders]);

  const renderMarkers = () => {
    if (!map.current) {
      return;
    }

    const mrkrs = markers.current;

    const markersData = orders?.reduce((acc, curr) => {
      const { senderGeoPos, receiverGeoPos, courier } = curr;

      if (senderGeoPos) {
        acc.push({
          key: `sender_${curr.id}`,
          location: senderGeoPos,
        });
      }

      if (receiverGeoPos) {
        acc.push({
          key: `receiver_${curr.id}`,
          location: receiverGeoPos,
        });
      }

      if (courier?.location) {
        acc.push({
          key: `courier_${courier.id}`,
          location: courier.location,
        });
      }

      return acc;
    }, [] as IMarkerData[]);

    markersData?.forEach(markerData => {
      let marker = mrkrs[markerData.key];

      if (mrkrs[markerData.key]) {
        marker.lMarker.setLatLng([markerData.location.lat, markerData.location.lng]);
        return;
      }

      marker = {
        key: markerData.key,
        lMarker: L.marker([markerData.location.lat, markerData.location.lng]).addTo(map.current!)
      };


      mrkrs[markerData.key] = marker;
    });
  }

  const initMap = () => {
    if (map.current) {
      return;
    }

    map.current = L.map(mapRef.current!).setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.current);

    renderMarkers();
  }

  const destroyMap = () => {
    if (!map.current) {
      return;
    }

    map.current.remove();
    map.current = null;
    markers.current = {};
  }

  useEffect(() => {
    initMap();

    return () => destroyMap();
  }, []);

  return (
    <Box width="100%" height="100%" ref={mapRef} />
  )
}

export default Map;
