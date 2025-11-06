import { useState, type ComponentType } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';

import { EStatus } from '~/constants/status';

import { ClientsProvider, useClientsCtx } from '~/providers/clients';
import { fetchClients } from '~/providers/clients/data';
import type { IClientsStoreData } from '~/providers/clients/store';
import { ReloadPageProvider } from '~/providers/reload-page';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import ClientsHeader from './components/ClientsHeader';
import PageError from '~/components/other/PageError';
import ClientsTable from '~/components/clients/ClientsTable';

interface IProps {
  loadingError?: boolean;
}

const ViewClients: ComponentType<IProps> = observer(({ loadingError }) => {
  const { store: clientsStore, fetch } = useClientsCtx();
  const errorSnackbar = useErrorSnackbar();
  const [showPageError, setShowPageError] = useState(loadingError);

  const reloadPageData = async () => {
    if (clientsStore.isProcessing) {
      return;
    }

    try {
      await fetch();
      setShowPageError(false);
    } catch (err) {
      console.error(err);
      errorSnackbar(err);
    }
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
        {showPageError && (
          <PageError
            isProcessing={clientsStore.isProcessing}
            error={clientsStore.getError}
          />
        )}
        {!showPageError && (<>
          <ClientsHeader />
          <ClientsTable
            isProcessing={clientsStore.isProcessing}
            items={clientsStore.data?.data}
          />
        </>)}
      </Box>
    </ReloadPageProvider>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <ClientsProvider initialData={loaderData.clientsState}>
      <ViewClients loadingError={loaderData.clientsState.getStatus === EStatus.ERROR} />
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
