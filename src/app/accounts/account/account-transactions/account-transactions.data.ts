import { Category } from '../../../categories/categories.data';
import { TransactionType } from '../../../transactions/transactions.data';

export interface AccountTransaction {
  id: number;
  category: Category;
  type: TransactionType;
  amount: number;
  date: string;
  title: string;
  description?: string;
}

export interface AccountTransactionRequest {
  categoryId: number;
  type: TransactionType;
  amount: number;
  date: string;
  title: string;
  description?: string;
}
