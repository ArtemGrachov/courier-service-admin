import { useMemo, type ComponentType } from 'react';

import { useCouriersCtx } from '~/providers/couriers';
import { useOrdersCtx } from '~/providers/orders';

import MapFilters from '~/components/map-filters/MapFilters';

import type { IClient } from '~/types/models/client';
import type { IFormMapFilters } from '~/types/forms/form-map-filters';

interface IClientsData {
  senderIds: Set<number>;
  receiverIds: Set<number>;
  clientsMap: Record<number, IClient>;
}

const FilterMediator: ComponentType = () => {
  const { store: couriersStore } = useCouriersCtx();
  const { store: ordersStore } = useOrdersCtx();

  const orders = ordersStore.data?.data;

  const { senders, receivers } = useMemo(() => {
    if (!orders) {
      return {
        senders: [],
        receivers: [],
      };
    }

    const { senderIds, receiverIds, clientsMap } = orders.reduce((acc, curr) => {
      const sender = curr.sender;
      const receiver = curr.receiver;

      if (sender) {
        const id = sender.id;
        acc.senderIds.add(id);
        acc.clientsMap[id] = sender;
      }

      if (receiver) {
        const id = receiver.id;
        acc.receiverIds.add(id);
        acc.clientsMap[id] = receiver;
      }

      return acc;
    }, { senderIds: new Set(), receiverIds: new Set(), clientsMap: {} } as IClientsData);

    return {
      senders: Array.from(senderIds).map(id => clientsMap[id]),
      receivers: Array.from(receiverIds).map(id => clientsMap[id]),
    };
  }, [orders]);

  const submitHandler = (formValue: IFormMapFilters) => {
    console.log(formValue);
  }

  return (
    <MapFilters
      couriers={couriersStore.data?.data}
      senders={senders}
      receivers={receivers}
      onSubmit={submitHandler}
    />
  )
}

export default FilterMediator;
