import { useEffect, type ComponentType } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewClients/+types/ViewClients';

import { EStatus } from '~/constants/status';

import { PrevRoute } from '~/router/prev-route';
import { ClientsProvider, useClientsCtx } from '~/providers/clients';
import { fetchClients } from '~/data/fetch-clients';
import type { IClientsStoreData } from '~/store/clients.store';
import { ReloadPageProvider } from '~/providers/reload-page';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import ClientsHeader from './components/ClientsHeader';
import ClientsTable from '~/components/clients/ClientsTable';
import ErrorBoundary from '~/components/other/ErrorBoundary';

const ViewClients: ComponentType = observer(() => {
  const { store: clientsStore, setProcessing } = useClientsCtx();
  const errorSnackbar = useErrorSnackbar();

  const reloadPageData = () => {
    setProcessing();
  }

  useEffect(() => {
    if (!clientsStore.isError) {
      return;
    }

    errorSnackbar(clientsStore.getError);
  }, [clientsStore.isError]);

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
        <ClientsHeader />
        <ClientsTable
          isProcessing={clientsStore.isProcessing}
          items={clientsStore.data?.data}
        />
      </Box>
    </ReloadPageProvider>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <ClientsProvider initialData={loaderData.clientsState}>
      <ViewClients />
    </ClientsProvider>
  )
}

export default Wrapper;

export async function clientLoader(loaderArgs: Route.ClientLoaderArgs) {
  const url = loaderArgs.request.url;

  const prevRoute = PrevRoute.instance;
  const isSamePath = prevRoute.comparePath(url);

  const clientsState: IClientsStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  try {
    const data = await fetchClients();
    clientsState.data = data;
    clientsState.getStatus = EStatus.SUCCESS;
  } catch (err) {
    if (isSamePath) {
      clientsState.getError = err;
      clientsState.getStatus = EStatus.ERROR;
    } else {
      throw err;
    }
  }

  prevRoute.updatePath(url);

  return {
    clientsState,
  };
}

export { ErrorBoundary };

