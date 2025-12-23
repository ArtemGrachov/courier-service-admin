import { useState, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Route } from '.react-router/types/app/routes/ViewOrders/+types/ViewOrders';

import i18n from '~/i18n/config';
import routeLoader from '~/router/route-loader';

import { EStatus } from '~/constants/status';

import { PageDataContext, usePageDataCtx } from '~/providers/page-data';
import { usePageDataService } from '~/providers/page-data/service';
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
  const { store: ordersStore } = useOrdersCtx();
  const errorSnackbar = useErrorSnackbar();
  const titlePortalRef = useTitlePortalCtx();
  const { store: ordersFilterStore, handleUpdate } = useOrdersFilterCtx();
  const { reload } = usePageDataCtx();
  const [isLoading, setIsLoading] = useState(false);

  const reloadPageData = async () => {
    setIsLoading(true);

    try {
      await reload();
    } catch (err) {
      errorSnackbar(err);
    }

    setIsLoading(false);
  }

  const tableUpdateHandler = (payload: IFormOrdersFilter) => {
    handleUpdate(payload);
  }

  return (
    <ReloadPageProvider reloadFunction={reloadPageData} isDefaultReload={false}>
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
          isProcessing={isLoading}
          onReload={reloadPageData}
        />
        <OrdersTable
          isProcessing={ordersStore.isProcessing}
          items={ordersStore.data?.items}
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

  const service = usePageDataService<ILoaderResult>({
    initialData: loaderData,
    loader: () => loader(location.href),
    updateCondition: newState => newState?.ordersState?.getStatus !== EStatus.ERROR,
  });

  return (
    <PageDataContext value={service}>
      <OrdersProvider initialData={service.state?.ordersState}>
        <OrdersFilterProvider>
          <OrderFilterProvider>
            <ViewOrders />
          </OrderFilterProvider>
        </OrdersFilterProvider>
      </OrdersProvider>
    </PageDataContext>
  )
}

export default Wrapper;

interface ILoaderResult {
  ordersState: IOrdersStoreData;
}

const loader = async (url: string) => {
  const ordersState = await loadOrders(url);

  const hasError = ordersState.getStatus === EStatus.ERROR;

  if (hasError) {
    throw ordersState.getError;
  }

  const result = {
    ordersState,
  };

  return result;
}

export async function clientLoader(loaderArgs: Route.ClientLoaderArgs) {
  const url = loaderArgs.request.url;
  return routeLoader<ILoaderResult>(url, async () => loader(url));
}

export { ErrorBoundary };

export function meta() {
  const { t } = i18n;

  return [
    { title: t('common_meta.title_template', { title: t('view_orders.title') }) },
  ];
}

