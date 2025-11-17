import { DEFAULT_CLIENT_FILTERS } from '../constants/clients-filter';
import { EStatus } from '~/constants/status';

import { routeQueryToFormValue } from '../providers/clients-filter/utils';
import type { IClientsStoreData } from '~/store/clients.store';

import type { IGetClientsQuery } from '~/types/api/clients';

import { fetchClients } from '~/data/fetch-clients';

export async function loadClients(requestUrl: string) {
  const url = new URL(requestUrl);
  const searchParams = url.searchParams;

  const clientsState: IClientsStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const formValue = routeQueryToFormValue(searchParams);

  const fetchClientsQuery: IGetClientsQuery = DEFAULT_CLIENT_FILTERS;

  Object.assign(fetchClientsQuery, formValue);

  try {
    const data = await fetchClients(fetchClientsQuery);
    clientsState.data = data;
    clientsState.getStatus = EStatus.SUCCESS;
  } catch (err) {
    clientsState.getError = err;
    clientsState.getStatus = EStatus.ERROR;
  }

  return clientsState;
}
