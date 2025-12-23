import type { ESortDirection } from '~/constants/sort';

import type { IClient } from '~/types/models/client';
import type { IPagination } from '~/types/other/pagination';

export interface IGetClientsQuery {
  page?: number | null;
  itemsPerPage?: number | null;
  courierIds?: number[];
  search?: string | null;
  nameSearch?: string | null;
  emailSearch?: string | null;
  phoneSearch?: string | null;
  nameSort?: ESortDirection | null;
  activeOrdersCountSort?: ESortDirection | null;
  completedOrdersCountSort?: ESortDirection | null;
  totalOrdersCountSort?: ESortDirection | null;
  ratingSort?: ESortDirection | null;
}

export interface IGetClientsResponse {
  items: IClient[];
  pagination: IPagination;
}

export interface IGetClientResponse extends IClient { }
