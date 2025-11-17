import { useNavigate, useSearchParams } from 'react-router';

import { useRouteKeyCtx } from '~/providers/route-key';

export const useDefaultReload = () => {
  const routeKeyCtx = useRouteKeyCtx();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return async () => {
    await navigate({
      search: searchParams.toString(),
    }, { replace: true });

    if (routeKeyCtx) {
      routeKeyCtx.updateRouteKey();
    }
  }
}

