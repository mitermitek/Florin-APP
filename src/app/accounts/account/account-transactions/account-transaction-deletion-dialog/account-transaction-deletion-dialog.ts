import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { catchError, EMPTY, take } from 'rxjs';
import { SnackbarService } from '../../../../shared/snackbar/snackbar.service';
import { AccountsService } from '../../../accounts.service';
import { AccountTransactionDeletionDialogData } from './account-transaction-deletion-dialog.data';

@Component({
  selector: 'app-account-transaction-deletion-dialog',
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './account-transaction-deletion-dialog.html',
})
export class AccountTransactionDeletionDialog {
  public data = inject<AccountTransactionDeletionDialogData>(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<AccountTransactionDeletionDialog>);
  private readonly accountsService = inject(AccountsService);
  private readonly snackbarService = inject(SnackbarService);

  protected confirm(): void {
    this.accountsService
      .deleteAccountTransaction(this.data.accountId, this.data.transaction.id)
      .pipe(
        take(1),
        catchError((error: HttpErrorResponse) => {
          let message = 'An error occurred while deleting the transaction.';

          const errorType = error.error.type;
          if (errorType === 'AccountNotFoundException') {
            message = 'The account associated with this transaction does not exist.';
          }
          if (errorType === 'TransactionNotFoundException') {
            message = 'The transaction you are trying to delete does not exist.';
          }

          this.snackbarService.error(message);
          return EMPTY;
        }),
      )
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
      });
  }
}
