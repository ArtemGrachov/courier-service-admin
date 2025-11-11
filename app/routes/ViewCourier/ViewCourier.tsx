import { type ComponentType } from 'react';
import { useLoaderData } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewCourier/+types/ViewCourier';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Portal from '@mui/material/Portal';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import i18n from '~/i18n/config';

import { EStatus } from '~/constants/status';
import { EOrderStatus } from '~/constants/order';

import { CourierProvider, useCourierCtx } from '~/providers/courier';
import type { ICourierStoreData } from '~/providers/courier/store';
import { fetchCourier } from '~/providers/courier/data';

import { OrdersProvider, useOrdersCtx } from '~/providers/orders';
import type { IOrdersStoreData } from '~/providers/orders/store';
import { fetchOrders } from '~/providers/orders/data';

import { ActiveOrdersProvider, useActiveOrdersCtx } from './providers/active-orders';

import { ReloadPageProvider } from '~/providers/reload-page';
import { useTitlePortalCtx } from '~/providers/title-portal';

import OrdersTable from '~/components/orders/OrdersTable';
import CourierDetails from '~/components/couriers/CourierDetails';
import Map from '~/components/map/Map';
import ErrorBoundary from '~/components/other/ErrorBoundary';

const ViewCourier: ComponentType = observer(() => {
  const { t } = useTranslation();

  const {
    store: courierStore,
    setProcessing: setCourierProcessing,
  } = useCourierCtx();
  const {
    store: ordersStore,
    setProcessing: setOrdersProcessing,
  } = useOrdersCtx();
  const {
    store: activeOrdersStore,
    setProcessing: setActiveOrdersProcessing,
  } = useActiveOrdersCtx();

  const titlePortalRef = useTitlePortalCtx();

  const courier = courierStore.data;

  const reloadPageData = () => {
    setCourierProcessing();
    setOrdersProcessing();
    setActiveOrdersProcessing();
  }

  return (
    <Box
      flexDirection="column"
      display="flex"
      gap={2}
      padding={3}
      width="100%"
      boxSizing="border-box"
      flexGrow={1}
    >
      <Portal container={() => titlePortalRef?.current ?? null}>
        {t('view_courier.title', { id: courier?.id, name: courier?.name })}
      </Portal>
      <ReloadPageProvider reloadFunction={reloadPageData}>
        <Grid container spacing={2}>
          <Grid size={5}>
            {courier && <CourierDetails courier={courier} />}
          </Grid>
          <Grid size={7} minHeight={400} display="flex">
            {courier && (
              <Map
                orders={activeOrdersStore.data?.data}
                couriers={[courier]}
                showPopupOrderData={true}
              />
            )}
          </Grid>
        </Grid>
        {ordersStore.data && (
          <OrdersTable
            items={ordersStore.data?.data}
            isProcessing={ordersStore.isProcessing}
          />
        )}
      </ReloadPageProvider>
    </Box>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <OrdersProvider initialData={loaderData.ordersState}>
      <ActiveOrdersProvider initialData={loaderData.activeOrdersState}>
        <CourierProvider initialData={loaderData.courierState}>
          <ViewCourier />
        </CourierProvider>
      </ActiveOrdersProvider>
    </OrdersProvider>
  )
}

export default Wrapper;

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const courierId = +params.courierId;

  const courierState: ICourierStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const ordersState: IOrdersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const activeOrdersState: IOrdersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  if (!isNaN(courierId)) {
    await Promise.all([
      fetchCourier(courierId)
        .then(data => {
          courierState.data = data;
          courierState.getStatus = EStatus.SUCCESS;
        }),
      fetchOrders({ courierIds: [courierId] })
        .then(data => {
          ordersState.data = data;
          ordersState.getStatus = EStatus.SUCCESS;
        }),
      fetchOrders({ courierIds: [courierId], statuses: [EOrderStatus.PROCESSING] })
        .then(data => {
          activeOrdersState.data = data;
          activeOrdersState.getStatus = EStatus.SUCCESS;
        })
    ]);
  }

  return {
    courierState,
    ordersState,
    activeOrdersState,
  };
}

export { ErrorBoundary };

export function meta({ loaderData }: Route.MetaArgs) {
  const { t } = i18n;
  const courier = loaderData.courierState.data;

  return [
    { title: t('common_meta.title_template', { title: t('view_courier.title', { id: courier?.id, name: courier?.name }) }) },
  ];
}

