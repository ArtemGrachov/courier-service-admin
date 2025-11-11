import { useMemo, type ComponentType } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';

import { EStatus } from '~/constants/status';

import { CouriersProvider, useCouriersCtx } from '~/providers/couriers';
import { fetchCouriers } from '~/data/fetch-couriers';
import type { ICouriersStoreData } from '~/store/couriers.store';
import { ReloadPageProvider } from '~/providers/reload-page';

import CouriersHeader from './components/CouriersHeader';
import CouriersTable from '~/components/couriers/CouriersTable';
import PageError from '~/components/other/PageError';

const ViewCouriers: ComponentType = observer(() => {
  const { store: couriersStore, fetch } = useCouriersCtx();

  const showPageError = useMemo(() => {
    return couriersStore.isError || couriersStore.getError;
  }, [couriersStore.isError, couriersStore.getError]);

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
            isProcessing={couriersStore.isProcessing}
            error={couriersStore.getError}
          />
        )}
      </ReloadPageProvider>
      {!showPageError && (<>
        <CouriersHeader />
        <CouriersTable
          isProcessing={couriersStore.isProcessing}
          items={couriersStore.data?.data}
        />
      </>)}
    </Box>
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

export async function clientLoader() {
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
    couriersState.getError = err;
    couriersState.getStatus = EStatus.ERROR;
  }

  return {
    couriersState,
  };
}
