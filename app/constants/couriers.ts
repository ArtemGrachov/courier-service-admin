import type { IGetCouriersQuery } from '~/types/api/couriers';

export const enum ECourierStatus {
  OFFLINE = 'offline',
  IDLE = 'idle',
  DELIVERING = 'delivering',
}

export const COURIER_STATUSES = [
  ECourierStatus.DELIVERING,
  ECourierStatus.IDLE,
  ECourierStatus.OFFLINE,
];

export const DEFAULT_COURIER_FILTERS = {
  page: 1,
  itemsPerPage: 10,
}

export const DEFAULT_COURIER_QUERY: IGetCouriersQuery = {
  page: 1,
  itemsPerPage: 10,
}

