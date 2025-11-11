import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useLoaderData, useNavigate } from 'react-router';

import { EStatus } from '~/constants/status';

import { CouriersProvider, useCouriersCtx } from '~/providers/couriers';
import { fetchCouriers } from '~/data/fetch-couriers';
import type { ICouriersStoreData } from '~/store/couriers.store';
import { ReloadPageProvider } from '~/providers/reload-page';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import CouriersHeader from './components/CouriersHeader';
import CouriersTable from '~/components/couriers/CouriersTable';
import PageError from '~/components/other/PageError';

const ViewCouriers: ComponentType = observer(() => {
  const { store: couriersStore, setProcessing } = useCouriersCtx();
  const navigate = useNavigate();
  const errorSnackbar = useErrorSnackbar();
  const [showPageError, setShowPageError] = useState(couriersStore.isError);

  const isRefreshing = useRef(false);

  const reloadPageData = async () => {
    isRefreshing.current = true;
    setProcessing();

    await navigate('.', { replace: true });
  }

  useEffect(() => {
    if (couriersStore.isProcessing) {
      return;
    }

    if (couriersStore.isError) {
      setShowPageError(true);
      errorSnackbar(couriersStore.getError);
    } else {
      setShowPageError(false);
    }

    isRefreshing.current = false;
  }, [couriersStore.isProcessing]);

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
            isProcessing={couriersStore.isProcessing}
            error={couriersStore.getError}
          />
        )}
        {!showPageError && (<>
          <CouriersHeader />
          <CouriersTable
            isProcessing={couriersStore.isProcessing}
            items={couriersStore.data?.data}
          />
        </>)}
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
