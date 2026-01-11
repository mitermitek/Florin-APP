import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth-interceptor';
import { AuthService } from './auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return firstValueFrom(
        authService.me().pipe(
          tap((user) => {
            authService.isAuthenticated = !!user;
          }),
          catchError(() => of(null)),
        ),
      );
    }),
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } },
    provideNativeDateAdapter(),
  ],
};
