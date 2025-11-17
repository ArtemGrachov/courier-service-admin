import { useEffect, useRef } from 'react';

import { ClientsStore, type IClientsStoreData } from '~/store/clients.store';

export const useClientsService = (initialData?: IClientsStoreData) => {
  const clientsStore = useRef<ClientsStore>(null as unknown as ClientsStore);

  if (!clientsStore.current) {
    clientsStore.current = new ClientsStore(initialData);
  }

  const setProcessing = () => {
    clientsStore.current.doGetInit();
  }

  useEffect(() => {
    if (!initialData) {
      return;
    }

    clientsStore.current.setData(initialData);
  }, [initialData]);

  return {
    store: clientsStore.current,
    setProcessing,
  };
}
