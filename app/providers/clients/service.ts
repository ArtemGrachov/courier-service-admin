import { useRef } from 'react';

import { ClientsStore, type IClientsStoreData } from '~/store/clients.store';

import type { IGetClientsQuery } from '~/types/api/clients';

import { fetchClients } from '../../data/fetch-clients';

export const useClientsService = (initialData?: IClientsStoreData) => {
  const clientsStore = useRef<ClientsStore>(null as unknown as ClientsStore);

  if (!clientsStore.current) {
    clientsStore.current = new ClientsStore(initialData);
  }

  const fetch = async (query?: IGetClientsQuery) => {
    try {
      clientsStore.current.doGetInit();
      const data = await fetchClients(query)
      clientsStore.current.doGetSuccess(data);
    } catch (err) {
      clientsStore.current.doGetError(err);
      throw err;
    }
  }

  return {
    store: clientsStore.current,
    fetch,
  };
}
