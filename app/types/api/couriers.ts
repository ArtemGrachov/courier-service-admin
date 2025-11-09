import type { ICourier } from '~/types/models/courier';
import type { IPagination } from '~/types/other/pagination';

export interface IGetCouriersQuery {
  page?: number | null;
  itemsPerPage?: number | null;
  courierIds?: number[];
}

export interface IGetCouriersResponse {
  data: ICourier[];
  pagination: IPagination;
}

export interface IGetCourierResponse extends ICourier { }
