import { Component, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { CategoriesService } from '../../categories/categories.service';
import { formatDateTimeToDate } from '../../shared/date/date';
import {
  displayTransactionType,
  Transaction,
  TRANSACTION_TYPES,
  TransactionType,
} from '../transactions.data';
import { TransactionsService } from '../transactions.service';
import {
  TransactionForm as TransactionFormData,
  TransactionRequest,
} from './transaction-form.data';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm {
  readonly accountId = input.required<number>();
  readonly transaction = input<Transaction>();
  readonly formId = input<string>('transaction-form');
  readonly saved = output<Transaction | undefined>();

  private readonly transactionsService = inject(TransactionsService);
  private readonly categoriesService = inject(CategoriesService);

  protected readonly transactionTypes = signal<TransactionType[]>(TRANSACTION_TYPES);
  protected readonly displayTransactionType = signal(displayTransactionType);

  protected readonly categories = toSignal(
    this.categoriesService.getCategories({ page: 1, size: 100 }),
  );

  readonly transactionForm = computed(
    () =>
      new FormGroup<TransactionFormData>({
        type: new FormControl<TransactionType>(this.transaction()?.type ?? 'expense', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        amount: new FormControl<number>(
          this.transaction()?.amount ?? (undefined as unknown as number),
          {
            nonNullable: true,
            validators: [Validators.required, Validators.min(0.01)],
          },
        ),
        date: new FormControl<string>(
          formatDateTimeToDate(this.transaction()?.date ?? new Date().toISOString()),
          {
            nonNullable: true,
            validators: [Validators.required],
          },
        ),
        title: new FormControl<string>(this.transaction()?.title ?? '', {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(100)],
        }),
        description: new FormControl<string | null>(this.transaction()?.description ?? null, {
          validators: [Validators.maxLength(500)],
        }),
        categoryId: new FormControl<number>(
          this.transaction()?.category.id ?? (undefined as unknown as number),
          {
            nonNullable: true,
            validators: [Validators.required],
          },
        ),
      }),
  );

  protected saveTransaction(): void {
    if (this.transactionForm().invalid) {
      this.transactionForm().markAllAsTouched();
      return;
    }

    const formValues = this.transactionForm().getRawValue();
    const transactionRequest: TransactionRequest = {
      type: formValues.type,
      amount: formValues.amount,
      date: formValues.date,
      title: formValues.title,
      description: formValues.description ?? undefined,
      categoryId: formValues.categoryId,
    };

    const accountId = this.accountId();

    let observable$: Observable<Transaction>;
    if (this.transaction()) {
      observable$ = this.transactionsService.updateTransaction(
        accountId,
        this.transaction()!.id,
        transactionRequest,
      );
    } else {
      observable$ = this.transactionsService.createTransaction(accountId, transactionRequest);
    }

    observable$.pipe(take(1)).subscribe({
      next: (transaction) => {
        this.saved.emit(transaction);
      },
      error: (error) => {
        this.saved.emit(undefined);
      },
    });
  }
}
