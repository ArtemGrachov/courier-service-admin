import { type RouteConfig, index, layout } from '@react-router/dev/routes';

export default [
  layout('./layouts/default/LayoutDefault.tsx', [
    index('routes/home.tsx'),
  ]),
] satisfies RouteConfig;
