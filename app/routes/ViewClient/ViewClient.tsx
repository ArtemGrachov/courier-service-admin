import { type ComponentType } from 'react';
import { useLoaderData } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewClient/+types/ViewClient';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import i18n from '~/i18n/config';

import { EStatus } from '~/constants/status';

import { ClientProvider, useClientCtx } from '~/providers/client';
import type { IClientStoreData } from '~/providers/client/store';
import { fetchClient } from '~/providers/client/data';

import { OrdersProvider, useOrdersCtx } from '~/providers/orders';
import type { IOrdersStoreData } from '~/providers/orders/store';
import { fetchOrders } from '~/providers/orders/data';
import { ReloadPageProvider } from '~/providers/reload-page';
import { useTitlePortalCtx } from '~/providers/title-portal';

import ClientDetails from '~/components/clients/ClientDetails';
import OrdersTable from '~/components/orders/OrdersTable';
import ErrorBoundary from '~/components/other/ErrorBoundary';

const ViewClient: ComponentType = observer(() => {
  const { t } = useTranslation();
  const titlePortalRef = useTitlePortalCtx();

  const { store: clientStore, setProcessing: setClientProcessing } = useClientCtx();
  const { store: ordersStore, setProcessing: setOrdersProcessing } = useOrdersCtx();

  const client = clientStore.data;

  const reloadPageData = async () => {
    setClientProcessing();
    setOrdersProcessing();
  }

  return (
    <ReloadPageProvider reloadFunction={reloadPageData}>
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
      {client && (
        <ClientDetails client={client} />
      )}
      {ordersStore.data && (
        <OrdersTable
          items={ordersStore.data?.data}
          isProcessing={ordersStore.isProcessing}
        />
      )}
      </Box>
    </ReloadPageProvider>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <OrdersProvider initialData={loaderData.ordersState}>
      <ClientProvider initialData={loaderData.clientState}>
        <ViewClient />
      </ClientProvider>
    </OrdersProvider>
  )
}

export default Wrapper;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const clientId = +params.clientId;

  const clientState: IClientStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const ordersState: IOrdersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  }

  if (!isNaN(clientId)) {
    await Promise.all([
      fetchClient(clientId)
        .then(data => {
          clientState.data = data;
          clientState.getStatus = EStatus.SUCCESS;
        }),
      fetchOrders({ clientIds: [clientId] })
        .then(data => {
          ordersState.data = data;
          ordersState.getStatus = EStatus.SUCCESS;
        }),
    ]);
  }

  return {
    clientState,
    ordersState,
  };
}

export { ErrorBoundary };

export function meta() {
  const { t } = i18n;

  return [
    { title: t('common_meta.title_template', { title: t('view_client.title') }) },
  ];
}

