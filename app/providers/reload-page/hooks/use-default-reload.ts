import { useNavigate } from 'react-router';

import { useRouteKeyCtx } from '~/providers/route-key';

export const useDefaultReload = () => {
  const routeKeyCtx = useRouteKeyCtx();
  const navigate = useNavigate();

  return async () => {
    await navigate('.', { replace: true });

    if (routeKeyCtx) {
      routeKeyCtx.updateRouteKey();
    }
  }
}

