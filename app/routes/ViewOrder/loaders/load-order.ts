import { EStatus } from '~/constants/status';

import { fetchOrder } from '~/providers/order/data';

import type { IOrderStoreData } from '~/providers/order/store';

export async function loadOrder(orderId: number) {
  const orderState: IOrderStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  try {
    const data = await fetchOrder(orderId);
    orderState.data = data;
    orderState.getStatus = EStatus.SUCCESS;
  } catch (err) {
    orderState.getError = err;
    orderState.getStatus = EStatus.ERROR;
  }

  return orderState;
}

