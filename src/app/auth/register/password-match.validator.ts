import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.controls['password']?.value;
    const confirmPassword = formGroup.controls['passwordConfirmation']?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
