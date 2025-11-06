import { lazy, type ComponentType } from 'react';

import { EMarkerTypes } from './constants';

import type { IMarker } from './types';
import type { IClient } from '~/types/models/client';
import type { ICourier } from '~/types/models/courier';

import { popupPortalName } from './utils';
import { Portal } from '@mui/material';

const ClientCard = lazy(() => import('~/components/clients/ClientCard'));
const CourierCard = lazy(() => import('~/components/couriers/CourierCard'));

interface IProps {
  markerItem: IMarker
}

const MapPopup: ComponentType<IProps> = ({ markerItem }) => {
  let el;

  const markerKey = markerItem.key;

  switch (markerItem.data.type) {
    case EMarkerTypes.SENDER: {
      el = <ClientCard client={markerItem.data.data as IClient} isSender={true} />
      break;
    }
    case EMarkerTypes.RECEIVER: {
      el = <ClientCard client={markerItem.data.data as IClient} isReceiver={true} />
      break;
    }
    case EMarkerTypes.COURIER: {
      el = <CourierCard courier={markerItem.data.data as ICourier} />
      break;
    }
  }

  return (
    <Portal container={() => document.getElementById(popupPortalName(markerKey))}>
      {el}
    </Portal>
  )
}

export default MapPopup;
