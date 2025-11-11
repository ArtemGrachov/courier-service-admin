import { useEffect, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Route } from '.react-router/types/app/routes/ViewOrders/+types/ViewOrders';

import { EStatus } from '~/constants/status';

import { PrevRoute } from '~/router/prev-route';
import { OrdersProvider, useOrdersCtx } from '~/providers/orders';
import { fetchOrders } from '~/providers/orders/data';
import type { IOrdersStoreData } from '~/providers/orders/store';
import { ReloadPageProvider } from '~/providers/reload-page';
import { useTitlePortalCtx } from '~/providers/title-portal';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import OrdersHeader from './components/OrdersHeader';
import OrdersTable from '~/components/orders/OrdersTable';
import ErrorBoundary from '~/components/other/ErrorBoundary';

const ViewOrders: ComponentType = observer(() => {
  const { t } = useTranslation();
  const { store: ordersStore, setProcessing } = useOrdersCtx();
  const errorSnackbar = useErrorSnackbar();
  const titlePortalRef = useTitlePortalCtx();

  const reloadPageData = () => {
    setProcessing();
  }

  useEffect(() => {
    if (!ordersStore.isError) {
      return;
    }

    errorSnackbar(ordersStore.getError);
  }, [ordersStore.isError]);

  return (
    <ReloadPageProvider reloadFunction={reloadPageData}>
      <Portal container={() => titlePortalRef?.current ?? null}>
        {t('view_orders.title')}
      </Portal>
      <Box
        flexDirection="column"
        display="flex"
        gap={2}
        padding={3}
        width="100%"
        boxSizing="border-box"
      >
        <OrdersHeader />
        <OrdersTable
          isProcessing={ordersStore.isProcessing}
          items={ordersStore.data?.data}
        />
      </Box>
    </ReloadPageProvider>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <OrdersProvider initialData={loaderData.ordersState}>
      <ViewOrders />
    </OrdersProvider>
  )
}

export default Wrapper;

export async function clientLoader(loaderArgs: Route.ClientLoaderArgs) {
  const url = loaderArgs.request.url;

  const prevRoute = PrevRoute.instance;
  const isSamePath = prevRoute.comparePath(url);

  const ordersState: IOrdersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  try {
    const data = await fetchOrders();
    ordersState.data = data;
    ordersState.getStatus = EStatus.SUCCESS;
  } catch (err) {
    if (isSamePath) {
      ordersState.getError = err;
      ordersState.getStatus = EStatus.ERROR;
    } else {
      throw err;
    }
  }

  prevRoute.updatePath(url);

  return {
    ordersState,
  };
}

export { ErrorBoundary };

