import { DEFAULT_ORDER_FILTERS } from '../constants/orders-filter';
import { EStatus } from '~/constants/status';

import type { IOrdersStoreData } from '~/providers/orders/store';
import { fetchOrders } from '~/data/fetch-orders';

import type { IGetOrdersQuery } from '~/types/api/orders';

export async function loadOrders(clientId: number) {
  const ordersState: IOrdersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const fetchOrdersQuery: IGetOrdersQuery = DEFAULT_ORDER_FILTERS;

  Object.assign(fetchOrdersQuery, { clientIds: [clientId] });

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
