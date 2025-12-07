export interface PaginationData<T> {
  items: T[];
  total: number;
}

export interface PaginationFiltersData {
  page: number;
  size: number;
}
