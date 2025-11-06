import { useEffect, useRef, useState, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import L from 'leaflet';

import type { IOrder } from '~/types/models/order';
import type { IGeoPos } from '~/types/models/geo-pos';
import type { IClient } from '~/types/models/client';
import type { ICourier } from '~/types/models/courier';

import 'leaflet/dist/leaflet.css';

import srcIconSender from '~/assets/icons/map/sender.svg';
import srcIconReceiver from '~/assets/icons/map/receiver.svg';
import srcIconCourier from '~/assets/icons/map/courier.svg';
import CourierCard from '~/components/couriers/CourierCard';
import ClientCard from '~/components/clients/ClientCard';

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

      if (senderGeoPos && curr.sender) {
        acc.push({
          key: `sender_${curr.id}`,
          location: senderGeoPos,
          type: EMarkerTypes.SENDER,
          data: curr.sender,
        });
      }

      if (receiverGeoPos && curr.receiver) {
        acc.push({
          key: `receiver_${curr.id}`,
          location: receiverGeoPos,
          type: EMarkerTypes.RECEIVER,
          data: curr.receiver,
        });
      }

      if (courier?.location) {
        acc.push({
          key: `courier_${courier.id}`,
          location: courier.location,
          type: EMarkerTypes.COURIER,
          data: courier,
        });
      }

      return acc;
    }, [] as MarkerData[]);

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

      const lMarker = L.marker(
        [markerData.location.lat, markerData.location.lng],
        { icon },
      )
        .addTo(map.current!)
        .addEventListener('click', () => {
          setMarkerPopups(v => {
            return Array.from(new Set([...v, markerData.key]));
          });
        });

      marker = {
        key: markerData.key,
        data: markerData,
        lMarker,
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
    <>
      <div style={{ position: 'absolute', zIndex: 1000 }}>
        {markerPopups.map(markerKey => {
          const markerData = markers.current[markerKey];

          if (!markerData) {
            return null;
          }

          switch (markerData.data.type) {
            case EMarkerTypes.SENDER: {
              return <ClientCard client={markerData.data.data as IClient} isSender={true} />
            }
            case EMarkerTypes.RECEIVER: {
              return <ClientCard client={markerData.data.data as IClient} isReceiver={true} />
            }
            case EMarkerTypes.COURIER: {
              return <CourierCard courier={markerData.data.data as ICourier} />
            }
          }
        })}
      </div>
      {/* <div id="portal-test" style={{ background: 'red'}}></div> */}
      <Box width="100%" height="100%" ref={mapRef} />
      {/* <Portal container={() => document.getElementById('portal-test')}>
        <div>
          test
        </div>
      </Portal> */}
    </>
  )
}

export default Map;
