import { Component, DestroyRef, inject, signal } from '@angular/core';
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
} from '../shared/pagination/pagination.data';
import { AccountDeletionDialog } from './account-deletion-dialog/account-deletion-dialog';
import { AccountFormDialog } from './account-form-dialog/account-form-dialog';
import { Account } from './accounts.data';
import { AccountsService } from './accounts.service';

@Component({
  selector: 'app-accounts',
  imports: [MatButtonModule, MatIconModule, MatPaginatorModule, MatTableModule],
  templateUrl: './accounts.html',
})
export class Accounts {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly accountsService = inject(AccountsService);

  protected columns = signal(['id', 'name', 'startingBalance', 'actions']);
  protected pageSizeOptions = signal(DEFAULT_PAGE_SIZE_OPTIONS);
  protected paginationParams = signal(DEFAULT_PAGINATION_PARAMS);

  protected paginatedAccounts = toSignal(
    toObservable(this.paginationParams).pipe(
      switchMap((params) => this.accountsService.getAccounts(params)),
    ),
  );

  protected onPageChange(pageEvent: PageEvent): void {
    this.paginationParams.set({
      page: pageEvent.pageIndex + 1,
      size: pageEvent.pageSize,
    });
  }

  protected openFormDialog(account?: Account): void {
    this.dialog
      .open(AccountFormDialog, {
        data: account,
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

  protected openDeletionDialog(account: Account): void {
    this.dialog
      .open(AccountDeletionDialog, {
        data: account,
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
