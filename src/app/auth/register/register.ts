import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { catchError, EMPTY, take } from 'rxjs';
import { SnackbarService } from '../../shared/snackbar.service';
import { AuthService } from '../auth.service';
import { passwordMatchValidator } from './password-match.validator';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private router = inject(Router);
  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private snackbarService = inject(SnackbarService);

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
          if ((error.error.type = 'UserAlreadyExistsException')) {
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
