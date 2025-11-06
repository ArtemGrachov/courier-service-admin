import { useMemo, type ComponentType } from 'react';
import { useLoaderData, useParams } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewClient/+types/ViewClient';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';

import { EStatus } from '~/constants/status';

import { ClientProvider, useClientCtx } from '~/providers/client';
import type { IClientStoreData } from '~/providers/client/store';
import { fetchClient } from '~/providers/client/data';
import { ReloadPageProvider } from '~/providers/reload-page';

import PageError from '~/components/other/PageError';

const ViewClient: ComponentType = observer(() => {
  const { store: clientStore, fetch } = useClientCtx();
  const { clientId } = useParams();

  const client = clientStore.data;

  const showPageError = useMemo(() => {
    return clientStore.isError || clientStore.getError;
  }, [clientStore.isError, clientStore.getError]);

  const reloadPageData = () => {
    fetch(+clientId!)
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
            isProcessing={clientStore.isProcessing}
            error={clientStore.getError}
          />
        )}
      </ReloadPageProvider>
      {!showPageError && client && (
        <div>@todo</div>
      )}
    </Box>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <ClientProvider initialData={loaderData.clientState}>
      <ViewClient />
    </ClientProvider>
  )
}

export default Wrapper;

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const clientState: IClientStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  if (params.clientId) {
    try {
      const data = await fetchClient(+params.clientId!);
      clientState.data = data;
      clientState.getStatus = EStatus.SUCCESS;
    } catch (err) {
      clientState.getError = err;
      clientState.getStatus = EStatus.ERROR;
    }
  }

  return {
    clientState,
  };
}
