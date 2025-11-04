import type { ECourierStatus } from '~/constants/couriers';

export interface ICourier {
  id: number;
  name: string;
  status: ECourierStatus;
  currentOrdersCount: number;
  totalOrdersCount: number;
  rating: number;
}
