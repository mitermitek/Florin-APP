import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { ToastService } from '../../shared/toasts/toast.service';
import { RegisterData } from '../auth.data';
import { AuthService } from '../auth.service';
import { passwordMatchValidator } from './password-match.validator';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  registerForm = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255),
        Validators.email,
      ]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      passwordConfirmation: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator() },
  );

  signUp(): void {
    if (this.registerForm.valid) {
      const data = this.registerForm.getRawValue() as RegisterData;
      this.authService
        .register(data)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error) => {
            let message = 'An unexpected error occurred.';

            if (error.error.type === 'UserAlreadyExistsException') {
              message = 'A user with this email already exists.';
            }

            this.toastService.error(message);
            return EMPTY;
          }),
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/auth/login']);
          },
        });
    }
  }
}
