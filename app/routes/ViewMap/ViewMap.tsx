import { useRef, useState, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import { observer } from 'mobx-react-lite';
import { useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Route } from '.react-router/types/app/routes/ViewMap/+types/ViewMap';

import i18n from '~/i18n/config';
import routeLoader from '~/router/route-loader';

import { PageDataContext, usePageDataCtx } from '~/providers/page-data';
import { usePageDataService } from '~/providers/page-data/service';
import { MapFiltersProvider, useMapFiltersCtx } from './providers/map-filters';
import { CouriersProvider, useCouriersCtx } from '~/providers/couriers';
import { OrdersProvider, useOrdersCtx } from '~/providers/orders';
import OrderFilterProvider from '~/providers/order-filters';
import { useTitlePortalCtx } from '~/providers/title-portal';
import { ReloadPageProvider } from '~/providers/reload-page';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import MapFilters from '~/components/map-filters/MapFilters';
import Map from '~/components/map/Map';
import ErrorBoundary from '~/components/other/ErrorBoundary';
import ReloadButton from '~/components/other/ReloadButton';

import type { IFormMapFilters } from '~/types/forms/form-map-filters';
import type { IOrdersStoreData } from '~/providers/orders/store';
import type { ICouriersStoreData } from '~/store/couriers.store';

import { loadOrders } from './loaders/load-orders';
import { loadCouriers } from './loaders/load-couriers';
import { EStatus } from '~/constants/status';

const ViewMap: ComponentType = observer(() => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const errorSnackbar = useErrorSnackbar();

  const { store: couriersStore } = useCouriersCtx();
  const { store: ordersStore } = useOrdersCtx();
  const { store: mapFiltersStore, handleUpdate } = useMapFiltersCtx();
  const { reload } = usePageDataCtx();

  const titlePortalRef = useTitlePortalCtx();

  const orders = ordersStore.data?.data;

  const submitHandler = (formValue: IFormMapFilters) => {
    handleUpdate(formValue);
  }

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
        {t('view_map.title')}
      </Portal>
      <Box height="100%" position="relative">
        <Card sx={{ position: 'absolute', top: 8, right: 8, padding: 1, zIndex: 1300 }}>
          <Stack direction="row" alignItems="center" gap={2}>
            <ReloadButton
              isProcessing={isLoading}
              onReload={reloadPageData}
            />
            <MapFilters
              formValue={mapFiltersStore.formValue}
              onSubmit={submitHandler}
            />
          </Stack>
        </Card>
        <Map
          couriers={couriersStore.data?.items}
          orders={orders}
          showPopupOrderData={true}
        />
      </Box>
    </ReloadPageProvider>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  const service = usePageDataService<ILoaderResult>({
    initialData: loaderData,
    loader: () => loader(location.href),
    updateCondition: newState => (
      newState?.ordersState?.getStatus !== EStatus.ERROR &&
      newState?.couriersState?.getStatus !== EStatus.ERROR
    ),
  });

  return (
    <PageDataContext value={service}>
      <OrdersProvider initialData={service.state?.ordersState}>
        <CouriersProvider initialData={service.state?.couriersState}>
          <MapFiltersProvider>
            <OrderFilterProvider>
              <ViewMap />
            </OrderFilterProvider>
          </MapFiltersProvider>
        </CouriersProvider>
      </OrdersProvider>
    </PageDataContext>
  )
}

export default Wrapper;

interface ILoaderResult {
  ordersState: IOrdersStoreData;
  couriersState: ICouriersStoreData;
}

const loader = async (url: string) => {
    const [ordersState, couriersState] = await Promise.all([
      loadOrders(url),
      loadCouriers(url),
    ]);

    const hasError = ordersState.getStatus === EStatus.ERROR || couriersState.getStatus === EStatus.ERROR;

    if (hasError) {
      throw ordersState.getError || couriersState.getError;
    }

    const result = {
      ordersState,
      couriersState,
    };

    return result;
}

export async function clientLoader(loaderArgs: Route.ClientLoaderArgs): Promise<ILoaderResult> {
  const url = loaderArgs.request.url;
  return routeLoader<ILoaderResult>(url, async () => loader(url));
}

export { ErrorBoundary };

export function meta() {
  const { t } = i18n;

  return [
    { title: t('common_meta.title_template', { title: t('view_map.title') }) },
  ];
}

