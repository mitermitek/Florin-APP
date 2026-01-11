import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { switchMap } from 'rxjs';
import {
  DEFAULT_PAGE_SIZE_OPTIONS,
  DEFAULT_PAGINATION_PARAMS,
} from '../../../shared/pagination/pagination.data';
import { AccountsService } from '../../accounts.service';
import { AccountTransactionDeletionDialog } from './account-transaction-deletion-dialog/account-transaction-deletion-dialog';
import { AccountTransactionFormDialog } from './account-transaction-form-dialog/account-transaction-form-dialog';
import { AccountTransaction } from './account-transactions.data';

@Component({
  selector: 'app-account-transactions',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
  ],
  templateUrl: './account-transactions.html',
})
export class AccountTransactions {
  accountId = input.required<number>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly accountsService = inject(AccountsService);

  protected columns = signal([
    'id',
    'category',
    'type',
    'amount',
    'date',
    'title',
    'description',
    'actions',
  ]);
  protected pageSizeOptions = signal(DEFAULT_PAGE_SIZE_OPTIONS);
  protected paginationParams = signal(DEFAULT_PAGINATION_PARAMS);

  protected paginatedAccountTransactions = toSignal(
    toObservable(this.paginationParams).pipe(
      switchMap((params) => this.accountsService.getAccountTransactions(this.accountId(), params)),
    ),
  );

  protected onPageChange(pageEvent: PageEvent): void {
    this.paginationParams.set({
      page: pageEvent.pageIndex + 1,
      size: pageEvent.pageSize,
    });
  }

  protected openFormDialog(accountTransaction?: AccountTransaction): void {
    this.dialog
      .open(AccountTransactionFormDialog, {
        data: {
          accountId: this.accountId(),
          transaction: accountTransaction,
        },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((success?: boolean) => {
        if (success) {
          const currentParams = this.paginationParams();
          this.paginationParams.set({ ...currentParams });
        }
      });
  }

  protected openDeletionDialog(accountTransaction: AccountTransaction): void {
    this.dialog
      .open(AccountTransactionDeletionDialog, {
        data: {
          accountId: this.accountId(),
          transaction: accountTransaction,
        },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((success?: boolean) => {
        if (success) {
          const currentParams = this.paginationParams();
          this.paginationParams.set({ ...currentParams });
        }
      });
  }
}
