import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';
import { ROUTE_PATHS, ROUTES } from './router/routes';

export default [
  layout('./layouts/default/LayoutDefault.tsx', [
    index('routes/home.tsx'),
    route(ROUTE_PATHS.MAP, './routes/EmptyPlaceholder.tsx', { id: ROUTE_PATHS.MAP }),
    route(ROUTE_PATHS.COURIERS, './routes/ViewCouriers/ViewCouriers.tsx', { id: ROUTE_PATHS.COURIERS }),
    route(ROUTE_PATHS.ORDERS, './routes/EmptyPlaceholder.tsx', { id: ROUTE_PATHS.ORDERS }),
    route(ROUTE_PATHS.CLIENTS, './routes/EmptyPlaceholder.tsx', { id: ROUTE_PATHS.CLIENTS }),
  ]),
  layout('./layouts/auth/LayoutAuth.tsx', [
    route(ROUTE_PATHS.LOGIN, './routes/ViewLogin/ViewLogin.tsx', { id: ROUTE_PATHS.LOGIN }),
    route(ROUTE_PATHS.FORGOT_PASSWORD, './routes/ViewForgotPassword/ViewForgotPassword.tsx', { id: ROUTE_PATHS.FORGOT_PASSWORD }),
    route(ROUTE_PATHS.RESET_PASSWORD, './routes/ViewResetPassword/ViewResetPassword.tsx', { id: ROUTE_PATHS.RESET_PASSWORD }),
  ]),
] satisfies RouteConfig;
