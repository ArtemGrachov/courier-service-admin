import { useEffect, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewClients/+types/ViewClients';
import { useTranslation } from 'react-i18next';

import { EStatus } from '~/constants/status';
import i18n from '~/i18n/config';
import { PrevRoute } from '~/router/prev-route';
import { Cache } from '~/cache/Cache';

import { ClientsFilterProvider, useClientsFilterCtx } from './providers/clients-filter';
import { ClientsProvider, useClientsCtx } from '~/providers/clients';
import { ReloadPageProvider } from '~/providers/reload-page';
import { useTitlePortalCtx } from '~/providers/title-portal';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import ReloadButton from '~/components/other/ReloadButton';
import ClientsTable from '~/components/clients/ClientsTable';
import ErrorBoundary from '~/components/other/ErrorBoundary';

import type { IFormClientsFilter } from '~/types/forms/form-clients-filter';
import type { IClientsStoreData } from '~/store/clients.store';

import { loadClients } from './loaders/load-clients';

const ViewClients: ComponentType = observer(() => {
  const { t } = useTranslation();
  const { store: clientsStore, setProcessing } = useClientsCtx();
  const errorSnackbar = useErrorSnackbar();
  const titlePortalRef = useTitlePortalCtx();
  const { store: clientsFilterStore, handleUpdate } = useClientsFilterCtx();

  const reloadPageData = () => {
    setProcessing();
  }

  useEffect(() => {
    if (!clientsStore.isError) {
      return;
    }

    errorSnackbar(clientsStore.getError);
  }, [clientsStore.isError]);

  const tableUpdateHandler = (payload: IFormClientsFilter) => {
    handleUpdate(payload);
  }

  return (
    <ReloadPageProvider reloadFunction={reloadPageData}>
      <Portal container={() => titlePortalRef?.current ?? null}>
        {t('view_clients.title')}
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
          isProcessing={clientsStore.isProcessing}
          onReload={reloadPageData}
        />
        <ClientsTable
          isProcessing={clientsStore.isProcessing}
          items={clientsStore.data?.data}
          pagination={clientsStore.data?.pagination}
          formValue={clientsFilterStore.formValue}
          onUpdate={tableUpdateHandler}
        />
      </Box>
    </ReloadPageProvider>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <ClientsProvider initialData={loaderData.clientsState}>
      <ClientsFilterProvider>
        <ViewClients />
      </ClientsFilterProvider>
    </ClientsProvider>
  )
}

export default Wrapper;

interface ILoaderResult {
  clientsState: IClientsStoreData;
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

  const clientsState = await loadClients(loaderArgs);

  prevRoute.updatePath(url);

  const hasError = clientsState.getStatus === EStatus.ERROR;

  if (hasError && !isSamePath) {
    throw clientsState.getError;
  }

  const result = {
    clientsState,
  };

  cache.set(url, result);

  return result;
}

export { ErrorBoundary };

export function meta() {
  const { t } = i18n;

  return [
    { title: t('common_meta.title_template', { title: t('view_clients.title') }) },
  ];
}

