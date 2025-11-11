import { useEffect, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewCouriers/+types/ViewCouriers';
import { useTranslation } from 'react-i18next';

import { EStatus } from '~/constants/status';
import i18n from '~/i18n/config';

import { PrevRoute } from '~/router/prev-route';
import { CouriersFiltersProvider, useCouriersFiltersCtx } from './providers/couriers-filters';
import { ReloadPageProvider } from '~/providers/reload-page';
import { CouriersProvider, useCouriersCtx } from '~/providers/couriers';
import { useTitlePortalCtx } from '~/providers/title-portal';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import CouriersHeader from './components/CouriersHeader';
import CouriersTable, { type ICouriersTableUpdatePayload } from '~/components/couriers/CouriersTable';
import ErrorBoundary from '~/components/other/ErrorBoundary';

import { loadCouriers } from './loaders/load-couriers';

const ViewCouriers: ComponentType = observer(() => {
  const { t } = useTranslation();
  const { store: couriersStore, setProcessing } = useCouriersCtx();
  const errorSnackbar = useErrorSnackbar();
  const titlePortalRef = useTitlePortalCtx();
  const { handleUpdate } = useCouriersFiltersCtx();

  const reloadPageData = () => {
    setProcessing();
  }

  useEffect(() => {
    if (!couriersStore.isError) {
      return;
    }

    errorSnackbar(couriersStore.getError);
  }, [couriersStore.isError]);

  const tableUpdateHandler = (payload: ICouriersTableUpdatePayload) => {
    handleUpdate(payload);
  }

  return (
    <ReloadPageProvider reloadFunction={reloadPageData}>
      <Portal container={() => titlePortalRef?.current ?? null}>
        {t('view_couriers.title')}
      </Portal>
      <Box
        flexDirection="column"
        display="flex"
        gap={2}
        padding={3}
        width="100%"
        boxSizing="border-box"
      >
        <CouriersHeader />
        <CouriersTable
          isProcessing={couriersStore.isProcessing}
          items={couriersStore.data?.data}
          pagination={couriersStore.data?.pagination}
          onUpdate={tableUpdateHandler}
        />
      </Box>
    </ReloadPageProvider>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <CouriersProvider initialData={loaderData.couriersState}>
      <CouriersFiltersProvider>
        <ViewCouriers />
      </CouriersFiltersProvider>
    </CouriersProvider>
  )
}

export default Wrapper;

export async function clientLoader(loaderArgs: Route.ClientLoaderArgs) {
  const url = loaderArgs.request.url;

  const prevRoute = PrevRoute.instance;
  const isSamePath = prevRoute.comparePath(url);

  const couriersState = await loadCouriers(loaderArgs);

  prevRoute.updatePath(url);

  if (!isSamePath && couriersState.getStatus === EStatus.ERROR) {
    throw couriersState.getError;
  }

  return {
    couriersState,
  };
}

export { ErrorBoundary };

export function meta() {
  const { t } = i18n;

  return [
    { title: t('common_meta.title_template', { title: t('view_couriers.title') }) },
  ];
}

