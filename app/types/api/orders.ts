import type { EOrderStatus } from '~/constants/order';
import type { ESortDirection } from '~/constants/sort';

import type { IOrder } from '~/types/models/order';
import type { IPagination } from '~/types/other/pagination';

export interface IGetOrdersQuery {
  page?: number | null;
  itemsPerPage?: number | null;
  clientIds?: number[];
  courierIds?: number[];
  senderIds?: number[];
  receiverIds?: number[];
  statuses?: EOrderStatus[];
  dateTimeOrderedSort?: ESortDirection | null;
  dateTimeClosedSort?: ESortDirection | null;
  search?: string | null;
  id?: string | null;
}

export interface IGetOrdersResponse {
  items: IOrder[];
  pagination: IPagination;
}

export interface IGetOrderResponse extends IOrder { }
