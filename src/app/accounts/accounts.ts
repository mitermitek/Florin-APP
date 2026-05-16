import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, switchMap, take } from 'rxjs';
import { Dialog } from '../shared/dialog/dialog';
import { Pagination } from '../shared/pagination/pagination';
import { DEFAULT_PAGINATION_PARAMS } from '../shared/pagination/pagination.data';
import { AccountForm } from './account-form/account-form';
import { Account } from './accounts.data';
import { AccountsService } from './accounts.service';

@Component({
  selector: 'app-accounts',
  imports: [Pagination, Dialog, AccountForm],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts {
  private readonly accountsService = inject(AccountsService);

  protected displayAccountForm = signal(false);
  protected displayAccountDeleteConfirmation = signal(false);
  protected selectedAccount = signal<Account | undefined>(undefined);

  protected accountFormTitle = computed(() => {
    const account = this.selectedAccount();

    if (account === undefined) {
      return 'Créer un compte';
    }

    return `Modifier le compte « ${account.name} »`;
  });

  protected paginationParams = signal(DEFAULT_PAGINATION_PARAMS);
  protected paginatedAccounts = toSignal(
    toObservable(this.paginationParams).pipe(
      catchError(() => {
        return EMPTY;
      }),
      switchMap((params) => this.accountsService.getAccounts(params)),
    ),
  );

  protected openCreateAccount(): void {
    this.displayAccountForm.set(true);
  }

  protected openUpdateAccount(accountId: number): void {
    this.loadAccount(accountId, (account) => {
      this.selectedAccount.set(account);
      this.displayAccountForm.set(true);
    });
  }

  protected closeAccountForm(): void {
    this.displayAccountForm.set(false);
    this.selectedAccount.set(undefined);
  }

  protected handleAccountSaved(account: Account | undefined): void {
    if (!account) {
      return;
    }

    this.closeAccountForm();
    this.paginationParams.update((params) => ({ ...params }));
  }

  protected openDeleteAccount(accountId: number): void {
    this.loadAccount(accountId, (account) => {
      this.selectedAccount.set(account);
      this.displayAccountDeleteConfirmation.set(true);
    });
  }

  protected closeDeleteAccount(): void {
    this.displayAccountDeleteConfirmation.set(false);
    this.selectedAccount.set(undefined);
  }

  protected handleAccountDelete(): void {
    const account = this.selectedAccount();
    if (!account) {
      return;
    }

    this.accountsService
      .deleteAccount(account.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.closeDeleteAccount();
          this.paginationParams.update((params) => ({ ...params }));
        },
      });
  }

  private loadAccount(accountId: number, onNext: (account: Account) => void): void {
    this.accountsService.getAccount(accountId).pipe(take(1)).subscribe({
      next: onNext,
    });
  }
}
