import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../auth.service';
import { LoginForm, LoginRequest } from './login.data';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected loginForm = new FormGroup<LoginForm>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    rememberMe: new FormControl(false, {
      nonNullable: true,
    }),
  });

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formValues = this.loginForm.getRawValue();
    const loginRequest: LoginRequest = {
      email: formValues.email,
      password: formValues.password,
      rememberMe: formValues.rememberMe,
    };

    this.authService
      .login(loginRequest)
      .pipe(take(1))
      .subscribe({
        next: () => {
          console.info('User logged in successfully');
          this.authService.isAuthenticated.set(true);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error logging in user:', error);
        },
      });
  }
}
