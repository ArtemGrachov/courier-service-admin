import type { IClient } from '~/types/models/client';
import { mockRequest } from '~/utils/mock-request';

export const fetchClient = async (clientId: number) => {
  const clients = await import('~/mock-data/clients.json').then(m => m.default as IClient[]);
  const client = clients.find(c => c.id === clientId);
  const data = await mockRequest(client);

  if (!data) {
    throw new Error('404');
  }

  return data;
}
