import type { IClient } from '~/types/models/client';
import type { IGetClientsResponse, IGetClientsQuery } from '~/types/api/clients';

import { mockPaginationRequest } from '~/utils/mock-request';
import { ESortDirection } from '~/constants/sort';

export const fetchClients = async (query?: IGetClientsQuery) => {
  let clients = await import('~/mock-data/clients.json').then(m => m.default as IClient[]);

  const nameSearch = query?.nameSearch ?? query?.search;
  const phoneSearch = query?.phoneSearch ?? query?.search;
  const emailSearch = query?.emailSearch ?? query?.search;

  if (nameSearch) {
    const searchBy = nameSearch.toLowerCase();
    clients = clients.filter(c => c.name.toLowerCase().includes(searchBy));
  }

  if (phoneSearch) {
    const searchBy = phoneSearch.toLowerCase();
    clients = clients.filter(c => c.phoneNumber.toLowerCase().replaceAll(' ', '').includes(searchBy));
  }

  if (emailSearch) {
    const searchBy = emailSearch.toLowerCase();
    clients = clients.filter(c => c.email.toLowerCase().includes(searchBy));
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
