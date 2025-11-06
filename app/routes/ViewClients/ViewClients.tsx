import { useMemo, type ComponentType } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';

import { EStatus } from '~/constants/status';

import { ClientsProvider, useClientsCtx } from '~/providers/clients';
import { fetchClients } from '~/providers/clients/data';
import type { IClientsStoreData } from '~/providers/clients/store';
import { ReloadPageProvider } from '~/providers/reload-page';

import ClientsHeader from './components/ClientsHeader';
// import CouriersTable from '~/components/couriers/CouriersTable';
import PageError from '~/components/other/PageError';

const ViewClients: ComponentType = observer(() => {
  const { store: clientsStore, fetch } = useClientsCtx();

  const showPageError = useMemo(() => {
    return clientsStore.isError || clientsStore.getError;
  }, [clientsStore.isError, clientsStore.getError]);

  const reloadPageData = () => {
    fetch()
  }

  return (
    <Box
      flexDirection="column"
      display="flex"
      gap={2}
      padding={3}
      width="100%"
      boxSizing="border-box"
    >
      <ReloadPageProvider reloadFunction={reloadPageData}>
        {showPageError && (
          <PageError
            isProcessing={clientsStore.isProcessing}
            error={clientsStore.getError}
          />
        )}
      </ReloadPageProvider>
      {!showPageError && (<>
        <ClientsHeader />
        {/* @todo */}
        {/* <CouriersTable
          isProcessing={couriersStore.isProcessing}
          items={couriersStore.data?.data}
        /> */}
      </>)}
    </Box>
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

  try {
    const data = await fetchClients();
    clientsState.data = data;
    clientsState.getStatus = EStatus.SUCCESS;
  } catch (err) {
    clientsState.getError = err;
    clientsState.getStatus = EStatus.ERROR;
  }

  return {
    clientsState,
  };
}
