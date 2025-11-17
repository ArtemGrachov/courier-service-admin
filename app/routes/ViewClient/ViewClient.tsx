import { useState, type ComponentType } from 'react';
import { useLoaderData } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewClient/+types/ViewClient';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import i18n from '~/i18n/config';

import { EStatus } from '~/constants/status';

import routeLoader from '~/router/route-loader';

import { PageDataContext, usePageDataCtx } from '~/providers/page-data';
import { usePageDataService } from '~/providers/page-data/service';
import { ClientProvider, useClientCtx } from '~/providers/client';
import type { IClientStoreData } from '~/providers/client/store';

import { OrdersProvider, useOrdersCtx } from '~/providers/orders';
import type { IOrdersStoreData } from '~/providers/orders/store';
import { ReloadPageProvider } from '~/providers/reload-page';
import { useTitlePortalCtx } from '~/providers/title-portal';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import ClientDetails from '~/components/clients/ClientDetails';
import OrdersTablePreview from '~/components/orders/OrdersTablePreview';
import ErrorBoundary from '~/components/other/ErrorBoundary';
import RefreshButton from '~/components/other/ReloadButton';

import { loadClient } from './loaders/load-client';
import { loadOrders } from './loaders/load-orders';

const ViewClient: ComponentType = observer(() => {
  const { t } = useTranslation();
  const titlePortalRef = useTitlePortalCtx();
  const errorSnackbar = useErrorSnackbar();
  const { reload } = usePageDataCtx();
  const [isLoading, setIsLoading] = useState(false);

  const { store: clientStore } = useClientCtx();
  const { store: ordersStore } = useOrdersCtx();

  const client = clientStore.data;

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
      <Portal container={() => titlePortalRef?.current ?? null}>
        {t('view_client.title', { id: client?.id, name: client?.name })}
      </Portal>
      <Box
        flexDirection="column"
        display="flex"
        gap={2}
        padding={3}
        width="100%"
        boxSizing="border-box"
        flexGrow={1}
      >
        <Stack direction="row" gap={4}>
          <RefreshButton
            isProcessing={isLoading}
            onReload={reloadPageData}
          />
          {client && (
            <Box flex="1 1 auto">
              <ClientDetails client={client} />
            </Box>
          )}
        </Stack>
        {ordersStore.data && (
          <Box>
            <OrdersTablePreview
              items={ordersStore.data?.data}
              isProcessing={ordersStore.isProcessing}
            />
          </Box>
        )}
      </Box>
    </ReloadPageProvider>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();
  const { clientId } = useParams();

  const service = usePageDataService<ILoaderResult>({
    initialData: loaderData,
    loader: () => loader(+clientId!),
    updateCondition: newState => newState?.clientState?.getStatus !== EStatus.ERROR && newState?.ordersState?.getStatus !== EStatus.ERROR,
  });

  return (
    <PageDataContext value={service}>
      <OrdersProvider initialData={service.state?.ordersState}>
        <ClientProvider initialData={service.state?.clientState}>
          <ViewClient />
        </ClientProvider>
      </OrdersProvider>
    </PageDataContext>
  )
}

export default Wrapper;

interface ILoaderResult {
  clientState: IClientStoreData;
  ordersState: IOrdersStoreData;
}

const loader = async (clientId: number) => {
  if (isNaN(clientId)) {
    throw { status: 404 };
  }

  const [clientState, ordersState] = await Promise.all([
    loadClient(clientId),
    loadOrders(clientId),
  ]);

  const hasError = ordersState.getStatus === EStatus.ERROR || clientState.getStatus === EStatus.ERROR;

  if (hasError) {
    throw ordersState.getError || clientState.getError;
  }

  const result = {
    clientState,
    ordersState,
  };

  return result;
}

export async function clientLoader({ params, request }: Route.ClientLoaderArgs): Promise<ILoaderResult> {
  return routeLoader<ILoaderResult>(request.url, async () => {
    const clientId = +params.clientId;
    return loader(clientId);
  });
}

export { ErrorBoundary };

export function meta({ loaderData }: Route.MetaArgs) {
  const { t } = i18n;
  const client = loaderData.clientState.data;

  return [
    { title: t('common_meta.title_template', { title: t('view_client.title', { id: client?.id, name: client?.name }) }) },
  ];
}

