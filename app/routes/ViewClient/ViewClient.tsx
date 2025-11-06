import { useMemo, useState, type ComponentType } from 'react';
import { useLoaderData, useParams } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewClient/+types/ViewClient';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import { EStatus } from '~/constants/status';

import { ClientProvider, useClientCtx } from '~/providers/client';
import type { IClientStoreData } from '~/providers/client/store';
import { fetchClient } from '~/providers/client/data';

import { OrdersProvider, useOrdersCtx } from '~/providers/orders';
import type { IOrdersStoreData } from '~/providers/orders/store';
import { fetchOrders } from '~/providers/orders/data';

import { ReloadPageProvider } from '~/providers/reload-page';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import PageError from '~/components/other/PageError';
import ClientDetails from '~/components/clients/ClientDetails';
import OrdersTable from '~/components/orders/OrdersTable';

interface IProps {
  clientLoadingError?: boolean;
  ordersLoadingError?: boolean;
}

const ViewClient: ComponentType<IProps> = observer(({ clientLoadingError, ordersLoadingError }) => {
  const { t } = useTranslation();
  const { clientId: rawClientId } = useParams();
  const { store: clientStore, fetch: fetchClient } = useClientCtx();
  const { store: ordersStore, fetch: fetchOrders } = useOrdersCtx();
  const errorSnackbar = useErrorSnackbar();

  const [showClientError, setShowClientError] = useState(clientLoadingError);
  const [showOrdersError, setShowOrdersError] = useState(ordersLoadingError);

  const showPageError = useMemo(() => {
    return showClientError && showOrdersError;
  }, [showClientError, showOrdersError]);

  const clientId = useMemo(() => {
    return +rawClientId!;
  }, [rawClientId])


  const client = clientStore.data;

  const reloadClientData = async () => {
    if (clientStore.isProcessing) {
      return;
    }

    try {
      await fetchClient(clientId);
      setShowClientError(false);
    } catch (err) {
      console.error(err);
      errorSnackbar(err);
    }
  }

  const reloadOrdersData = async () => {
    if (ordersStore.isProcessing) {
      return;
    }

    try {
      await fetchOrders({ clientIds: [clientId] });
      setShowOrdersError(false);
    } catch (err) {
      console.error(err);
      errorSnackbar(err);
    }
  }

  const reloadPageData = async () => {
    await Promise.all([
      reloadClientData(),
      reloadOrdersData(),
    ]);
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
      <ReloadPageProvider reloadFunction={reloadPageData}>
        {showPageError && (
          <PageError
            isProcessing={clientStore.isProcessing || ordersStore.isProcessing}
            error={clientStore.getError || ordersStore.getError}
          />
        )}
      </ReloadPageProvider>
      <ReloadPageProvider reloadFunction={reloadClientData}>
        {!showPageError && showClientError && (
          <PageError
            title={t('view_client.error_client_data')}
            isProcessing={clientStore.isProcessing}
            error={clientStore.getError}
          />
        )}
      </ReloadPageProvider>
      {!showClientError && client && (
        <ClientDetails client={client} />
      )}
      <ReloadPageProvider reloadFunction={reloadOrdersData}>
        {!showPageError && showOrdersError && (
          <PageError
            title={t('view_client.error_orders_data')}
            isProcessing={ordersStore.isProcessing}
            error={ordersStore.getError}
          />
        )}
      </ReloadPageProvider>
      {!showOrdersError && ordersStore.data && (
        <OrdersTable
          items={ordersStore.data?.data}
          isProcessing={ordersStore.isProcessing}
        />
      )}
    </Box>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <OrdersProvider initialData={loaderData.ordersState}>
      <ClientProvider initialData={loaderData.clientState}>
        <ViewClient
          clientLoadingError={loaderData.clientState.getStatus === EStatus.ERROR}
          ordersLoadingError={loaderData.ordersState.getStatus === EStatus.ERROR}
        />
      </ClientProvider>
    </OrdersProvider>
  )
}

export default Wrapper;

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
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
        })
        .catch(err => {
          clientState.getError = err;
          clientState.getStatus = EStatus.ERROR;
        }),
      fetchOrders({ clientIds: [clientId] })
        .then(data => {
          ordersState.data = data;
          ordersState.getStatus = EStatus.SUCCESS;
        })
        .catch(err => {
          ordersState.getError = err;
          ordersState.getStatus = EStatus.ERROR;
        })
    ]);
  }

  return {
    clientState,
    ordersState,
  };
}
