import { useRef } from 'react';

import type { IModalItem, IModalOptions } from './types';

export const useModalService = () => {
  const modals = useRef<IModalItem[]>([]);
  const callbacks = useRef<Function[]>([]);

  const openModal = <T,>({ id, component, props }: IModalOptions<T>) => {
    const item = {
      id,
      component,
      props,
      close: () => close(item),
    };

    modals.current = [...modals.current, item];
    update();

    return item.close;
  }

  const closeModalById = (id: string | number) => {
    const item = modals.current.find(i => i.id === id);

    if (!item) {
      return;
    }

    close(item);
  }

  const close = async (item: IModalItem) => {
    modals.current = modals.current.map(i => {
      if (i.id !== item.id) {
        return i;
      }

      return {
        ...i,
        closing: true,
      }
    });

    update();

    const closeTimeoutMs = item.closeTimeoutMs ?? 200;

    if (closeTimeoutMs) {
      await new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();
        }, closeTimeoutMs);
      })
    }

    modals.current = modals.current.filter(i => i.id !== item.id);

    update();

    if (item.onClosed) {
      item.onClosed();
    }
  }

  const update = () => {
    callbacks.current.forEach(cb => cb(modals.current));
  }

  const subscribe = (callback: (modals: IModalItem[]) => any) => {
    callbacks.current.push(callback);

    return () => {
      const index = callbacks.current.indexOf(callback);
      callbacks.current.splice(index, 1);
    }
  }

  return {
    subscribe,
    openModal,
    closeModalById,
  };
}
