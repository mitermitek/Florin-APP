import { AccountTransaction } from '../account-transactions.data';

export interface AccountTransactionFormDialogData {
  accountId: number;
  transaction?: AccountTransaction;
}
