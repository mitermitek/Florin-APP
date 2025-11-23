import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
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
        authService.getCurrentUser().pipe(
          tap((user) => {
            authService.user.set(user);
            authService.isAuthenticated.set(true);
          }),
          catchError(() => of(null)),
        ),
      );
    }),
  ],
};
