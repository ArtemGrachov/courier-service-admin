import { useRef } from 'react';

import { ClientsStore, type IClientsStoreData } from '~/store/clients.store';

import type { IGetClientsQuery } from '~/types/api/clients';

export const useClientsService = (initialData?: IClientsStoreData) => {
  const clientsStore = useRef<ClientsStore>(null as unknown as ClientsStore);

  if (!clientsStore.current) {
    clientsStore.current = new ClientsStore(initialData);
  }

  const setProcessing = () => {
    clientsStore.current.doGetInit();
  }

  return {
    store: clientsStore.current,
    setProcessing,
  };
}
