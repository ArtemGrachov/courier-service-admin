import type { EOrderStatus } from '~/constants/order';

import type { IClient } from '~/types/models/client';
import type { ICourier } from '~/types/models/courier';

export interface IOrder {
  id: number;
  clientId: number;
  courierId: number;
  status: EOrderStatus;
  dateTimeOrdered: string;
  dateTimeClosed: string | null;
  client?: IClient;
  courier?: ICourier;
}
