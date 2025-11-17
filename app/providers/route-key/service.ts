import { useState } from 'react';

export const useRouteKeyService = () => {
  const [routeKey, setRouteKey] = useState(0);
  const updateRouteKey = () => {
    setRouteKey(v => v + 1);
  }

  return {
    routeKey,
    updateRouteKey,
  };
}

