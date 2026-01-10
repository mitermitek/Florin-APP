import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { catchError, EMPTY, take } from 'rxjs';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { Account } from '../accounts.data';
import { AccountsService } from '../accounts.service';

@Component({
  selector: 'app-account-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './account-form-dialog.html',
})
export class AccountFormDialog {
  public data = inject<Account | undefined>(MAT_DIALOG_DATA);

  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AccountFormDialog>);
  private readonly accountsService = inject(AccountsService);
  private readonly snackbarService = inject(SnackbarService);

  protected form = this.formBuilder.group({
    name: [this.data?.name ?? '', [Validators.required, Validators.maxLength(100)]],
    startingBalance: [this.data?.startingBalance ?? undefined],
  });

  protected submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();
    const request$ = this.data?.id
      ? this.accountsService.updateAccount(this.data.id, formValues)
      : this.accountsService.createAccount(formValues);

    request$
      .pipe(
        take(1),
        catchError((error: HttpErrorResponse) => {
          const action = this.data?.id ? 'updating' : 'creating';
          let message = `An error occurred while ${action} the account. Please try again later.`;

          const errorType = error.error.type;
          if (errorType === 'AccountAlreadyExistsException') {
            message = 'An account with this name already exists.';
          }

          this.snackbarService.error(message);
          return EMPTY;
        }),
      )
      .subscribe(() => this.dialogRef.close(true));
  }
}
