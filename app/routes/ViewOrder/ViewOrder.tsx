import { type ComponentType } from 'react';
import { useLoaderData } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewOrder/+types/ViewOrder';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { observer } from 'mobx-react-lite';

import { EStatus } from '~/constants/status';

import { OrderProvider, useOrderCtx } from '~/providers/order';
import type { IOrderStoreData } from '~/providers/order/store';
import { fetchOrder } from '~/providers/order/data';
import { ReloadPageProvider } from '~/providers/reload-page';

import OrderCard from '~/components/orders/OrderCard';
import ClientCard from '~/components/clients/ClientCard';
import CourierCard from '~/components/couriers/CourierCard';
import Map from '~/components/map/Map';
import ErrorBoundary from '~/components/other/ErrorBoundary';

const ViewOrder: ComponentType = observer(() => {
  const { store: orderStore, setProcessing } = useOrderCtx();

  const order = orderStore.data;

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
        flexGrow={1}
      >
        {order && (
          <>
            <Grid container spacing={2} flexGrow={1} alignItems="stretch" boxSizing="border-box">
              <Grid size={3}>
                <Stack gap={2}>
                  <OrderCard order={order} />
                  {order.sender && <ClientCard client={order.sender} isSender={true} />}
                  {order.receiver && <ClientCard client={order.receiver} isReceiver={true} />}
                  {order.courier && <CourierCard courier={order.courier} />}
                </Stack>
              </Grid>
              <Grid size={9}>
                <Map orders={[order]} />
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </ReloadPageProvider>
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
    const data = await fetchOrder(+params.orderId!);
    orderState.data = data;
    orderState.getStatus = EStatus.SUCCESS;
  }

  return {
    orderState,
  };
}

export { ErrorBoundary };

