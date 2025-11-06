import { useMemo, useState, type ComponentType } from 'react';
import { useLoaderData, useParams } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewCourier/+types/ViewCourier';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import { EStatus } from '~/constants/status';

import { CourierProvider, useCourierCtx } from '~/providers/courier';
import type { ICourierStoreData } from '~/providers/courier/store';
import { fetchCourier } from '~/providers/courier/data';

import { OrdersProvider, useOrdersCtx } from '~/providers/orders';
import type { IOrdersStoreData } from '~/providers/orders/store';
import { fetchOrders } from '~/providers/orders/data';

import { ReloadPageProvider } from '~/providers/reload-page';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import PageError from '~/components/other/PageError';
import OrdersTable from '~/components/orders/OrdersTable';

interface IProps {
  courierLoadingError?: boolean;
  ordersLoadingError?: boolean;
}

const ViewCourier: ComponentType<IProps> = observer(({ courierLoadingError, ordersLoadingError }) => {
  const { t } = useTranslation();
  const { courierId: rawCourierId } = useParams();
  const { store: courierStore, fetch: fetchCourier } = useCourierCtx();
  const { store: ordersStore, fetch: fetchOrders } = useOrdersCtx();
  const errorSnackbar = useErrorSnackbar();

  const [showCourierError, setShowCourierError] = useState(courierLoadingError);
  const [showOrdersError, setShowOrdersError] = useState(ordersLoadingError);

  const showPageError = useMemo(() => {
    return showCourierError && showOrdersError;
  }, [showCourierError, showOrdersError]);

  const courierId = useMemo(() => {
    return +rawCourierId!;
  }, [rawCourierId])


  const courier = courierStore.data;

  const reloadCourierData = async () => {
    if (courierStore.isProcessing) {
      return;
    }

    try {
      await fetchCourier(courierId);
      setShowCourierError(false);
    } catch (err) {
      console.error(err);
      errorSnackbar(err);
    }
  }

  const reloadOrdersData = async () => {
    if (ordersStore.isProcessing) {
      return;
    }

    try {
      await fetchOrders({ courierIds: [courierId] });
      setShowOrdersError(false);
    } catch (err) {
      console.error(err);
      errorSnackbar(err);
    }
  }

  const reloadPageData = async () => {
    await Promise.all([
      reloadCourierData(),
      reloadOrdersData(),
    ]);
  }

  return (
    <Box
      flexDirection="column"
      display="flex"
      gap={2}
      padding={3}
      width="100%"
      boxSizing="border-box"
      flexGrow={1}
    >
      <ReloadPageProvider reloadFunction={reloadPageData}>
        {showPageError && (
          <PageError
            isProcessing={courierStore.isProcessing || ordersStore.isProcessing}
            error={courierStore.getError || ordersStore.getError}
          />
        )}
      </ReloadPageProvider>
      <ReloadPageProvider reloadFunction={reloadCourierData}>
        {!showPageError && showCourierError && (
          <PageError
            title={t('view_courier.error_courier_data')}
            isProcessing={courierStore.isProcessing}
            error={courierStore.getError}
          />
        )}
      </ReloadPageProvider>
      {!showCourierError && courier && (
        // @todo
        // <CourierDetails courier={courier} />
        <div>@todo</div>
      )}
      <ReloadPageProvider reloadFunction={reloadOrdersData}>
        {!showPageError && showOrdersError && (
          <PageError
            title={t('view_courier.error_orders_data')}
            isProcessing={ordersStore.isProcessing}
            error={ordersStore.getError}
          />
        )}
      </ReloadPageProvider>
      {!showOrdersError && ordersStore.data && (
        <OrdersTable
          items={ordersStore.data?.data}
          isProcessing={ordersStore.isProcessing}
        />
      )}
    </Box>
  )
})

const Wrapper: ComponentType = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <OrdersProvider initialData={loaderData.ordersState}>
      <CourierProvider initialData={loaderData.courierState}>
        <ViewCourier
          courierLoadingError={loaderData.courierState.getStatus === EStatus.ERROR}
          ordersLoadingError={loaderData.ordersState.getStatus === EStatus.ERROR}
        />
      </CourierProvider>
    </OrdersProvider>
  )
}

export default Wrapper;

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const courierId = +params.courierId;

  const courierState: ICourierStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const ordersState: IOrdersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  }

  if (!isNaN(courierId)) {
    await Promise.all([
      fetchCourier(courierId)
        .then(data => {
          courierState.data = data;
          courierState.getStatus = EStatus.SUCCESS;
        })
        .catch(err => {
          courierState.getError = err;
          courierState.getStatus = EStatus.ERROR;
        }),
      fetchOrders({ courierIds: [courierId] })
        .then(data => {
          ordersState.data = data;
          ordersState.getStatus = EStatus.SUCCESS;
        })
        .catch(err => {
          ordersState.getError = err;
          ordersState.getStatus = EStatus.ERROR;
        })
    ]);
  }

  return {
    courierState,
    ordersState,
  };
}
