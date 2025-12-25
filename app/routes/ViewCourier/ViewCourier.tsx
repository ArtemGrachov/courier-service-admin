import { useState, type ComponentType } from 'react';
import { useLoaderData, useParams, Link as RouterLink } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewCourier/+types/ViewCourier';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import i18n from '~/i18n/config';

import { EStatus } from '~/constants/status';

import routeLoader from '~/router/route-loader';
import { ROUTES } from '~/router/routes';

import { PageDataContext, usePageDataCtx } from '~/providers/page-data';
import { usePageDataService } from '~/providers/page-data/service';
import { CourierProvider, useCourierCtx } from '~/providers/courier';
import type { ICourierStoreData } from '~/providers/courier/store';

import { OrdersProvider, useOrdersCtx } from '~/providers/orders';
import type { IOrdersStoreData } from '~/providers/orders/store';

import { ActiveOrdersProvider, useActiveOrdersCtx } from './providers/active-orders';

import { ReloadPageProvider } from '~/providers/reload-page';
import { useTitlePortalCtx } from '~/providers/title-portal';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import { useRoutePath } from '~/hooks/routing/use-route-path';
import OrdersTablePreview from '~/components/orders/OrdersTablePreview';
import CourierDetails from '~/components/couriers/CourierDetails';
import Map from '~/components/map/Map';
import ErrorBoundary from '~/components/other/ErrorBoundary';
import ReloadButton from '~/components/other/ReloadButton';

import { loadOrders } from './loaders/load-orders';
import { loadCourier } from './loaders/load-courier';
import { loadActiveOrders } from './loaders/load-active-orders';

const ViewCourier: ComponentType = observer(() => {
  const { t } = useTranslation();
  const titlePortalRef = useTitlePortalCtx();
  const errorSnackbar = useErrorSnackbar();
  const { reload } = usePageDataCtx();
  const [isLoading, setIsLoading] = useState(false);
  const routePath = useRoutePath();

  const { store: courierStore } = useCourierCtx();
  const { store: ordersStore } = useOrdersCtx();
  const { store: activeOrdersStore } = useActiveOrdersCtx();

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
    <ReloadPageProvider reloadFunction={reloadPageData} isDefaultReload={false}>
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
                orders={activeOrdersStore.data?.items}
                couriers={[courier]}
                showPopupOrderData={true}
              />
            )}
          </Grid>
        </Grid>
        {ordersStore.data && (
          <Box>
            <OrdersTablePreview
              items={ordersStore.data?.items}
              isProcessing={ordersStore.isProcessing}
            />
            <Button
              component={RouterLink}
              to={routePath(ROUTES.ORDERS, { couriers: [courier?.id] })}
              variant="contained"
              color="success"
              sx={{ mt: 2 }}
            >
              {t('view_courier.orders')}
            </Button>
          </Box>
        )}
      </Box>
    </ReloadPageProvider>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();
  const { courierId } = useParams();

  const service = usePageDataService<ILoaderResult>({
    initialData: loaderData,
    loader: () => loader(+courierId!),
    updateCondition: newState => (
      newState?.courierState?.getStatus !== EStatus.ERROR &&
      newState?.ordersState?.getStatus !== EStatus.ERROR &&
      newState?.activeOrdersState?.getStatus !== EStatus.ERROR
    ),
  });

  return (
    <PageDataContext value={service}>
      <OrdersProvider initialData={service.state?.ordersState}>
        <ActiveOrdersProvider initialData={service.state?.activeOrdersState}>
          <CourierProvider initialData={service.state?.courierState}>
            <ViewCourier />
          </CourierProvider>
        </ActiveOrdersProvider>
      </OrdersProvider>
    </PageDataContext>
  )
}

export default Wrapper;

interface ILoaderResult {
  courierState: ICourierStoreData
  ordersState: IOrdersStoreData
  activeOrdersState: IOrdersStoreData
}

const loader = async (courierId: number) => {
  if (isNaN(courierId)) {
    throw { status: 404 };
  }

  const [courierState, ordersState, activeOrdersState] = await Promise.all([
    loadCourier(courierId),
    loadOrders(courierId),
    loadActiveOrders(courierId),
  ]);

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

