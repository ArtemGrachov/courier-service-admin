import { ESortDirection } from '~/constants/sort';

const SORT_OPTIONS = [
  ESortDirection.ASC,
  ESortDirection.DESC,
];

export const validateSort = (sort?: string | null): ESortDirection | null => {
  if (sort && SORT_OPTIONS.includes(sort as ESortDirection)) {
    return sort as ESortDirection;
  }

  return null;
}

