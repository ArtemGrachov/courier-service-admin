import type { ICourier } from '~/types/models/courier';
import type { IPagination } from '~/types/other/pagination';

export interface IGetCouriersQuery {
  search?: string;
  page?: number | null;
  itemsPerPage?: number | null;
  courierIds?: number[];
}

export interface IGetCouriersResponse {
  data: ICourier[];
  pagination: IPagination;
}

export interface IGetCourierResponse extends ICourier { }
