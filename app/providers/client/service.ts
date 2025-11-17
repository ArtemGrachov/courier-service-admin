import { useRef } from 'react';

import { ClientStore, type IClientStoreData } from './store';

export const useClientService = (initialData?: IClientStoreData) => {
  const clientStore = useRef<ClientStore>(null as unknown as ClientStore);

  if (!clientStore.current) {
    clientStore.current = new ClientStore(initialData);
  }

  const setProcessing = () => {
    clientStore.current.doGetInit();
  }

  return {
    store: clientStore.current,
    setProcessing,
  };
}
