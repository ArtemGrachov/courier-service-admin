import type { EOrderStatus } from '~/constants/order';

export interface IFormMapFilters {
  orderId?: string | null;
  status?: EOrderStatus | null;
  courierIds?: number[];
  senderIds?: number[];
  receiverIds?: number[];
}

