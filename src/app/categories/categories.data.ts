export interface Category {
  id: number;
  name: string;
}

export interface CategoryRequest {
  name: string;
}

export type CategoryErrorType = 'CategoryAlreadyExistsException' | 'CategoryNotFoundException';
