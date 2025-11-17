import { useState, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { observer } from 'mobx-react-lite';
import { useLoaderData, Link as RouterLink } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewCouriers/+types/ViewCouriers';
import { useTranslation } from 'react-i18next';

import { EStatus } from '~/constants/status';
import i18n from '~/i18n/config';
import routeLoader from '~/router/route-loader';
import { ROUTES } from '~/router/routes';

import { PageDataContext, usePageDataCtx } from '~/providers/page-data';
import { usePageDataService } from '~/providers/page-data/service';
import { CouriersFiltersProvider, useCouriersFiltersCtx } from './providers/couriers-filters';
import { ReloadPageProvider } from '~/providers/reload-page';
import { CouriersProvider, useCouriersCtx } from '~/providers/couriers';
import { useTitlePortalCtx } from '~/providers/title-portal';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import { useRoutePath } from '~/hooks/routing/use-route-path';
import ReloadButton from '~/components/other/ReloadButton';
import CouriersTable from '~/components/couriers/CouriersTable';
import ErrorBoundary from '~/components/other/ErrorBoundary';

import type { IFormCouriersFilter } from '~/types/forms/form-couriers-filter';
import type { ICouriersStoreData } from '~/store/couriers.store';

import { loadCouriers } from './loaders/load-couriers';

const ViewCouriers: ComponentType = observer(() => {
  const { t } = useTranslation();
  const { store: couriersStore } = useCouriersCtx();
  const errorSnackbar = useErrorSnackbar();
  const titlePortalRef = useTitlePortalCtx();
  const { store: couriersFiltersStore, handleUpdate } = useCouriersFiltersCtx();
  const { reload } = usePageDataCtx();
  const [isLoading, setIsLoading] = useState(false);
  const routePath = useRoutePath();

  const reloadPageData = async () => {
    setIsLoading(true);

    try {
      await reload();
    } catch (err) {
      errorSnackbar(err);
    }

    setIsLoading(false);
  }

  const tableUpdateHandler = (payload: IFormCouriersFilter) => {
    handleUpdate(payload);
  }

  return (
    <ReloadPageProvider reloadFunction={reloadPageData} isDefaultReload={false}>
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
        <Stack direction="row" gap={2}>
          <ReloadButton
            isProcessing={isLoading}
            onReload={reloadPageData}
          />
          <Button
            component={RouterLink}
            to={routePath(ROUTES.COURIER_ADD)}
            variant="contained"
            color="success"
          >
            {t('view_couriers.add_courier')}
          </Button>
        </Stack>
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
  const service = usePageDataService<ILoaderResult>({
    initialData: loaderData,
    loader: () => loader(location.href),
    updateCondition: newState => newState?.couriersState?.getStatus !== EStatus.ERROR,
  });

  return (
    <PageDataContext value={service}>
      <CouriersProvider initialData={service.state?.couriersState}>
        <CouriersFiltersProvider>
          <ViewCouriers />
        </CouriersFiltersProvider>
      </CouriersProvider>
    </PageDataContext>
  )
}

export default Wrapper;

interface ILoaderResult {
  couriersState: ICouriersStoreData;
}

const loader = async (url: string) => {
    const couriersState = await loadCouriers(url);

    const hasError = couriersState.getStatus === EStatus.ERROR;

    if (hasError) {
      throw couriersState.getError;
    }

    const result = {
      couriersState,
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
    { title: t('common_meta.title_template', { title: t('view_couriers.title') }) },
  ];
}

