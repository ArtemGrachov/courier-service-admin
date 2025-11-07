import { lazy, type ComponentType } from 'react';

import { EMarkerTypes } from './constants';

import type { IMarker } from './types';
import type { IClient } from '~/types/models/client';
import type { ICourier } from '~/types/models/courier';

import { popupPortalName } from './utils';
import { Portal } from '@mui/material';

const ClientCard = lazy(() => import('~/components/clients/ClientCard'));
const CourierCard = lazy(() => import('~/components/couriers/CourierCard'));
const OrderCard = lazy(() => import('~/components/orders/OrderCard'));

interface IProps {
  markerItem: IMarker;
  showOrderData?: boolean;
}

const MapPopup: ComponentType<IProps> = ({ markerItem, showOrderData }) => {
  let el;

  const { key, data: { data, order } } = markerItem;

  switch (markerItem.data.type) {
    case EMarkerTypes.SENDER: {
      el = <ClientCard client={data as IClient} isSender={true} />
      break;
    }
    case EMarkerTypes.RECEIVER: {
      el = <ClientCard client={data as IClient} isReceiver={true} />
      break;
    }
    case EMarkerTypes.COURIER: {
      el = <CourierCard courier={data as ICourier} />
      break;
    }
  }

  return (
    <Portal container={() => document.getElementById(popupPortalName(key))}>
      {showOrderData && order ? <OrderCard order={order} /> : null}
      {el}
    </Portal>
  )
}

export default MapPopup;
