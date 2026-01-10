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

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private snackbarService = inject(SnackbarService);

  protected form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService
      .login(this.form.getRawValue())
      .pipe(
        take(1),
        catchError((error: HttpErrorResponse) => {
          let message = 'An error occurred during login. Please try again later.';
          if ((error.error.type = 'BadCredentialsException')) {
            message = 'Invalid email or password.';
          }

          this.snackbarService.error(message);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.authService.isAuthenticated = true;
        this.router.navigate(['/']);
      });
  }
}
