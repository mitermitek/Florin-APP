import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, EMPTY, switchMap, take } from 'rxjs';
import { AccountsService } from '../accounts/accounts.service';
import { Dialog } from '../shared/dialog/dialog';
import { Pagination } from '../shared/pagination/pagination';
import { DEFAULT_PAGINATION_PARAMS } from '../shared/pagination/pagination.data';
import { TransactionForm } from './transaction-form/transaction-form';
import { displayTransactionType, Transaction } from './transactions.data';
import { TransactionsService } from './transactions.service';

@Component({
  selector: 'app-transactions',
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, Dialog, Pagination, TransactionForm],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {
  private readonly transactionsService = inject(TransactionsService);
  private readonly accountsService = inject(AccountsService);

  protected accounts = toSignal(this.accountsService.getAccounts({ page: 1, size: 100 }));
  protected accountForm = new FormGroup({
    accountId: new FormControl<number | undefined>(undefined, {
      validators: [Validators.required],
    }),
  });

  protected displayTransactionForm = signal(false);
  protected displayTransactionDeleteConfirmation = signal(false);
  protected selectedTransaction = signal<Transaction | undefined>(undefined);

  protected transactionFormTitle = computed(() => {
    const transaction = this.selectedTransaction();

    if (transaction === undefined) {
      return 'Créer une transaction';
    }

    return `Modifier la transaction « ${transaction.title} »`;
  });
  protected displayTransactionType = signal(displayTransactionType);

  protected paginationParams = signal(DEFAULT_PAGINATION_PARAMS);
  protected paginatedTransactions = toSignal(
    toObservable(this.paginationParams).pipe(
      catchError(() => {
        return EMPTY;
      }),
      switchMap((params) => {
        const accountId = this.accountForm.value.accountId;
        if (!accountId) {
          return EMPTY;
        }

        return this.transactionsService.getTransactions(accountId, params);
      }),
    ),
  );

  constructor() {
    this.accountForm.controls.accountId.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.selectAccount();
    });

    effect(() => {
      const accounts = this.accounts();
      if (accounts && accounts.items.length > 0) {
        const currentAccountId = this.accountForm.value.accountId;

        if (
          !currentAccountId ||
          !accounts.items.some((account) => account.id === currentAccountId)
        ) {
          this.accountForm.controls.accountId.setValue(accounts.items[0].id);
          this.selectAccount();
        }
      }
    });
  }

  protected openCreateTransaction(): void {
    if (!this.accountForm.value.accountId) {
      return;
    }
    this.displayTransactionForm.set(true);
  }

  protected openUpdateTransaction(transactionId: number): void {
    const accountId = this.accountForm.value.accountId;
    if (!accountId) {
      return;
    }

    this.loadTransaction(accountId, transactionId, (transaction) => {
      this.selectedTransaction.set(transaction);
      this.displayTransactionForm.set(true);
    });
  }

  protected closeTransactionForm(): void {
    this.displayTransactionForm.set(false);
    this.selectedTransaction.set(undefined);
  }

  protected handleTransactionSaved(transaction: Transaction | undefined): void {
    if (!transaction) {
      return;
    }

    this.closeTransactionForm();
    this.paginationParams.update((params) => ({ ...params }));
  }

  protected openDeleteTransaction(transactionId: number): void {
    const accountId = this.accountForm.value.accountId;
    if (!accountId) {
      return;
    }

    this.loadTransaction(accountId, transactionId, (transaction) => {
      this.selectedTransaction.set(transaction);
      this.displayTransactionDeleteConfirmation.set(true);
    });
  }

  protected closeDeleteTransaction(): void {
    this.displayTransactionDeleteConfirmation.set(false);
    this.selectedTransaction.set(undefined);
  }

  protected handleTransactionDelete(): void {
    const transaction = this.selectedTransaction();
    const accountId = this.accountForm.value.accountId;

    if (!transaction || !accountId) {
      return;
    }

    this.transactionsService
      .deleteTransaction(accountId, transaction.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.closeDeleteTransaction();
          this.paginationParams.update((params) => ({ ...params }));
        },
      });
  }

  protected selectAccount(): void {
    const accountId = this.accountForm.value.accountId;
    if (!accountId) {
      return;
    }

    // Only check form validity if we're not in the initial selection
    // to avoid timing issues with form validation
    if (this.accountForm.invalid && this.accountForm.touched) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.paginationParams.update((params) => ({ ...params }));
  }

  private loadTransaction(
    accountId: number,
    transactionId: number,
    onNext: (transaction: Transaction) => void,
  ): void {
    this.transactionsService.getTransaction(accountId, transactionId).pipe(take(1)).subscribe({
      next: onNext,
    });
  }
}
