import { type ComponentType, useEffect, useState } from 'react';

import { useModalsCtx } from '~/providers/modals/hooks/use-modals-ctx';

import type { IModalItem } from '~/providers/modals/types';

const ModalRoot: ComponentType = () => {
  const { subscribe } = useModalsCtx();
  const [modals, setModals] = useState<IModalItem[]>([]);

  useEffect(() => {
    const unsubscribe = subscribe(mds => setModals(mds));

    return () => unsubscribe();
  }, []);

  return (
    <>
      {modals.map(({ id, component, props, closing, close }) => {
        const Component = component;

        return (
          <Component
            key={id}
            id={id}
            close={close}
            closing={closing}
            {...(props ?? {})}
          />
        )
      })}
    </>
  )
}

export default ModalRoot;
