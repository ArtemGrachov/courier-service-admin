import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import L from 'leaflet';

import CourierCard from '~/components/couriers/CourierCard';
import ClientCard from '~/components/clients/ClientCard';

import type { IOrder } from '~/types/models/order';
import type { IGeoPos } from '~/types/models/geo-pos';
import type { IClient } from '~/types/models/client';
import type { ICourier } from '~/types/models/courier';

import 'leaflet/dist/leaflet.css';

import srcIconSender from '~/assets/icons/map/sender.svg';
import srcIconReceiver from '~/assets/icons/map/receiver.svg';
import srcIconCourier from '~/assets/icons/map/courier.svg';
import { useTheme } from '@mui/material';

interface IProps {
  orders?: IOrder[];
}

const enum EMarkerTypes {
  SENDER,
  RECEIVER,
  COURIER,
}

interface IMarkerData<T> {
  key: string;
  location: IGeoPos;
  type: EMarkerTypes;
  data: T;
}

interface IMarkerDataSender extends IMarkerData<IClient> { }

interface IMarkerDataReceiver extends IMarkerData<IClient> { }

interface IMarkerDataCourier extends IMarkerData<ICourier> { }

type MarkerData = IMarkerDataSender | IMarkerDataReceiver | IMarkerDataCourier;

type MarkerKey = string;

interface IMarker {
  lMarker: L.Marker;
  key: MarkerKey;
  data: MarkerData;
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
  const markers = useRef<Record<MarkerKey, IMarker>>({});
  const [markerPopups, setMarkerPopups] = useState<Array<string>>([]);
  const theme = useTheme();

  const paperBg = useMemo(() => {
    return (theme.vars || theme).palette.background.paper;
  }, [theme]);

  useEffect(() => {
    renderMarkers();
  }, [orders]);

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

  const markerClickHandler = ({ lMarker, data }: IMarker) => {
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
      .setContent(`<div id="popup_${data.key}"></div>`)
      .openOn(map.current!)
      .addEventListener('remove', () => {
        setMarkerPopups(v => {
          return v.filter(k => k !== data.key);
        });
      });

    setMarkerPopups(v => {
      return Array.from(new Set([...v, data.key]));
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
        const markerData = markers.current[markerKey];

        if (!markerData) {
          return null;
        }

        let el;

        switch (markerData.data.type) {
          case EMarkerTypes.SENDER: {
            el = <ClientCard client={markerData.data.data as IClient} isSender={true} />
            break;
          }
          case EMarkerTypes.RECEIVER: {
            el = <ClientCard client={markerData.data.data as IClient} isReceiver={true} />
            break;
          }
          case EMarkerTypes.COURIER: {
            el = <CourierCard courier={markerData.data.data as ICourier} />
            break;
          }
        }

        return (
          <Portal key={markerKey} container={() => document.getElementById(`popup_${markerKey}`)}>
            {el}
          </Portal>
        )
      })}
      <Box width="100%" height="100%" ref={mapRef} />
    </Box>
  )
}

export default Map;
