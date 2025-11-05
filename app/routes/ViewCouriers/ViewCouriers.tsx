import { type ComponentType } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';

import { EStatus } from '~/constants/status';

import { CouriersProvider, useCouriersCtx } from '~/providers/couriers';
import { fetchCouriers } from '~/providers/couriers/data';
import type { ICouriersStoreData } from '~/providers/couriers/store';

import CouriersHeader from './components/CouriersHeader';
import CouriersTable from '~/components/couriers/CouriersTable';

const ViewCouriers: ComponentType = observer(() => {
  const { store } = useCouriersCtx();

  return (
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
        isProcessing={store.isProcessing}
        items={store.data?.data}
      />
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
