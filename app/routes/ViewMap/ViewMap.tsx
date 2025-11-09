import { Box, Card } from '@mui/material';
import { useMemo, type ComponentType } from 'react';
import { useLoaderData } from 'react-router';

import { EStatus } from '~/constants/status';
import { EOrderStatus } from '~/constants/order';

import { CouriersProvider, useCouriersCtx } from '~/providers/couriers';
import { fetchCouriers } from '~/providers/couriers/data';
import type { ICouriersStoreData } from '~/providers/couriers/store';

import { OrdersProvider, useOrdersCtx } from '~/providers/orders';
import { fetchOrders } from '~/providers/orders/data';
import type { IOrdersStoreData } from '~/providers/orders/store';

import Map from '~/components/map/Map';
import MapFilters from '~/components/map-filters/MapFilters';

import type { IClient } from '~/types/models/client';

interface IClientsData {
  senderIds: Set<number>;
  receiverIds: Set<number>;
  clientsMap: Record<number, IClient>;
}

const ViewMap: ComponentType = () => {
  const { store: couriersStore } = useCouriersCtx();
  const { store: ordersStore } = useOrdersCtx();

  const orders = ordersStore.data?.data;

  const { senders, receivers } = useMemo(() => {
    if (!orders) {
      return {
        senders: [],
        receivers: [],
      };
    }

    const { senderIds, receiverIds, clientsMap } = orders.reduce((acc, curr) => {
      const sender = curr.sender;
      const receiver = curr.receiver;

      if (sender) {
        const id = sender.id;
        acc.senderIds.add(id);
        acc.clientsMap[id] = sender;
      }

      if (receiver) {
        const id = receiver.id;
        acc.receiverIds.add(id);
        acc.clientsMap[id] = receiver;
      }

      return acc;
    }, { senderIds: new Set(), receiverIds: new Set(), clientsMap: {} } as IClientsData);

    return {
      senders: Array.from(senderIds).map(id => clientsMap[id]),
      receivers: Array.from(receiverIds).map(id => clientsMap[id]),
    };
  }, [orders]);

  return (
    <Box height="100%" position="relative">
      <Card sx={{ position: 'absolute', top: 8, right: 8, padding: 1, zIndex: 1300 }}>
        <MapFilters
          couriers={couriersStore.data?.data}
          senders={senders}
          receivers={receivers}
        />
      </Card>
      <Map
        couriers={couriersStore.data?.data}
        orders={orders}
        showPopupOrderData={true}
      />
    </Box>
  )
}

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <OrdersProvider initialData={loaderData.ordersState}>
      <CouriersProvider initialData={loaderData.couriersState}>
        <ViewMap />
      </CouriersProvider>
    </OrdersProvider>
  )
}

export default Wrapper;

export async function clientLoader() {
  const ordersState: IOrdersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const couriersState: ICouriersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  await Promise.all([
    fetchCouriers()
      .then(data => {
        couriersState.data = data;
        couriersState.getStatus = EStatus.SUCCESS;
      })
      .catch(err => {
        couriersState.getError = err;
        couriersState.getStatus = EStatus.ERROR;
      }),
    fetchOrders({ statuses: [EOrderStatus.ORDERED, EOrderStatus.PROCESSING] })
      .then(data => {
        ordersState.data = data;
        ordersState.getStatus = EStatus.SUCCESS;
      })
      .catch(err => {
        ordersState.getError = err;
        ordersState.getStatus = EStatus.ERROR;
      }),
  ]);

  return {
    ordersState,
    couriersState,
  };
}
