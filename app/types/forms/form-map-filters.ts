import type { EOrderStatus } from '~/constants/order';

export interface IFormMapFilters {
  status?: EOrderStatus | null;
  courierIds?: number[];
  senderIds?: number[];
  receiverIds?: number[];
}
