import { useMemo, type ComponentType } from 'react';
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
import PageError from '~/components/other/PageError';

const ViewOrders: ComponentType = observer(() => {
  const { store: ordersStore, fetch } = useOrdersCtx();

  const showPageError = useMemo(() => {
    return ordersStore.isError || ordersStore.getError;
  }, [ordersStore.isError, ordersStore.getError]);

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
            isProcessing={ordersStore.isProcessing}
            error={ordersStore.getError}
          />
        )}
      </ReloadPageProvider>
      {!showPageError && (<>
        <OrdersHeader />
        <OrdersTable
          isProcessing={ordersStore.isProcessing}
          items={ordersStore.data?.data}
        />
      </>)}
    </Box>
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

  try {
    const data = await fetchOrders();
    ordersState.data = data;
    ordersState.getStatus = EStatus.SUCCESS;
  } catch (err) {
    ordersState.getError = err;
    ordersState.getStatus = EStatus.ERROR;
  }

  return {
    ordersState,
  };
}
