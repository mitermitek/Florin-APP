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
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { Account } from '../accounts.data';
import { AccountsService } from '../accounts.service';

@Component({
  selector: 'app-account-deletion-dialog',
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './account-deletion-dialog.html',
  styleUrl: './account-deletion-dialog.css',
})
export class AccountDeletionDialog {
  public data = inject<Account>(MAT_DIALOG_DATA);

  private dialogRef = inject(MatDialogRef<AccountDeletionDialog>);
  private accountsService = inject(AccountsService);
  private snackbarService = inject(SnackbarService);

  protected confirm(): void {
    this.accountsService
      .deleteAccount(this.data.id)
      .pipe(
        take(1),
        catchError(() => {
          this.snackbarService.error(
            'An error occurred while deleting the account. Please try again later.',
          );
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
