import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, take } from 'rxjs';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { AuthService } from '../auth.service';
import { passwordMatchValidator } from './password-match.validator';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './register.html',
})
export class Register {
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackbarService = inject(SnackbarService);

  protected form = this.formBuilder.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(255), Validators.email],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator() },
  );

  protected submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService
      .register(this.form.getRawValue())
      .pipe(
        take(1),
        catchError((error: HttpErrorResponse) => {
          let message = 'An error occurred during registration. Please try again later.';

          const errorType = error.error.type;
          if (errorType === 'UserAlreadyExistsException') {
            message = 'A user with this email already exists.';
          }

          this.snackbarService.error(message);

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
