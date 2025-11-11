import { type ComponentType } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';

import { EStatus } from '~/constants/status';

import { ClientsProvider, useClientsCtx } from '~/providers/clients';
import { fetchClients } from '~/data/fetch-clients';
import type { IClientsStoreData } from '~/store/clients.store';
import { ReloadPageProvider } from '~/providers/reload-page';

import ClientsHeader from './components/ClientsHeader';
import ClientsTable from '~/components/clients/ClientsTable';
import ErrorBoundary from '~/components/other/ErrorBoundary';

const ViewClients: ComponentType = observer(() => {
  const { store: clientsStore, setProcessing } = useClientsCtx();

  const reloadPageData = () => {
    setProcessing();
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

export async function clientLoader() {
  const clientsState: IClientsStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const data = await fetchClients();
  clientsState.data = data;
  clientsState.getStatus = EStatus.SUCCESS;

  return {
    clientsState,
  };
}

export { ErrorBoundary };

