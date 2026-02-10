export const checkQueryPagination = (
  page?: any,
  limit?: any,
): { page: number; limit: number; status: boolean } => {
  const pageNumber = page !== undefined ? Number(page) : 1;
  const limitNumber = limit !== undefined ? Number(limit) : 10;

  if (isNaN(pageNumber) || isNaN(limitNumber)) {
    return { page: 1, limit: 10, status: false };
  }

  return { page: pageNumber, limit: limitNumber, status: true };
};
