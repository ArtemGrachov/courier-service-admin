import { useRef } from 'react';

import { ClientStore, type IClientStoreData } from './store';

import { fetchClient } from './data';

export const useClientService = (initialData?: IClientStoreData) => {
  const clientStore = useRef<ClientStore>(null as unknown as ClientStore);

  if (!clientStore.current) {
    clientStore.current = new ClientStore(initialData);
  }

  const fetch = async (clientId: number) => {
    try {
      clientStore.current.doGetInit();

      const data = await fetchClient(clientId)

      clientStore.current.doGetSuccess(data);
    } catch (err) {
      clientStore.current.doGetError(err);
      throw err;
    }
  }

  return {
    store: clientStore.current,
    fetch,
  };
}
