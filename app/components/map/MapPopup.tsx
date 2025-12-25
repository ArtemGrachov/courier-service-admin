import { lazy, type ComponentType } from 'react';

import { EMarkerTypes } from './constants';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Portal from '@mui/material/Portal';
import Divider from '@mui/material/Divider';

import type { IMarker } from './types';
import type { IClient } from '~/types/models/client';
import type { ICourier } from '~/types/models/courier';

import { popupPortalName } from './utils';

const ClientPreview = lazy(() => import('~/components/clients/ClientPreview'));
const CourierPreview = lazy(() => import('~/components/couriers/CourierPreview'));
const OrderPreview = lazy(() => import('~/components/orders/OrderPreview'));

interface IProps {
  markerItem: IMarker;
  showOrderData?: boolean;
}

const MapPopup: ComponentType<IProps> = ({ markerItem, showOrderData }) => {
  let el;

  const { key, data: { type, data, order } } = markerItem;

  switch (type) {
    case EMarkerTypes.SENDER: {
      el = <ClientPreview client={data as IClient} address={order?.sender_address} isSender={true} />
      break;
    }
    case EMarkerTypes.RECEIVER: {
      el = <ClientPreview client={data as IClient} address={order?.receiver_address} isReceiver={true} />
      break;
    }
    case EMarkerTypes.COURIER: {
      el = <CourierPreview courier={data as ICourier} />
      break;
    }
  }

  return (
    <Portal container={() => document.getElementById(popupPortalName(key))}>
      <Card>
        <CardContent>
          {showOrderData && order ? (<>
            <OrderPreview order={order} />
            <Divider sx={{ my: 2 }} />
          </>) : null}
          {el}
        </CardContent>
      </Card>
    </Portal>
  )
}

export default MapPopup;
