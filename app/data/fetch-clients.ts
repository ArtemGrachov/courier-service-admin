import type { IClient } from '~/types/models/client';
import type { IGetClientsResponse, IGetClientsQuery } from '~/types/api/clients';

import { mockPaginationRequest } from '~/utils/mock-request';
import { ESortDirection } from '~/constants/sort';

export const fetchClients = async (query?: IGetClientsQuery) => {
  let clients = await import('~/mock-data/clients.json').then(m => m.default as IClient[]);

  const nameSearch = query?.nameSearch ?? query?.search;
  const phoneSearch = query?.phoneSearch ?? query?.search;
  const emailSearch = query?.emailSearch ?? query?.search;

  const hasSearch = nameSearch != null || phoneSearch != null || emailSearch != null;

  if (hasSearch) {
    const searchByName = nameSearch?.toLowerCase();
    const searchByPhone = phoneSearch?.toLowerCase();
    const searchByEmail = emailSearch?.toLowerCase();

    clients = clients.filter(client => {
      if (searchByName != null && client.name.toLowerCase().includes(searchByName)) {
        return true;
      }

      if (searchByEmail != null && client.name.toLowerCase().includes(searchByEmail)) {
        return true;
      }

      if (searchByPhone != null && client.phoneNumber.toLowerCase().replaceAll(' ', '').includes(searchByPhone)) {
        return true;
      }

      return false;
    })
  }

  if (query?.courierIds) {
    const set = new Set(query.courierIds);
    clients = clients.filter(c => set.has(c.id));
  }

  if (query?.nameSort) {
    const direction = query.nameSort === ESortDirection.ASC ? 1 : -1;

    clients = [...clients].sort((a, b) => {
      return a.name > b.name ? direction : a.name < b.name ? -direction : 0;
    });
  }

  if (query?.currentOrdersCountSort) {
    const direction = query.currentOrdersCountSort === ESortDirection.ASC ? 1 : -1;

    clients = [...clients].sort((a, b) => {
      return Math.sign(a.currentOrdersCount -b.currentOrdersCount) * direction;
    });
  }

  if (query?.totalOrdersCountSort) {
    const direction = query.totalOrdersCountSort === ESortDirection.ASC ? 1 : -1;

    clients = [...clients].sort((a, b) => {
      return Math.sign(a.totalOrdersCount -b.totalOrdersCount) * direction;
    });
  }

  if (query?.ratingSort) {
    const direction = query.ratingSort === ESortDirection.ASC ? 1 : -1;

    clients = [...clients].sort((a, b) => {
      return Math.sign(a.rating -b.rating) * direction;
    });
  }

  const data = await mockPaginationRequest<IGetClientsResponse, IClient>(
    query?.page ?? 1,
    query?.itemsPerPage ?? 30,
    clients,
  );

  return data!;
}
