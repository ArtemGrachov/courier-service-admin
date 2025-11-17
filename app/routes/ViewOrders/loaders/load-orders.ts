import { DEFAULT_ORDER_FILTERS } from '~/constants/orders';
import { EStatus } from '~/constants/status';

import { routeQueryToFormValue } from '../providers/orders-filter/utils';
import type { IOrdersStoreData } from '~/providers/orders/store';
import { fetchOrders } from '~/data/fetch-orders';

import type { IGetOrdersQuery } from '~/types/api/orders';

export async function loadOrders(requestUrl: string) {
  const url = new URL(requestUrl);
  const searchParams = url.searchParams;

  const ordersState: IOrdersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const formValue = routeQueryToFormValue(searchParams);

  const fetchOrdersQuery: IGetOrdersQuery = DEFAULT_ORDER_FILTERS;

  Object.assign(fetchOrdersQuery, formValue);

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
