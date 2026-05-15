import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../auth.service';
import { RegisterForm, RegisterRequest } from './register.data';
import { passwordsMatchValidator } from './register.validator';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected registerForm = new FormGroup<RegisterForm>({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
        Validators.maxLength(255),
      ],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), passwordsMatchValidator()],
    }),
    passwordConfirmation: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), passwordsMatchValidator()],
    }),
  });

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValues = this.registerForm.getRawValue();
    const registerRequest: RegisterRequest = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      passwordConfirmation: formValues.passwordConfirmation,
    };

    this.authService
      .register(registerRequest)
      .pipe(take(1))
      .subscribe({
        next: () => {
          console.info('User registered successfully');
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('Error registering user:', error);
        },
      });
  }
}
