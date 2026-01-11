export interface Paginated<T> {
  items: T[];
  total: number;
}

export interface PaginationParams {
  page: number;
  size: number;
}

export const DEFAULT_PAGINATION_PARAMS: PaginationParams = {
  page: 1,
  size: 10,
};

export const DEFAULT_SELECT_LIST_PAGINATION_PARAMS: PaginationParams = {
  page: 1,
  size: 25,
};

export const DEFAULT_PAGE_SIZE_OPTIONS: number[] = [5, 10, 25, 50, 100];
