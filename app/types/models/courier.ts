import type { ECourierStatus } from '~/constants/couriers';

export interface ICourier {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: ECourierStatus;
  currentOrdersCount: number;
  totalOrdersCount: number;
  rating: number;
}
