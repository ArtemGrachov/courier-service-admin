import type { EOrderStatus } from '~/constants/order';
import type { IOrder } from '~/types/models/order';
import type { IPagination } from '~/types/other/pagination';

export interface IGetOrdersQuery {
  page?: number | null;
  itemsPerPage?: number | null;
  clientIds?: number[];
  courierIds?: number[];
  statuses?: EOrderStatus[];
}

export interface IGetOrdersResponse {
  data: IOrder[];
  pagination: IPagination;
}

export interface IGetOrderResponse extends IOrder { }
