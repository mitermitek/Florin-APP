import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { Account } from '../accounts.data';
import { AccountsService } from '../accounts.service';

export const accountResolver: ResolveFn<Account | RedirectCommand> = (route) => {
  const router = inject(Router);
  const accountsService = inject(AccountsService);
  const snackbarService = inject(SnackbarService);
  const accountId = +route.params['id'];

  return accountsService.getAccount(accountId).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = `An error occurred while loading the account. Please try again later.`;

      const errorType = error.error.type;
      if (errorType === 'AccountNotFoundException') {
        message = `The requested account was not found.`;
      }

      snackbarService.error(message);
      return of(new RedirectCommand(router.parseUrl('/accounts')));
    }),
  );
};
