import type { IClient } from '~/types/models/client';
import type { IPagination } from '~/types/other/pagination';

export interface IGetClientsQuery {
  page?: number | null;
  itemsPerPage?: number | null;
}

export interface IGetClientsResponse {
  data: IClient[];
  pagination: IPagination;
}

export interface IGetClientResponse extends IClient { }
