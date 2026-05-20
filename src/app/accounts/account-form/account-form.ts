import { Component, computed, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { Account } from '../accounts.data';
import { AccountsService } from '../accounts.service';
import { AccountForm as AccountFormData, AccountRequest } from './account-form.data';

@Component({
  selector: 'app-account-form',
  imports: [ReactiveFormsModule],
  templateUrl: './account-form.html',
  styleUrl: './account-form.css',
})
export class AccountForm {
  readonly account = input<Account>();
  readonly formId = input<string>('account-form');
  readonly saved = output<Account | undefined>();

  private readonly accountsService = inject(AccountsService);

  readonly accountForm = computed(
    () =>
      new FormGroup<AccountFormData>({
        name: new FormControl<string>(this.account()?.name ?? '', {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(100)],
        }),
        startingBalance: new FormControl<number | undefined>(this.account()?.startingBalance, {
          nonNullable: true,
          validators: [Validators.min(0)],
        }),
      }),
  );

  protected saveAccount(): void {
    if (this.accountForm().invalid) {
      this.accountForm().markAllAsTouched();
      return;
    }

    const formValues = this.accountForm().getRawValue();
    const accountRequest: AccountRequest = {
      name: formValues.name,
      startingBalance: formValues.startingBalance,
    };

    let observable$: Observable<Account>;
    if (this.account()) {
      observable$ = this.accountsService.updateAccount(this.account()!.id, accountRequest);
    } else {
      observable$ = this.accountsService.createAccount(accountRequest);
    }

    observable$.pipe(take(1)).subscribe({
      next: (account) => {
        this.saved.emit(account);
      },
      error: () => {
        this.saved.emit(undefined);
      },
    });
  }
}
