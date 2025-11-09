import type { EOrderStatus } from '~/constants/order';

export interface IFormMapFilters {
  statuses?: EOrderStatus[];
  courierIds?: number[];
  sendersIds?: number[];
  receiverIds?: number[];
}
