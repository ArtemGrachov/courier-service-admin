import type { ESortDirection } from '~/constants/sort';

export interface IFormClientsFilter {
  page?: number;
  itemsPerPage?: number;
  nameSearch?: string | null;
  emailSearch?: string | null;
  phoneSearch?: string | null;
  nameSort?: ESortDirection | null;
  activeOrdersCountSort?: ESortDirection | null;
  completedOrdersCountSort?: ESortDirection | null;
  totalOrdersCountSort?: ESortDirection | null;
  ratingSort?: ESortDirection | null;
}

