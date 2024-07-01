export type paginatedResponse<T> = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: T;
};
