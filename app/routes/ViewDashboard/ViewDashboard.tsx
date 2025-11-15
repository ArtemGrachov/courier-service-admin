import type { ComponentType } from 'react';
import Grid from '@mui/material/Grid';
import type { Route } from '.react-router/types/app/routes/ViewDashboard/+types/ViewDashboard';
import { useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { observer } from 'mobx-react-lite';

import { EStatus } from '~/constants/status';

import { ROUTES } from '~/router/routes';
import { PrevRoute } from '~/router/prev-route';

import { CouriersProvider, useCouriersCtx } from '~/providers/couriers';
import { OrdersProvider, useOrdersCtx } from '~/providers/orders';
import { StatsProvider, useStatsCtx } from '~/providers/stats';
import { ReloadPageProvider } from '~/providers/reload-page';

import { useRoutePath } from '~/hooks/routing/use-route-path';
import CouriersTablePreview from '~/components/couriers/CouriersTablePreview';
import OrdersTablePreview from '~/components/orders/OrdersTablePreview';
import ErrorBoundary from '~/components/other/ErrorBoundary';

import { loadCouriers } from './loaders/load-couriers';
import { loadOrders } from './loaders/load-orders';
import { loadStats } from './loaders/load-stats';

const ViewDashboard: ComponentType = observer(() => {
  const { t } = useTranslation();
  const routePath = useRoutePath();

  const { store: ordersStore, setProcessing: setOrdersProcessing } = useOrdersCtx();
  const { store: couriersStore, setProcessing: setCouriersProcessing } = useCouriersCtx();
  const { store: statsStore, setProcessing: setStatsProcessing } = useStatsCtx();

  const reloadPageData = () => {
    setOrdersProcessing();
    setCouriersProcessing();
    setStatsProcessing();
  }

  return (
    <ReloadPageProvider reloadFunction={reloadPageData}>
      <Box
        flexDirection="column"
        display="flex"
        gap={2}
        padding={3}
        width="100%"
        boxSizing="border-box"
      >
        <Grid container spacing={2}>
          <Grid size={6} gap={2}>
            <CouriersTablePreview
              isProcessing={couriersStore.isProcessing}
              items={couriersStore.data?.data}
            />
            <Button
              sx={{ mt: 2 }}
              component={RouterLink}
              to={routePath(ROUTES.COURIERS)}
              variant="contained"
              color="success"
            >
              {t('view_dashboard.see_all_couriers')}
            </Button>
          </Grid>
          <Grid size={6} gap={2}>
            <OrdersTablePreview
              isProcessing={ordersStore.isProcessing}
              items={ordersStore.data?.data}
            />
            <Button
              sx={{ mt: 2 }}
              component={RouterLink}
              to={routePath(ROUTES.ORDERS)}
              variant="contained"
              color="success"
            >
              {t('view_dashboard.see_all_orders')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </ReloadPageProvider>
  )
});

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <CouriersProvider initialData={loaderData.couriersState}>
      <OrdersProvider initialData={loaderData.ordersState}>
        <StatsProvider initialData={loaderData.statsState}>
          <ViewDashboard />
        </StatsProvider>
      </OrdersProvider>
    </CouriersProvider>
  )
}

export default Wrapper;

export async function clientLoader(loaderArgs: Route.ClientLoaderArgs) {
  const url = loaderArgs.request.url;

  const prevRoute = PrevRoute.instance;
  const isSamePath = prevRoute.comparePath(url);

  const [ordersState, couriersState, statsState] = await Promise.all([
    loadOrders(),
    loadCouriers(),
    loadStats(),
  ]);

  prevRoute.updatePath(url);

  if (!isSamePath) {
    if (ordersState.getStatus === EStatus.ERROR) {
      throw ordersState.getError;
    }

    if (couriersState.getStatus === EStatus.ERROR) {
      throw couriersState.getError;
    }
  }

  return {
    ordersState,
    couriersState,
    statsState,
  };
}

export { ErrorBoundary };

