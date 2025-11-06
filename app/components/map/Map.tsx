import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import L from 'leaflet';

import { EMarkerTypes } from './constants';

import MapPopup from './MapPopup';

import type { IMarker, MarkerData, MarkerKey } from './types';
import type { IOrder } from '~/types/models/order';
import type { ICourier } from '~/types/models/courier';

import { popupPortalName } from '~/components/map/utils';

import 'leaflet/dist/leaflet.css';

import srcIconSender from '~/assets/icons/map/sender.svg';
import srcIconReceiver from '~/assets/icons/map/receiver.svg';
import srcIconCourier from '~/assets/icons/map/courier.svg';

interface IProps {
  orders?: IOrder[];
  couriers?: ICourier[];
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

const Map: ComponentType<IProps> = ({ orders, couriers }) => {
  const mapRef = useRef<HTMLElement | null>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<Record<MarkerKey, IMarker>>({});
  const markerPopupsActive = useRef<Record<string, boolean>>({});
  const [markerPopups, setMarkerPopups] = useState<Array<string>>([]);
  const theme = useTheme();

  const paperBg = useMemo(() => {
    return (theme.vars || theme).palette.background.paper;
  }, [theme]);

  useEffect(() => {
    renderMarkers();
  }, [orders]);

  const getCourierMarkerData = useCallback((courier: ICourier) => {
    if (!courier?.location) {
      return null;
    }

    return {
      key: `courier_${courier.id}`,
      location: courier.location,
      type: EMarkerTypes.COURIER,
      data: courier,
    };
  }, []);

  const getOrderMarkerData = useCallback((order: IOrder) => {
    const markersData: MarkerData[] = [];
    const { senderGeoPos, receiverGeoPos, courier } = order;

    if (senderGeoPos && order.sender) {
      markersData.push({
        key: `sender_${order.id}`,
        location: senderGeoPos,
        type: EMarkerTypes.SENDER,
        data: order.sender,
      });
    }

    if (receiverGeoPos && order.receiver) {
      markersData.push({
        key: `receiver_${order.id}`,
        location: receiverGeoPos,
        type: EMarkerTypes.RECEIVER,
        data: order.receiver,
      });
    }

    if (courier?.location) {
      markersData.push({
        key: `courier_${courier.id}`,
        location: courier.location,
        type: EMarkerTypes.COURIER,
        data: courier,
      });
    }

    return markersData;
  }, []);

  const createMarker = useCallback((markerData: MarkerData) => {
    const mrkrs = markers.current;
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

    const lMarker = L.marker(
      [markerData.location.lat, markerData.location.lng],
      { icon },
    )
      .addTo(map.current!)
      .addEventListener('click', () => markerClickHandler(marker));

    const marker = {
      key: markerData.key,
      data: markerData,
      lMarker,
    };

    mrkrs[markerData.key] = marker;
  }, []);

  const updateMarker = useCallback((marker: IMarker, markerData: MarkerData) => {
    marker.lMarker.setLatLng([
      markerData.location.lat,
      markerData.location.lng,
    ]);
  }, []);

  const renderMarker = useCallback((markerData: MarkerData) => {
    const mrkrs = markers.current;
    const marker = mrkrs[markerData.key];

    if (marker) {
      updateMarker(marker, markerData);
      return;
    }

    createMarker(markerData);
  }, []);

  const markerClickHandler = ({ lMarker, key }: IMarker) => {
    if (markerPopupsActive.current[key]) {
      return;
    }

    markerPopupsActive.current[key] = true;

    L
      .popup({
        closeOnClick: false,
        closeOnEscapeKey: false,
        autoClose: false,
        minWidth: 300,
        maxWidth: 1000,
        className: 'csa-map-popup',
      })
      .setLatLng(lMarker.getLatLng())
      .setContent(`<div id="${popupPortalName(key)}"></div>`)
      .openOn(map.current!)
      .addEventListener('remove', () => {
        markerPopupsActive.current[key] = false;

        setMarkerPopups(v => {
          return v.filter(k => k !== key);
        });
      });

    setMarkerPopups(v => {
      return Array.from(new Set([...v, key]));
    });
  }

  const renderMarkers = () => {
    if (!map.current) {
      return;
    }

    const markersData = orders?.reduce((acc, curr) => {
      acc.push(...getOrderMarkerData(curr));
      return acc;
    }, [] as MarkerData[]);

    markersData?.forEach(markerData => renderMarker(markerData));

    if (couriers) {
      const orderCouriersSet = new Set(orders?.map(o => o.courierId));

      const courierMarkers = couriers
        .filter(c => !orderCouriersSet.has(c.id))
        .map(c => getCourierMarkerData(c))

      courierMarkers
        .filter(mD => mD)
        .forEach(markerData => renderMarker(markerData!));
    }
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
    <Box width="100%" height="100%" sx={{ '--leaflet-popup-tip-background': paperBg }}>
      {markerPopups.map(markerKey => {
        const markerItem = markers.current[markerKey];

        if (!markerItem) {
          return null;
        }

        return <MapPopup key={markerKey} markerItem={markerItem} />
      })}
      <Box width="100%" height="100%" ref={mapRef} />
    </Box>
  )
}

export default Map;
