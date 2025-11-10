import type { IClient } from '~/types/models/client';
import type { IGetClientsResponse, IGetClientsQuery } from '~/types/api/clients';

import { mockPaginationRequest } from '~/utils/mock-request';

export const fetchClients = async (query?: IGetClientsQuery) => {
  const clients = await import('~/mock-data/clients.json').then(m => m.default as IClient[]);
  const data = await mockPaginationRequest<IGetClientsResponse, IClient>(
    query?.page ?? 1,
    query?.itemsPerPage ?? 30,
    clients,
  );

  return data!;
}
