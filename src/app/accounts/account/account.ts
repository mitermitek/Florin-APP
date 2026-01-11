import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Account as AccountData } from '../accounts.data';
import { AccountTransactions } from './account-transactions/account-transactions';

@Component({
  selector: 'app-account',
  imports: [AccountTransactions],
  templateUrl: './account.html',
})
export class Account {
  private readonly route = inject(ActivatedRoute);
  private readonly data = toSignal(this.route.data);

  protected account = computed(() => this.data()!['account'] as AccountData);
}
