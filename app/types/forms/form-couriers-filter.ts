import type { ECourierStatus } from '~/constants/couriers';
import type { ESortDirection } from '~/constants/sort';

export interface IFormCouriersFilter {
  page?: number;
  itemsPerPage?: number;
  nameSearch?: string | null;
  emailSearch?: string | null;
  phoneSearch?: string | null;
  nameSort?: ESortDirection | null;
  currentOrdersCountSort?: ESortDirection | null;
  totalOrdersCountSort?: ESortDirection | null;
  ratingSort?: ESortDirection | null;
  status?: ECourierStatus;
}

