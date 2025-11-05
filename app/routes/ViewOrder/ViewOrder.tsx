import { useMemo, type ComponentType } from 'react';
import { useLoaderData, useParams } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewOrder/+types/ViewOrder';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';

import { EStatus } from '~/constants/status';

import { OrderProvider, useOrderCtx } from '~/providers/order';
import type { IOrderStoreData } from '~/providers/order/store';
import { fetchOrder } from '~/providers/order/data';
import { ReloadPageProvider } from '~/providers/reload-page';

import PageError from '~/components/other/PageError';
import OrderCard from '~/components/orders/OrderCard';
import ClientCard from '~/components/clients/ClientCard';

const ViewOrder: ComponentType = observer(() => {
  const { store: orderStore, fetch } = useOrderCtx();
  const { orderId } = useParams();

  const order = orderStore.data;

  const showPageError = useMemo(() => {
    return orderStore.isError || orderStore.getError;
  }, [orderStore.isError, orderStore.getError]);

  const reloadPageData = () => {
    fetch(+orderId!)
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
            isProcessing={orderStore.isProcessing}
            error={orderStore.getError}
          />
        )}
      </ReloadPageProvider>
      {!showPageError && order && (
        <>
          <OrderCard order={order} />
          {order.sender && <ClientCard client={order.sender} isSender={true} />}
          {order.receiver && <ClientCard client={order.receiver} isReceiver={true} />}
        </>
      )}
    </Box>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <OrderProvider initialData={loaderData.orderState}>
      <ViewOrder />
    </OrderProvider>
  )
}

export default Wrapper;

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const orderState: IOrderStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  if (params.orderId) {
    try {
      const data = await fetchOrder(+params.orderId!);
      orderState.data = data;
      orderState.getStatus = EStatus.SUCCESS;
    } catch (err) {
      orderState.getError = err;
      orderState.getStatus = EStatus.ERROR;
    }
  }

  return {
    orderState,
  };
}
