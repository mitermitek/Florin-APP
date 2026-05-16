import { Category } from '../categories/categories.data';

export type TransactionType = 'expense' | 'income';
export const TRANSACTION_TYPES: TransactionType[] = ['expense', 'income'];
export function displayTransactionType(type: TransactionType): string {
  switch (type) {
    case 'income':
      return 'Revenu';
    case 'expense':
      return 'Dépense';
  }
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  date: string;
  title: string;
  description?: string;
  category: Category;
}

export interface TransactionRequest {
  type: TransactionType;
  amount: number;
  date: string;
  title: string;
  description?: string;
  categoryId: number;
}
