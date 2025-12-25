import { HttpClient } from '~/providers/http-client/http-client';

import type { IGetOrderResponse } from '~/types/api/orders';

export const fetchOrder = async (orderId: number) => {
  const httpClient = HttpClient.instance.httpClient;

  const { data } = await httpClient.get<IGetOrderResponse>(`/orders/${orderId}`);

  return data!;
}

