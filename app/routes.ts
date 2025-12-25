import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';
import { ROUTE_PATHS } from './router/routes';

export default [
  layout('./layouts/default/LayoutDefault.tsx', [
    index('routes/ViewDashboard/ViewDashboard.tsx'),
    route(ROUTE_PATHS.MAP, './routes/ViewMap/ViewMap.tsx', { id: ROUTE_PATHS.MAP }),
    route(ROUTE_PATHS.COURIERS, './routes/ViewCouriers/ViewCouriers.tsx', { id: ROUTE_PATHS.COURIERS }),
    route(ROUTE_PATHS.COURIER_ADD, './routes/ViewUpsertCourier/ViewUpsertCourier.tsx', { id: ROUTE_PATHS.COURIER_ADD }),
    route(ROUTE_PATHS.COURIER_EDIT, './routes/ViewUpsertCourier/ViewUpsertCourier.tsx', { id: ROUTE_PATHS.COURIER_EDIT }),
    route(ROUTE_PATHS.COURIER, './routes/ViewCourier/ViewCourier.tsx', { id: ROUTE_PATHS.COURIER }),
    route(ROUTE_PATHS.ORDERS, './routes/ViewOrders/ViewOrders.tsx', { id: ROUTE_PATHS.ORDERS }),
    route(ROUTE_PATHS.ORDER, './routes/ViewOrder/ViewOrder.tsx', { id: ROUTE_PATHS.ORDER }),
    route(ROUTE_PATHS.CLIENTS, './routes/ViewClients/ViewClients.tsx', { id: ROUTE_PATHS.CLIENTS }),
    route(ROUTE_PATHS.CLIENT, './routes/ViewClient/ViewClient.tsx', { id: ROUTE_PATHS.CLIENT }),
    route(ROUTE_PATHS.CHANGE_PASSWORD, './routes/ViewChangePassword/ViewChangePassword.tsx', { id: ROUTE_PATHS.CHANGE_PASSWORD }),
  ]),
  layout('./layouts/auth/LayoutAuth.tsx', [
    route(ROUTE_PATHS.LOGIN, './routes/ViewLogin/ViewLogin.tsx', { id: ROUTE_PATHS.LOGIN }),
    route(ROUTE_PATHS.FORGOT_PASSWORD, './routes/ViewForgotPassword/ViewForgotPassword.tsx', { id: ROUTE_PATHS.FORGOT_PASSWORD }),
    route(ROUTE_PATHS.RESET_PASSWORD, './routes/ViewResetPassword/ViewResetPassword.tsx', { id: ROUTE_PATHS.RESET_PASSWORD }),
  ]),
  layout('./layouts/general/LayoutGeneral.tsx', [
    route(ROUTE_PATHS.ABOUT, './routes/ViewAbout/ViewAbout.tsx', { id: ROUTE_PATHS.ABOUT }),
  ]),
] satisfies RouteConfig;
