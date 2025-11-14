import type { ESortDirection } from '~/constants/sort';
import type { ICourier } from '~/types/models/courier';
import type { IPagination } from '~/types/other/pagination';

export interface IGetCouriersQuery {
  page?: number | null;
  itemsPerPage?: number | null;
  courierIds?: number[];
  nameSearch?: string | null;
  emailSearch?: string | null;
  phoneSearch?: string | null;
  nameSort?: ESortDirection | null;
  currentOrdersCountSort?: ESortDirection | null;
  totalOrdersCountSort?: ESortDirection | null;
  ratingSort?: ESortDirection | null;
}

export interface IGetCouriersResponse {
  data: ICourier[];
  pagination: IPagination;
}

export interface IGetCourierResponse extends ICourier { }
