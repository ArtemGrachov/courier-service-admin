import { useState, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewClients/+types/ViewClients';
import { useTranslation } from 'react-i18next';

import { EStatus } from '~/constants/status';
import i18n from '~/i18n/config';

import routeLoader from '~/router/route-loader';

import { PageDataContext, usePageDataCtx } from '~/providers/page-data';
import { usePageDataService } from '~/providers/page-data/service';
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
  const { store: clientsStore } = useClientsCtx();
  const errorSnackbar = useErrorSnackbar();
  const titlePortalRef = useTitlePortalCtx();
  const { store: clientsFilterStore, handleUpdate } = useClientsFilterCtx();
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

  const tableUpdateHandler = (payload: IFormClientsFilter) => {
    handleUpdate(payload);
  }

  return (
    <ReloadPageProvider reloadFunction={reloadPageData} isDefaultReload={false}>
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
          isProcessing={isLoading}
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

  const service = usePageDataService<ILoaderResult>({
    initialData: loaderData,
    loader: () => loader(location.href),
    updateCondition: newState => newState?.clientsState?.getStatus !== EStatus.ERROR,
  });

  return (
    <PageDataContext value={service}>
      <ClientsProvider initialData={service.state?.clientsState}>
        <ClientsFilterProvider>
          <ViewClients />
        </ClientsFilterProvider>
      </ClientsProvider>
    </PageDataContext>
  )
}

export default Wrapper;

interface ILoaderResult {
  clientsState: IClientsStoreData;
}

const loader = async (url: string) => {
  const clientsState = await loadClients(url);
  const hasError = clientsState.getStatus === EStatus.ERROR;

  if (hasError) {
    throw clientsState.getError;
  }

  const result = {
    clientsState,
  };

  return result;
}

export async function clientLoader(loaderArgs: Route.ClientLoaderArgs) {
  const url = loaderArgs.request.url;
  return routeLoader<ILoaderResult>(url, () => loader(url));
}

export { ErrorBoundary };

export function meta() {
  const { t } = i18n;

  return [
    { title: t('common_meta.title_template', { title: t('view_clients.title') }) },
  ];
}

