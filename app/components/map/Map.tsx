import { useEffect, useRef, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import L from 'leaflet';

import type { IOrder } from '~/types/models/order';
import type { IGeoPos } from '~/types/models/geo-pos';

import 'leaflet/dist/leaflet.css';

import srcIconSender from '~/assets/icons/map/sender.svg';
import srcIconReceiver from '~/assets/icons/map/receiver.svg';
import srcIconCourier from '~/assets/icons/map/courier.svg';

interface IProps {
  orders?: IOrder[];
}

const enum EMarkerTypes {
  SENDER,
  RECEIVER,
  COURIER,
}

interface IMarkerData {
  key: string;
  location: IGeoPos;
  type: EMarkerTypes;
}

interface IMarker {
  lMarker: L.Marker;
  key: string | number;
}

const ICONS = {
  SENDER: L.icon({
    iconUrl: srcIconSender,
    iconSize: [42, 42],
  }),
  RECEIVER: L.icon({
    iconUrl: srcIconReceiver,
    iconSize: [42, 42],
  }),
  COURIER: L.icon({
    iconUrl: srcIconCourier,
    iconSize: [42, 42],
  }),
};

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
          type: EMarkerTypes.SENDER,
        });
      }

      if (receiverGeoPos) {
        acc.push({
          key: `receiver_${curr.id}`,
          location: receiverGeoPos,
          type: EMarkerTypes.RECEIVER,
        });
      }

      if (courier?.location) {
        acc.push({
          key: `courier_${courier.id}`,
          location: courier.location,
          type: EMarkerTypes.COURIER,
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

      let icon;

      switch (markerData.type) {
        case EMarkerTypes.SENDER: {
          icon = ICONS.SENDER;
          break;
        }
        case EMarkerTypes.RECEIVER: {
          icon = ICONS.RECEIVER;
          break;
        }
        case EMarkerTypes.COURIER: {
          icon = ICONS.COURIER;
          break;
        }
      }

      marker = {
        key: markerData.key,
        lMarker: L.marker(
          [markerData.location.lat, markerData.location.lng],
          {
            icon,
          },
        ).addTo(map.current!)
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
