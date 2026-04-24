export const checkQueryPagination = (
  page?: any,
  limit?: any,
): { page: number; limit: number } => {
  const pageNumber = page !== undefined ? Number(page) : 1;
  const limitNumber = limit !== undefined ? Number(limit) : 8;

  if (isNaN(pageNumber) || isNaN(limitNumber)) {
    return { page: 1, limit: 8 };
  }

  // check limit
  if (limitNumber < 8) {
    // check limit
    if (pageNumber < 1) {
      return { page: 1, limit: 8 };
    } else {
      return { page: pageNumber, limit: 8 };
    }
  }

  // check page
  if (pageNumber < 1) {
    // check limit
    if (limitNumber < 8) {
      return { page: 1, limit: 8 };
    }
    return { page: 1, limit: limitNumber };
  }

  return { page: pageNumber, limit: limitNumber };
};
