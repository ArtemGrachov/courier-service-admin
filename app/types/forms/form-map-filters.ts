import type { EOrderStatus } from '~/constants/order';

export interface IFormMapFilters {
  statuses?: EOrderStatus[];
  courierIds?: number[];
  senderIds?: number[];
  receiverIds?: number[];
}
