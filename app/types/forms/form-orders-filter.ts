import type { EOrderStatus } from '~/constants/order';
import type { ESortDirection } from '~/constants/sort';

export interface IFormOrdersFilter {
  page?: number | null;
  itemsPerPage?: number | null;
  statuses?: EOrderStatus[] | null;
  courierIds?: number[];
  sendersIds?: number[];
  receiverIds?: number[];
  dateTimeOrderedSort?: ESortDirection | null;
  dateTimeClosedSort?: ESortDirection | null;
}

