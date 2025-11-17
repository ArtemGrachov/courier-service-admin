import { EOrderStatus } from '~/constants/order';

export const ALLOWED_ORDER_STATUSES = new Set([
  EOrderStatus.ORDERED,
  EOrderStatus.PROCESSING,
]);
