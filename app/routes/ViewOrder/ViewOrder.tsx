import { useState, type ComponentType } from 'react';
import { useLoaderData, useParams } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewOrder/+types/ViewOrder';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Portal from '@mui/material/Portal';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import i18n from '~/i18n/config';
import routeLoader from '~/router/route-loader';

import { EStatus } from '~/constants/status';

import { PageDataContext, usePageDataCtx } from '~/providers/page-data';
import { usePageDataService } from '~/providers/page-data/service';
import { OrderProvider, useOrderCtx } from '~/providers/order';
import type { IOrderStoreData } from '~/providers/order/store';
import { fetchOrder } from '~/providers/order/data';
import { ReloadPageProvider } from '~/providers/reload-page';
import { useTitlePortalCtx } from '~/providers/title-portal';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import OrderCard from '~/components/orders/OrderCard';
import ClientCard from '~/components/clients/ClientCard';
import CourierCard from '~/components/couriers/CourierCard';
import Map from '~/components/map/Map';
import ErrorBoundary from '~/components/other/ErrorBoundary';
import ReloadButton from '~/components/other/ReloadButton';

const ViewOrder: ComponentType = observer(() => {
  const { t } = useTranslation();
  const { store: orderStore } = useOrderCtx();
  const titlePortalRef = useTitlePortalCtx();
  const errorSnackbar = useErrorSnackbar();
  const { reload } = usePageDataCtx();
  const [isLoading, setIsLoading] = useState(false);

  const order = orderStore.data;

  const reloadPageData = async () => {
    setIsLoading(true);

    try {
      await reload();
    } catch (err) {
      errorSnackbar(err);
    }

    setIsLoading(false);
  }

  return (
    <ReloadPageProvider reloadFunction={reloadPageData} isDefaultReload={false}>
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
                  <ReloadButton
                    isProcessing={isLoading}
                    onReload={reloadPageData}
                  />
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
  const { orderId } = useParams();

  const service = usePageDataService<ILoaderResult>({
    initialData: loaderData,
    loader: () => loader(+orderId!),
  });

  return (
    <PageDataContext.Provider value={service}>
      <OrderProvider initialData={service.state?.orderState}>
        <ViewOrder />
      </OrderProvider>
    </PageDataContext.Provider>
  )
}

export default Wrapper;

interface ILoaderResult {
  orderState: IOrderStoreData;
}

const loader = async (orderId: number) => {
  const orderState: IOrderStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  if (!isNaN(orderId)) {
    const data = await fetchOrder(orderId);
    orderState.data = data;
    orderState.getStatus = EStatus.SUCCESS;
  }

  const hasError = orderState.getStatus === EStatus.ERROR;

  if (hasError) {
    throw orderState.getError;
  }

  const result = {
    orderState,
  };

  return result;
}

export async function clientLoader({ params, request }: Route.ClientLoaderArgs): Promise<ILoaderResult> {
  const orderId = +params.orderId;

  return routeLoader<ILoaderResult>(request.url, async () => {
    return loader(orderId);
  });
}

export { ErrorBoundary };

export function meta({ loaderData }: Route.MetaArgs) {
  const { t } = i18n;
  const order = loaderData?.orderState?.data;

  return [
    { title: t('common_meta.title_template', { title: t('view_order.title', { id: order?.id }) }) },
  ];
}

