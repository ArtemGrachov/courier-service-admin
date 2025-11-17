import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

import { MapModule } from './module/MapModule';
import type {
  IMarkerPopupClosePayload,
  IMarkerPopupOpenPayload,
} from './module/services/EventService';

import MapPopup from './MapPopup';

import type { IMarker, MarkerKey } from './types';
import type { IOrder } from '~/types/models/order';
import type { ICourier } from '~/types/models/courier';
import type { IGeoPos } from '~/types/models/geo-pos';

import './Map.scss';

interface IProps {
  orders?: IOrder[];
  couriers?: ICourier[];
  showPopupOrderData?: boolean;
  center?: IGeoPos;
}

const Map: ComponentType<IProps> = ({ orders, couriers, center, showPopupOrderData }) => {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLElement | null>(null);
  const [markerPopups, setMarkerPopups] = useState<Array<MarkerKey>>([]);
  const theme = useTheme();
  const mapModule = useRef<MapModule>(null);
  const markersRef = useRef<Record<MarkerKey, IMarker>>({});

  const initMap = useCallback(() => {
    const mModule = MapModule.createModule();
    mModule.init(mapRef.current!, center);

    mModule.updateCouriers(couriers ?? []);
    mModule.updateOrders(orders ?? []);

    if (!center) {
      mModule.scaleToMarkers({
        maxZoom: 14,
      });
    }

    const markerPopupOpenCallback = ({ marker }: IMarkerPopupOpenPayload) => {
      markersRef.current[marker.key] = marker;
      setMarkerPopups(v => Array.from(new Set([...v, marker.key])));
    }

    const markerPopupCloseCallback = ({ marker }: IMarkerPopupClosePayload) => {
      setMarkerPopups(v => v.filter(key => key !== marker.key));
    }

    mModule.eventEmitter.on('markerPopupOpen', markerPopupOpenCallback);
    mModule.eventEmitter.on('markerPopupClose', markerPopupCloseCallback);

    mapModule.current = mModule;

    return () => {
      mModule.eventEmitter.off('markerPopupOpen', markerPopupOpenCallback);
      mModule.eventEmitter.off('markerPopupClose', markerPopupCloseCallback);

      mapModule.current = null;
      mModule?.destroy();
    }
  }, []);

  useEffect(() => {
    return initMap();
  }, []);

  useEffect(() => {
    mapModule.current?.updateCouriers(couriers ?? []);
    mapModule.current?.updateOrders(orders ?? []);
  }, [orders, couriers]);

  const paperBg = useMemo(() => {
    return (theme.vars || theme).palette.background.paper;
  }, [theme]);

  const closeAllPopups = () => {
    mapModule.current?.closeAllPopups();
  }

  const markerPopupEls = useMemo(() => {
    return markerPopups.map(key => {
      const marker = markersRef.current[key];

      if (!marker) {
        return null;
      }

      return (
        <MapPopup
          key={marker.key}
          markerItem={marker}
          showOrderData={showPopupOrderData}
        />
      )
    }).filter(mP => !!mP);
  }, [markerPopups]);

  return (
    <Box width="100%" height="100%" sx={{ '--leaflet-popup-tip-background': paperBg }}>
      {markerPopupEls}
      <Box width="100%" height="100%" ref={mapRef} />
      {markerPopups.length ? <Tooltip title={t('map.close_all_windows')}>
        <Fab
          color="info"
          sx={{ position: 'absolute', zIndex: 1300, right: 24, bottom: 24 }}
          onClick={closeAllPopups}
        >
          <CloseIcon />
        </Fab>
      </Tooltip> : null}
    </Box>
  )
}

export default Map;
