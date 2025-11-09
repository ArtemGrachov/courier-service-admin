import { Box, Card } from '@mui/material';
import { type ComponentType } from 'react';
import { useLoaderData } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewMap/+types/ViewMap';

import { EStatus } from '~/constants/status';

import { MapFiltersProvider } from './providers/map-filters';

import { CouriersProvider, useCouriersCtx } from '~/providers/couriers';
import { fetchCouriers } from '~/providers/couriers/data';
import type { ICouriersStoreData } from '~/providers/couriers/store';

import { OrdersProvider, useOrdersCtx } from '~/providers/orders';

import FilterMediator from './components/FilterMediator';
import Map from '~/components/map/Map';

import { loadOrders } from './loaders/load-orders';
import { loadCouriers } from '~/routes/ViewMap/loaders/load-couriers';

const ViewMap: ComponentType = () => {
  const { store: couriersStore } = useCouriersCtx();
  const { store: ordersStore } = useOrdersCtx();

  const orders = ordersStore.data?.data;

  return (
    <Box height="100%" position="relative">
      <Card sx={{ position: 'absolute', top: 8, right: 8, padding: 1, zIndex: 1300 }}>
        <FilterMediator />
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
        <MapFiltersProvider>
          <ViewMap />
        </MapFiltersProvider>
      </CouriersProvider>
    </OrdersProvider>
  )
}

export default Wrapper;

export async function clientLoader(loaderArgs: Route.ClientLoaderArgs) {
  const [ordersState, couriersState] = await Promise.all([
    loadOrders(loaderArgs),
    loadCouriers(loaderArgs),
  ]);

  return {
    ordersState,
    couriersState,
  };
}
