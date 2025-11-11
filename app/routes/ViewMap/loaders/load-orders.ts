import type { Route } from '.react-router/types/app/routes/ViewMap/+types/ViewMap';

import { EOrderStatus } from '~/constants/order';
import { EStatus } from '~/constants/status';

import { fetchOrders } from '~/providers/orders/data';
import type { IOrdersStoreData } from '~/providers/orders/store';

import type { IGetOrdersQuery } from '~/types/api/orders';

export async function loadOrders({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const ordersState: IOrdersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const statuses = searchParams.getAll('statuses') as EOrderStatus[];

  if (!statuses.length) {
    statuses.push(EOrderStatus.ORDERED, EOrderStatus.PROCESSING);
  }

  const senderIds = searchParams
    .getAll('senders')
    .map(rawId => +rawId);

  const receiverIds = searchParams
    .getAll('receivers')
    .map(rawId => +rawId);

  const courierIds = searchParams
    .getAll('couriers')
    .map(rawId => +rawId);

  const fetchOrdersQuery: IGetOrdersQuery = {};

  if (statuses) {
    fetchOrdersQuery.statuses = statuses;
  }

  if (senderIds.length) {
    fetchOrdersQuery.senderIds = senderIds;
  }

  if (receiverIds.length) {
    fetchOrdersQuery.senderIds = receiverIds;
  }

  if (courierIds.length) {
    fetchOrdersQuery.courierIds = courierIds;
  }

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
