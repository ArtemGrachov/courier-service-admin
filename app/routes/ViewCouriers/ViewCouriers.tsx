import { type ComponentType } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';

import { CouriersProvider, useCouriersCtx } from '~/providers/couriers';
import { fetchCouriers } from '~/providers/couriers/data';

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
    <CouriersProvider initialData={loaderData.couriersData}>
      <ViewCouriers />
    </CouriersProvider>
  )
}

export default Wrapper;

export async function clientLoader() {
  const couriersData = await fetchCouriers();

  return {
    couriersData,
  };
}
