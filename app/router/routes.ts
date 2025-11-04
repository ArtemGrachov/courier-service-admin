export const ROUTE_PATHS = {
  HOME: '',
  MAP: 'map',
  COURIERS: 'couriers',
  ORDERS: 'orders',
  CLIENTS: 'clients',
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
};


export const ROUTES = Object.entries(ROUTE_PATHS).reduce((acc, [key, value]) => {
  acc[key] = `/${value}`;
  return acc;
}, {} as Record<string, string>)