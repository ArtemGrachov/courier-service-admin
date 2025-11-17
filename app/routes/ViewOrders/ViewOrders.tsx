import { useEffect, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Route } from '.react-router/types/app/routes/ViewOrders/+types/ViewOrders';

import i18n from '~/i18n/config';
import { PrevRoute } from '~/router/prev-route';
import { Cache } from '~/cache/Cache';

import { EStatus } from '~/constants/status';

import { OrdersFilterProvider } from './providers/orders-filter';
import { useOrdersFilterCtx } from './providers/orders-filter';
import { OrdersProvider, useOrdersCtx } from '~/providers/orders';
import { ReloadPageProvider } from '~/providers/reload-page';
import { useTitlePortalCtx } from '~/providers/title-portal';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import ReloadButton from '~/components/other/ReloadButton';
import OrdersTable from '~/components/orders/OrdersTable';
import ErrorBoundary from '~/components/other/ErrorBoundary';
import OrderFilterProvider from '~/providers/order-filters';

import type { IFormOrdersFilter } from '~/types/forms/form-orders-filter';
import type { IOrdersStoreData } from '~/providers/orders/store';

import { loadOrders } from './loaders/load-orders';

const ViewOrders: ComponentType = observer(() => {
  const { t } = useTranslation();
  const { store: ordersStore, setProcessing } = useOrdersCtx();
  const errorSnackbar = useErrorSnackbar();
  const titlePortalRef = useTitlePortalCtx();
  const { store: ordersFilterStore, handleUpdate } = useOrdersFilterCtx();

  const reloadPageData = () => {
    setProcessing();
  }

  useEffect(() => {
    if (!ordersStore.isError) {
      return;
    }

    errorSnackbar(ordersStore.getError);
  }, [ordersStore.isError]);

  const tableUpdateHandler = (payload: IFormOrdersFilter) => {
    handleUpdate(payload);
  }

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
        <ReloadButton
          isProcessing={ordersStore.isProcessing}
          onReload={reloadPageData}
        />
        <OrdersTable
          isProcessing={ordersStore.isProcessing}
          items={ordersStore.data?.data}
          pagination={ordersStore.data?.pagination}
          formValue={ordersFilterStore.formValue}
          onUpdate={tableUpdateHandler}
        />
      </Box>
    </ReloadPageProvider>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <OrdersProvider initialData={loaderData.ordersState}>
      <OrdersFilterProvider>
        <OrderFilterProvider>
          <ViewOrders />
        </OrderFilterProvider>
      </OrdersFilterProvider>
    </OrdersProvider>
  )
}

export default Wrapper;

interface ILoaderResult {
  ordersState: IOrdersStoreData;
}

export async function clientLoader(loaderArgs: Route.ClientLoaderArgs) {
  const url = loaderArgs.request.url;

  const cache = Cache.instance;
  const prevRoute = PrevRoute.instance;
  const isSamePath = prevRoute.comparePath(url);
  const isSameUrl = prevRoute.compareUrl(url);

  const cachedData = cache.get<ILoaderResult>(url);

  if (!isSameUrl && cachedData) {
    prevRoute.updatePath(url);
    return cachedData;
  }

  const ordersState = await loadOrders(loaderArgs);

  prevRoute.updatePath(url);

  const hasError = ordersState.getStatus === EStatus.ERROR;

  if (hasError && !isSamePath) {
    throw ordersState.getError;
  }

  const result = {
    ordersState,
  };

  cache.set(url, result);

  return result;
}

export { ErrorBoundary };

export function meta() {
  const { t } = i18n;

  return [
    { title: t('common_meta.title_template', { title: t('view_orders.title') }) },
  ];
}

