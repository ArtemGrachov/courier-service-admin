import { Box } from '@mui/material';
import type { ComponentType } from 'react';
import { useLoaderData } from 'react-router';

import { EStatus } from '~/constants/status';

import { CouriersProvider, useCouriersCtx } from '~/providers/couriers';
import { fetchCouriers } from '~/providers/couriers/data';
import type { ICouriersStoreData } from '~/providers/couriers/store';

import { OrdersProvider, useOrdersCtx } from '~/providers/orders';
import { fetchOrders } from '~/providers/orders/data';
import type { IOrdersStoreData } from '~/providers/orders/store';

import Map from '~/components/map/Map';
import { EOrderStatus } from '~/constants/order';

const ViewMap: ComponentType = () => {
  const { store: couriersStore } = useCouriersCtx();
  const { store: ordersStore } = useOrdersCtx();

  return (
    <Box height="100%">
      <Map
        couriers={couriersStore.data?.data}
        orders={ordersStore.data?.data}
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
