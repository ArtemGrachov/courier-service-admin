import { EStatus } from '~/constants/status';

import type { IOrdersStoreData } from '~/providers/orders/store';
import { fetchOrders } from '~/data/fetch-orders';

import type { IGetOrdersQuery } from '~/types/api/orders';
import { EOrderStatus } from '~/constants/order';

export async function loadOrders() {
  const ordersState: IOrdersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const fetchOrdersQuery: IGetOrdersQuery = {
    itemsPerPage: 5,
    statuses: [EOrderStatus.ORDERED, EOrderStatus.PROCESSING],
  };

  try {
    const data = await fetchOrders(fetchOrdersQuery);
    ordersState.data = data;
    ordersState.getStatus = EStatus.SUCCESS;
  } catch (err) {
    ordersState.getError = err;
    ordersState.getStatus = EStatus.ERROR;
  }

  return ordersState;
}

