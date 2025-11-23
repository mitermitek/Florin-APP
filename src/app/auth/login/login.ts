import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { ToastService } from '../../shared/toasts/toast.service';
import { LoginData } from '../auth.data';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  signIn(): void {
    if (this.loginForm.valid) {
      const data = this.loginForm.getRawValue() as LoginData;
      this.authService
        .login(data)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error) => {
            let message = 'An unexpected error occurred.';

            if (error.error.type === 'BadCredentialsException') {
              message = 'Invalid email or password.';
            }

            this.toastService.error(message);
            return EMPTY;
          }),
        )
        .subscribe({
          next: (user) => {
            this.authService.user.set(user);
            this.authService.isAuthenticated.set(true);
            this.router.navigate(['/dashboard']);
          },
        });
    }
  }
}
