export const getPagination = <D = any, T = any>(page: number, itemsPerPage: number, data?: T[] | null) => {
  data = data ?? [];

  const skip = (page - 1) * itemsPerPage;
  const limit = page * itemsPerPage;
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const result = {
    data: data.slice(skip, limit),
    pagination: {
      totalItems,
      itemsPerPage,
      totalPages: totalPages,
      currentPage: page,
    },
  } as D;

  return result;
}
