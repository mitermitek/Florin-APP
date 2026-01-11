import { AccountTransaction } from '../account-transactions.data';

export interface AccountTransactionDeletionDialogData {
  accountId: number;
  transaction: AccountTransaction;
}
