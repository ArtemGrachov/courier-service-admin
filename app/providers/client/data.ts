import { HttpClient } from '~/providers/http-client/http-client';

import type { IClient } from '~/types/models/client';

export const fetchClient = async (clientId: number) => {
  const httpClient = HttpClient.instance.httpClient;

  const { data } = await httpClient.get<IClient>(`/client/${clientId}`);

  return data;
}

