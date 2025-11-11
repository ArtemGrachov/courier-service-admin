import type { IClient } from '~/types/models/client';
import type { IGetClientsResponse, IGetClientsQuery } from '~/types/api/clients';

import { mockPaginationRequest } from '~/utils/mock-request';

export const fetchClients = async (query?: IGetClientsQuery) => {
  let clients = await import('~/mock-data/clients.json').then(m => m.default as IClient[]);

  if (query?.search) {
    const searchBy = query.search.toLowerCase();
    clients = clients.filter(c => c.name.toLowerCase().includes(searchBy));
  }

  const data = await mockPaginationRequest<IGetClientsResponse, IClient>(
    query?.page ?? 1,
    query?.itemsPerPage ?? 30,
    clients,
  );

  return data!;
}
