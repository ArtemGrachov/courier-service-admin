import { getPagination } from '~/utils/pagination';
import { timeoutPromise } from '~/utils/timeout-promise'

export const mockRequest = async <T = any, >(data?: T) => {
  const throwError = Math.random() > 0.97;

  await timeoutPromise(1000);

  if (throwError) {
    throw new Error('Mock request error to demonstrate the error handling. Try to perform the action again');
  }

  return data;
}

export const mockPaginationRequest = async <D = any, T = any>(page: number, itemsPerPage: number, data?: T[] | null) => {
  const paginatedData = getPagination<D, T>(page, itemsPerPage, data);
  return mockRequest<D>(paginatedData);
}
