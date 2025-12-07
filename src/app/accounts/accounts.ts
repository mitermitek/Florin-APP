import { CurrencyPipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { Modal } from '../shared/modal/modal';
import { Pagination } from '../shared/pagination/pagination';
import { ToastService } from '../shared/toasts/toast.service';
import { AccountData } from './account.data';
import { AccountsService } from './accounts.service';

@Component({
  selector: 'app-accounts',
  imports: [ReactiveFormsModule, CurrencyPipe, Pagination, Modal],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts {
  private accountsService = inject(AccountsService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  private refreshAccounts = signal(0);
  private accountsParams = computed(() => ({
    page: this.currentPage(),
    refresh: this.refreshAccounts(),
  }));

  protected currentPage = signal(1);
  protected accounts = toSignal(
    toObservable(this.accountsParams).pipe(
      switchMap(({ page }) => {
        const paginationFilters = { page, size: 10 };
        return this.accountsService.getAccounts(paginationFilters);
      }),
    ),
  );
  protected totalItems = computed(() => {
    return this.accounts()?.total || 0;
  });

  protected accountSelected = signal<AccountData | null>(null);
  protected showAccountFormModal = signal(false);
  protected showAccountDeleteModal = signal(false);
  protected accountFormModalTitle = computed(() => {
    return this.accountSelected()
      ? `Update account - ${this.accountSelected()!.name}`
      : 'Create new account';
  });

  protected accountForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    startingBalance: new FormControl<number | null>(null, [Validators.min(0)]),
  });

  protected updateCurrentPage(page: number): void {
    this.currentPage.set(page);
  }

  protected createAccount(): void {
    this.accountSelected.set(null);
    this.showAccountFormModal.set(true);
  }

  protected editAccount(account: AccountData): void {
    this.accountSelected.set(account);
    this.showAccountFormModal.set(true);
    this.accountForm.patchValue({
      name: account.name,
      startingBalance: account.startingBalance,
    });
  }

  protected deleteAccount(account: AccountData): void {
    this.accountSelected.set(account);
    this.showAccountDeleteModal.set(true);
  }

  protected closeAccountFormModal(): void {
    this.showAccountFormModal.set(false);
    this.accountSelected.set(null);
    this.accountForm.reset();
  }

  protected closeAccountDeleteModal(): void {
    this.showAccountDeleteModal.set(false);
    this.accountSelected.set(null);
  }

  protected submitAccountForm(): void {
    if (this.accountForm.valid) {
      const formValues = this.accountForm.getRawValue();
      const isUpdate = this.accountSelected() !== null;

      (isUpdate
        ? this.accountsService.updateAccount(this.accountSelected()!.id, formValues)
        : this.accountsService.createAccount(formValues)
      )
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError(() => {
            this.toastService.error('An error occurred. Please try again.');
            return EMPTY;
          }),
        )
        .subscribe({
          next: () => {
            const message = isUpdate
              ? 'Account updated successfully.'
              : 'Account created successfully.';

            this.toastService.success(message);
            this.closeAccountFormModal();

            this.refreshAccounts.update((n) => n + 1);
          },
        });
    }
  }

  protected confirmDeleteAccount(): void {
    if (this.accountSelected()) {
      this.accountsService
        .deleteAccount(this.accountSelected()!.id)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError(() => {
            this.toastService.error('An error occurred. Please try again.');
            return EMPTY;
          }),
        )
        .subscribe({
          next: () => {
            this.toastService.success('Account deleted successfully.');
            this.closeAccountDeleteModal();

            this.refreshAccounts.update((n) => n + 1);
          },
        });
    }
  }
}
