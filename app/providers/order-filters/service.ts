import { useRef } from 'react';

import { Cache } from '~/cache/Cache';

import { ClientsStore } from '~/store/clients.store';
import { CouriersStore } from '~/store/couriers.store';

import { fetchCouriers as apiFetchCouriers } from '~/data/fetch-couriers';
import { fetchClients } from '~/data/fetch-clients';

import type { IGetCouriersQuery } from '~/types/api/couriers';
import type { IGetClientsQuery } from '~/types/api/clients';

export const useOrderFiltersService = () => {
  const couriersStore = useRef<CouriersStore>(null as unknown as CouriersStore);
  const sendersStore = useRef<ClientsStore>(null as unknown as ClientsStore);
  const receiversStore = useRef<ClientsStore>(null as unknown as ClientsStore);

  if (!couriersStore.current) {
    couriersStore.current = new CouriersStore();
  }

  if (!sendersStore.current) {
    sendersStore.current = new ClientsStore();
  }

  if (!receiversStore.current) {
    receiversStore.current = new ClientsStore();
  }

  const cachedSearch = async <T, >(
    key: string,
    query: any,
    request: () => Promise<T>,
  ) => {
    const cache = Cache.instance;
    const cacheKey = key + JSON.stringify(query);
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const result = await request();
    cache.set(cacheKey, result);

    return result;
  }

  const fetchCouriers = async (query?: IGetCouriersQuery) => {
    try {
      couriersStore.current.doGetInit();
      const data = await cachedSearch('couriers', query, () => apiFetchCouriers(query));
      couriersStore.current.doGetSuccess(data);
    } catch (err) {
      couriersStore.current.doGetError(err);
      throw err;
    }
  }

  const fetchSenders = async (query?: IGetClientsQuery) => {
    try {
      sendersStore.current.doGetInit();
      const data = await cachedSearch('clients', query, () => fetchClients(query));
      sendersStore.current.doGetSuccess(data);
    } catch (err) {
      sendersStore.current.doGetError(err);
      throw err;
    }
  }

  const fetchReceivers = async (query?: IGetClientsQuery) => {
    try {
      receiversStore.current.doGetInit();
      const data = await cachedSearch('clients', query, () => fetchClients(query));
      receiversStore.current.doGetSuccess(data);
    } catch (err) {
      receiversStore.current.doGetError(err);
      throw err;
    }
  }

  return {
    couriersStore: couriersStore.current,
    sendersStore: sendersStore.current,
    receiversStore: receiversStore.current,
    fetchCouriers,
    fetchSenders,
    fetchReceivers,
  };
}
