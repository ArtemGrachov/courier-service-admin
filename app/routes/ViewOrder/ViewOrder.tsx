import { type ComponentType } from 'react';
import { useLoaderData } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewOrder/+types/ViewOrder';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Portal from '@mui/material/Portal';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import i18n from '~/i18n/config';

import { EStatus } from '~/constants/status';

import { OrderProvider, useOrderCtx } from '~/providers/order';
import type { IOrderStoreData } from '~/providers/order/store';
import { fetchOrder } from '~/providers/order/data';
import { ReloadPageProvider } from '~/providers/reload-page';
import { useTitlePortalCtx } from '~/providers/title-portal';

import OrderCard from '~/components/orders/OrderCard';
import ClientCard from '~/components/clients/ClientCard';
import CourierCard from '~/components/couriers/CourierCard';
import Map from '~/components/map/Map';
import ErrorBoundary from '~/components/other/ErrorBoundary';

const ViewOrder: ComponentType = observer(() => {
  const { t } = useTranslation();
  const { store: orderStore, setProcessing } = useOrderCtx();
  const titlePortalRef = useTitlePortalCtx();

  const order = orderStore.data;

  const reloadPageData = () => {
    setProcessing();
  }

  return (
    <ReloadPageProvider reloadFunction={reloadPageData}>
      <Portal container={() => titlePortalRef?.current ?? null}>
        {t('view_order.title', { id: order?.id })}
      </Portal>
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

export function meta() {
  const { t } = i18n;

  return [
    { title: t('common_meta.title_template', { title: t('view_order.title') }) },
  ];
}

