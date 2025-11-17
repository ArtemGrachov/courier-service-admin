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
import { Cache } from '~/cache/Cache';

import { CouriersFiltersProvider, useCouriersFiltersCtx } from './providers/couriers-filters';
import { ReloadPageProvider } from '~/providers/reload-page';
import { CouriersProvider, useCouriersCtx } from '~/providers/couriers';
import { useTitlePortalCtx } from '~/providers/title-portal';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import ReloadButton from '~/components/other/ReloadButton';
import CouriersTable from '~/components/couriers/CouriersTable';
import ErrorBoundary from '~/components/other/ErrorBoundary';

import type { IFormCouriersFilter } from '~/types/forms/form-couriers-filter';
import type { ICouriersStoreData } from '~/store/couriers.store';

import { loadCouriers } from './loaders/load-couriers';

const ViewCouriers: ComponentType = observer(() => {
  const { t } = useTranslation();
  const { store: couriersStore, setProcessing } = useCouriersCtx();
  const errorSnackbar = useErrorSnackbar();
  const titlePortalRef = useTitlePortalCtx();
  const { store: couriersFiltersStore, handleUpdate } = useCouriersFiltersCtx();

  const reloadPageData = () => {
    setProcessing();
  }

  useEffect(() => {
    if (!couriersStore.isError) {
      return;
    }

    errorSnackbar(couriersStore.getError);
  }, [couriersStore.isError]);

  const tableUpdateHandler = (payload: IFormCouriersFilter) => {
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
        <ReloadButton
          isProcessing={couriersStore.isProcessing}
          onReload={reloadPageData}
        />
        <CouriersTable
          isProcessing={couriersStore.isProcessing}
          items={couriersStore.data?.data}
          pagination={couriersStore.data?.pagination}
          formValue={couriersFiltersStore.formValue}
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

interface ILoaderResult {
  couriersState: ICouriersStoreData;
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

  const couriersState = await loadCouriers(loaderArgs);

  prevRoute.updatePath(url);

  const hasError = couriersState.getStatus === EStatus.ERROR;

  if (hasError && !isSamePath) {
    throw couriersState.getError;
  }

  const result = {
    couriersState,
  };

  cache.set(url, result);

  return result;
}

export { ErrorBoundary };

export function meta() {
  const { t } = i18n;

  return [
    { title: t('common_meta.title_template', { title: t('view_couriers.title') }) },
  ];
}

