import { useEffect, useRef, type ComponentType } from 'react';
import { Box } from '@mui/material';
import L from 'leaflet';

import type { IOrder } from '~/types/models/order';

import 'leaflet/dist/leaflet.css';

interface IProps {
  orders?: IOrder[];
}

const Map: ComponentType<IProps> = ({ orders }) => {
  const mapRef = useRef<HTMLElement | null>(null);
  const map = useRef<L.Map | null>(null);

  const initMap = () => {
    if (map.current) {
      return;
    }

    map.current = L.map(mapRef.current!).setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.current);

    const senderMarkers = orders?.map(order => {
      return L.marker([order.senderGeoPos.lat, order.senderGeoPos.lng]);
    });

    const receiverMarkers = orders?.map(order => {
      return L.marker([order.receiverGeoPos.lat, order.receiverGeoPos.lng]);
    });

    senderMarkers?.forEach(marker => {
      marker.addTo(map.current!);
    });

    receiverMarkers?.forEach(marker => {
      marker.addTo(map.current!);
    });
  }

  const destroyMap = () => {
    if (!map.current) {
      return;
    }

    map.current.remove();
    map.current = null;
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
