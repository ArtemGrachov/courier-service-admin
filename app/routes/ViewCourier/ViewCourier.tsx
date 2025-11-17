import { useState, type ComponentType } from 'react';
import { useLoaderData, useParams } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewCourier/+types/ViewCourier';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import i18n from '~/i18n/config';

import { EStatus } from '~/constants/status';
import { EOrderStatus } from '~/constants/order';

import routeLoader from '~/router/route-loader';

import { PageDataContext, usePageDataCtx } from '~/providers/page-data';
import { usePageDataService } from '~/providers/page-data/service';
import { CourierProvider, useCourierCtx } from '~/providers/courier';
import type { ICourierStoreData } from '~/providers/courier/store';
import { fetchCourier } from '~/providers/courier/data';

import { OrdersProvider, useOrdersCtx } from '~/providers/orders';
import type { IOrdersStoreData } from '~/providers/orders/store';
import { fetchOrders } from '~/data/fetch-orders';

import { ActiveOrdersProvider, useActiveOrdersCtx } from './providers/active-orders';

import { ReloadPageProvider } from '~/providers/reload-page';
import { useTitlePortalCtx } from '~/providers/title-portal';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import OrdersTable from '~/components/orders/OrdersTable';
import CourierDetails from '~/components/couriers/CourierDetails';
import Map from '~/components/map/Map';
import ErrorBoundary from '~/components/other/ErrorBoundary';
import ReloadButton from '~/components/other/ReloadButton';

const ViewCourier: ComponentType = observer(() => {
  const { t } = useTranslation();
  const errorSnackbar = useErrorSnackbar();
  const { reload } = usePageDataCtx();
  const [isLoading, setIsLoading] = useState(false);

  const { store: courierStore } = useCourierCtx();
  const { store: ordersStore } = useOrdersCtx();
  const { store: activeOrdersStore } = useActiveOrdersCtx();

  const titlePortalRef = useTitlePortalCtx();

  const courier = courierStore.data;

  const reloadPageData = async () => {
    setIsLoading(true);

    try {
      await reload();
    } catch (err) {
      errorSnackbar(err);
    }

    setIsLoading(false);
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
      <ReloadPageProvider reloadFunction={reloadPageData} isDefaultReload={false}>
        <Grid container spacing={2}>
          <Grid size={5}>
            <Stack gap={2}>
              <ReloadButton
                isProcessing={isLoading}
                onReload={reloadPageData}
              />
              {courier && <CourierDetails courier={courier} />}
            </Stack>
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
  const { courerId } = useParams();

  const service = usePageDataService<ILoaderResult>({
    initialData: loaderData,
    loader: () => loader(+courerId!),
    updateCondition: newState => (
      newState?.courierState?.getStatus !== EStatus.ERROR &&
      newState?.ordersState?.getStatus !== EStatus.ERROR &&
      newState?.activeOrdersState?.getStatus !== EStatus.ERROR
    ),
  });

  return (
    <PageDataContext.Provider value={service}>
      <OrdersProvider initialData={service.state?.ordersState}>
        <ActiveOrdersProvider initialData={service.state?.activeOrdersState}>
          <CourierProvider initialData={service.state?.courierState}>
            <ViewCourier />
          </CourierProvider>
        </ActiveOrdersProvider>
      </OrdersProvider>
    </PageDataContext.Provider>
  )
}

export default Wrapper;

interface ILoaderResult {
  courierState: ICourierStoreData
  ordersState: IOrdersStoreData
  activeOrdersState: IOrdersStoreData
}

const loader = async (courierId: number) => {
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

  const hasError = ordersState.getStatus === EStatus.ERROR || courierState.getStatus === EStatus.ERROR || activeOrdersState.getStatus === EStatus.ERROR;

  if (hasError) {
    throw ordersState.getError || courierState.getError || activeOrdersState.getError;
  }

  const result = {
    courierState,
    ordersState,
    activeOrdersState,
  };

  return result;
}

export async function clientLoader({ params, request }: Route.ClientLoaderArgs): Promise<ILoaderResult> {
  const courierId = +params.courierId;

  return routeLoader<ILoaderResult>(request.url, async () => {
    return loader(courierId);
  });
}

export { ErrorBoundary };

export function meta({ loaderData }: Route.MetaArgs) {
  const { t } = i18n;
  const courier = loaderData?.courierState?.data;

  return [
    { title: t('common_meta.title_template', { title: t('view_courier.title', { id: courier?.id, name: courier?.name }) }) },
  ];
}

