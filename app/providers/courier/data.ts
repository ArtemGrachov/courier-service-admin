import { HttpClient } from '~/providers/http-client/http-client';

import type { ICourier } from '~/types/models/courier';

export const fetchCourier = async (courierId: number) => {
  const httpClient = HttpClient.instance.httpClient;

  const { data } = await httpClient.get<ICourier>(`/courier/${courierId}`);

  return data;
}

