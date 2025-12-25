export const ROUTE_PATHS = {
  HOME: '',
  MAP: 'map',
  COURIERS: 'couriers',
  COURIER_ADD: 'couriers/add',
  COURIER_EDIT: 'couriers/:courierId/edit',
  COURIER: 'couriers/:courierId',
  ORDERS: 'orders',
  ORDER: 'orders/:orderId',
  CLIENTS: 'clients',
  CLIENT: 'clients/:clientId',
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password/:token',
  CHANGE_PASSWORD: 'change-password',
  ABOUT: 'about'
};

export const ROUTES = Object.entries(ROUTE_PATHS).reduce((acc, [key, value]) => {
  acc[key as keyof typeof ROUTE_PATHS] = `/${value}`;
  return acc;
}, {} as Record<keyof typeof ROUTE_PATHS, string>);
