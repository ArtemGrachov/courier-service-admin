import { useEffect, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewCouriers/+types/ViewCouriers';

import { EStatus } from '~/constants/status';

import { PrevRoute } from '~/router/prev-route';
import { ReloadPageProvider } from '~/providers/reload-page';
import { CouriersProvider, useCouriersCtx } from '~/providers/couriers';
import { fetchCouriers } from '~/data/fetch-couriers';
import type { ICouriersStoreData } from '~/store/couriers.store';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import CouriersHeader from './components/CouriersHeader';
import CouriersTable from '~/components/couriers/CouriersTable';
import ErrorBoundary from '~/components/other/ErrorBoundary';

const ViewCouriers: ComponentType = observer(() => {
  const { store: couriersStore, setProcessing } = useCouriersCtx();
  const errorSnackbar = useErrorSnackbar();

  const reloadPageData = () => {
    setProcessing();
  }

  useEffect(() => {
    if (!couriersStore.isError) {
      return;
    }

    errorSnackbar(couriersStore.getError);
  }, [couriersStore.isError]);

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
        <CouriersHeader />
        <CouriersTable
          isProcessing={couriersStore.isProcessing}
          items={couriersStore.data?.data}
        />
      </Box>
    </ReloadPageProvider>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <CouriersProvider initialData={loaderData.couriersState}>
      <ViewCouriers />
    </CouriersProvider>
  )
}

export default Wrapper;

export async function clientLoader(loaderArgs: Route.ClientLoaderArgs) {
  const url = loaderArgs.request.url;

  const prevRoute = PrevRoute.instance;
  const isSamePath = prevRoute.comparePath(url);

  const couriersState: ICouriersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  try {
    const data = await fetchCouriers();
    couriersState.data = data;
    couriersState.getStatus = EStatus.SUCCESS;
  } catch (err) {
    if (isSamePath) {
      couriersState.getError = err;
      couriersState.getStatus = EStatus.ERROR;
    } else {
      throw err;
    }
  }

  prevRoute.updatePath(url);

  return {
    couriersState,
  };
}

export { ErrorBoundary };

