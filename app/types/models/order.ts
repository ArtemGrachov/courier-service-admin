import type { EOrderStatus } from '~/constants/order';

import type { IClient } from '~/types/models/client';
import type { ICourier } from '~/types/models/courier';

export interface IOrder {
  id: number;
  description: string;
  weight: string;
  size: string;
  volume: string;
  ordered_at: string;
  completed_at: string;
  sender_lat: number;
  sender_lng: number;
  receiver_lat: number;
  receiver_lng: number;
  sender_address: string;
  sender_id: number;
  receiver_address: string;
  receiver_id: number;
  courier_id: number;
  status: EOrderStatus;
  sender: IClient;
  receiver: IClient;
  courier: ICourier | null;
}

