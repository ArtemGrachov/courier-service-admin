import type { ComponentType } from 'react';
import { useLoaderData } from 'react-router';
import type { Route } from '.react-router/types/app/routes/ViewOrder/+types/ViewOrder';

import { EStatus } from '~/constants/status';

import { OrderProvider, useOrderCtx } from '~/providers/order';
import type { IOrderStoreData } from '~/providers/order/store';
import { fetchOrder } from '~/providers/order/data';

const ViewOrder: ComponentType = () => {
  const { store: orderStore } = useOrderCtx();

  return (
    <div>
      @todo
    </div>
  )
}

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
