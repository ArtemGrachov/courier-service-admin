import type { ECourierStatus } from '~/constants/couriers';
import type { IGeoPos } from '~/types/models/geo-pos';

export interface ICourier {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: ECourierStatus;
  currentOrdersCount: number;
  totalOrdersCount: number;
  rating: number;
  location: IGeoPos;
}
