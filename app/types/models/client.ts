export interface IClient {
  id: number;
  email: string;
  name: string;
  phone: string;
  active_orders_count: number;
  completed_orders_count: number;
  total_orders_count: number;
  rating: number;
  rating_count: number;
}

