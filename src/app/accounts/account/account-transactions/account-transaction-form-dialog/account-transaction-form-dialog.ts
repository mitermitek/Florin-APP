import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { MatSelectModule } from '@angular/material/select';
import { catchError, EMPTY, map, take } from 'rxjs';
import { CategoriesService } from '../../../../categories/categories.service';
import { ErrorResponse } from '../../../../shared/error/error.data';
import { DEFAULT_SELECT_LIST_PAGINATION_PARAMS } from '../../../../shared/pagination/pagination.data';
import { SnackbarService } from '../../../../shared/snackbar/snackbar.service';
import { TRANSACTION_TYPES } from '../../../../transactions/transactions.data';
import { AccountsService } from '../../../accounts.service';
import { AccountTransactionRequest, TransactionErrorType } from '../account-transactions.data';
import { AccountTransactionFormDialogData } from './account-transaction-form-dialog.data';

@Component({
  selector: 'app-account-transaction-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './account-transaction-form-dialog.html',
})
export class AccountTransactionFormDialog {
  public data = inject<AccountTransactionFormDialogData>(MAT_DIALOG_DATA);

  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AccountTransactionFormDialog>);
  private readonly accountsService = inject(AccountsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly snackbarService = inject(SnackbarService);

  protected form = this.formBuilder.group({
    categoryId: [this.data.transaction?.category.id, [Validators.required]],
    type: [this.data.transaction?.type, [Validators.required]],
    amount: [this.data.transaction?.amount, [Validators.required, Validators.min(0.01)]],
    date: [
      this.data.transaction?.date ? new Date(this.data.transaction?.date) : new Date(),
      [Validators.required],
    ],
    title: [this.data.transaction?.title ?? '', [Validators.required, Validators.maxLength(255)]],
    description: [this.data.transaction?.description, [Validators.maxLength(255)]],
  });

  protected types = signal(TRANSACTION_TYPES);
  protected categories = toSignal(
    this.categoriesService
      .getCategories(DEFAULT_SELECT_LIST_PAGINATION_PARAMS)
      .pipe(map((paginatedCategories) => paginatedCategories.items)),
    { initialValue: [] },
  );

  protected submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();
    const dataRequest: AccountTransactionRequest = {
      categoryId: formValues.categoryId!,
      type: formValues.type!,
      amount: formValues.amount!,
      date: formValues.date.toLocaleDateString('en-CA'),
      title: formValues.title,
      description: formValues.description,
    };

    const request$ = this.data.transaction?.id
      ? this.accountsService.updateAccountTransaction(
          this.data.accountId,
          this.data.transaction.id,
          dataRequest,
        )
      : this.accountsService.createAccountTransaction(this.data.accountId, dataRequest);

    request$
      .pipe(
        take(1),
        catchError((error: HttpErrorResponse) => {
          const action = this.data.transaction?.id ? 'updating' : 'creating';
          let message = `An error occurred while ${action} the transaction. Please try again later.`;

          const errorType = (error.error as ErrorResponse<TransactionErrorType>)?.type;
          if (errorType === 'AccountNotFoundException') {
            message = 'The account associated with this transaction does not exist.';
          }
          if (errorType === 'TransactionNotFoundException') {
            message = 'The transaction you are trying to update does not exist.';
          }

          this.snackbarService.error(message);
          return EMPTY;
        }),
      )
      .subscribe(() => this.dialogRef.close(true));
  }
}
