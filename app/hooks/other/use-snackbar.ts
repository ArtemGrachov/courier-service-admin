import { lazy, type ReactNode } from 'react';
import type { AlertColor } from '@mui/material/Alert';

import { useModalsCtx } from '~/providers/modals/hooks/use-modals-ctx'

const Snackbar = lazy(() => import('~/components/snackbars/Snackbar'));

interface IOptions {
  content: ReactNode;
  severity?: AlertColor
}

export const useSnackbar = () => {
  const { openModal } = useModalsCtx();

  return async (options?: IOptions) => {
    return new Promise<boolean>((resolve) => {
      openModal({
        component: Snackbar,
        props: {
          children: options?.content,
          severity: options?.severity,
        },
      });
    });
  }
}
