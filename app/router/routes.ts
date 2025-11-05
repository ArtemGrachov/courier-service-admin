export const ROUTE_PATHS = {
  HOME: '',
  MAP: 'map',
  COURIERS: 'couriers',
  COURIER_ADD: 'couriers/add',
  ORDERS: 'orders',
  CLIENTS: 'clients',
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password/:token',
};

export const ROUTES = Object.entries(ROUTE_PATHS).reduce((acc, [key, value]) => {
  acc[key as keyof typeof ROUTE_PATHS] = `/${value}`;
  return acc;
}, {} as Record<keyof typeof ROUTE_PATHS, string>);
