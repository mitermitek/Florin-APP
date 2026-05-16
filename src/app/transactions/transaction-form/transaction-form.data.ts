import { FormControl } from '@angular/forms';
import { TransactionType } from '../transactions.data';

export interface TransactionForm {
  type: FormControl<TransactionType>;
  amount: FormControl<number>;
  date: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string | null>;
  categoryId: FormControl<number>;
}

export interface TransactionRequest {
  type: TransactionType;
  amount: number;
  date: string;
  title: string;
  description?: string;
  categoryId: number;
}
