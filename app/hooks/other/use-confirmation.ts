import { lazy, type ReactNode } from 'react';
import { useModalsCtx } from '~/providers/modals/hooks/use-modals-ctx'

const ModalConfirmation = lazy(() => import('~/components/modals/ModalConfirmation'));

interface IOptions {
  title?: ReactNode
  question?: ReactNode
  confirmLabel?: ReactNode
  rejectLabel?: ReactNode
}

export const useConfirmation = () => {
  const { openModal } = useModalsCtx();

  return async (options?: IOptions) => {
    return new Promise<boolean>((resolve) => {
      openModal({
        id: 'confirmation',
        component: ModalConfirmation,
        props: {
          title: options?.title,
          question: options?.question,
          confirmLabel: options?.confirmLabel,
          rejectLabel: options?.rejectLabel,
          onAnswer: confirm => {
            resolve(confirm)
          },
        },
      });
    });
  }
}
