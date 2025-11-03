import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';
import { ROUTES } from './router/routes';

export default [
  layout('./layouts/default/LayoutDefault.tsx', [
    index('routes/home.tsx'),
    route(ROUTES.MAP, './routes/EmptyPlaceholder.tsx', { id: ROUTES.MAP }),
    route(ROUTES.COURIERS, './routes/EmptyPlaceholder.tsx', { id: ROUTES.COURIERS }),
    route(ROUTES.ORDERS, './routes/EmptyPlaceholder.tsx', { id: ROUTES.ORDERS }),
    route(ROUTES.CLIENTS, './routes/EmptyPlaceholder.tsx', { id: ROUTES.CLIENTS }),
  ]),
  layout('./layouts/auth/LayoutAuth.tsx', [
    route(ROUTES.LOGIN, './routes/ViewLogin.tsx', { id: ROUTES.LOGIN }),
    route(ROUTES.FORGOT_PASSWORD, './routes/EmptyPlaceholder.tsx', { id: ROUTES.FORGOT_PASSWORD }),
    route(ROUTES.RESET_PASSWORD, './routes/EmptyPlaceholder.tsx', { id: ROUTES.RESET_PASSWORD }),
  ]),
] satisfies RouteConfig;
