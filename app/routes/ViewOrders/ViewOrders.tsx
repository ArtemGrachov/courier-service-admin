import { type ComponentType } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';

import { EStatus } from '~/constants/status';

import { OrdersProvider, useOrdersCtx } from '~/providers/orders';
import { fetchOrders } from '~/providers/orders/data';
import type { IOrdersStoreData } from '~/providers/orders/store';
import { ReloadPageProvider } from '~/providers/reload-page';

import OrdersHeader from './components/OrdersHeader';
import OrdersTable from '~/components/orders/OrdersTable';
import ErrorBoundary from '~/components/other/ErrorBoundary';

const ViewOrders: ComponentType = observer(() => {
  const { store: ordersStore, setProcessing } = useOrdersCtx();

  const reloadPageData = () => {
    setProcessing();
  }

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
        <OrdersHeader />
        <OrdersTable
          isProcessing={ordersStore.isProcessing}
          items={ordersStore.data?.data}
        />
      </Box>
    </ReloadPageProvider>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <OrdersProvider initialData={loaderData.ordersState}>
      <ViewOrders />
    </OrdersProvider>
  )
}

export default Wrapper;

export async function clientLoader() {
  const ordersState: IOrdersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const data = await fetchOrders();
  ordersState.data = data;
  ordersState.getStatus = EStatus.SUCCESS;

  return {
    ordersState,
  };
}

export { ErrorBoundary };

