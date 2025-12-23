import type { ECourierStatus } from '~/constants/couriers';
import type { IGeoPos } from '~/types/models/geo-pos';

export interface ICourier {
  id: number;
  email: string;
  status: ECourierStatus;
  name: string;
  phone: string;
  position_id: number;
  position?: IGeoPos;
  active_orders_count: number;
  completed_orders_count: number;
  total_orders_count: number;
  rating: number;
  rating_count: number;
}
