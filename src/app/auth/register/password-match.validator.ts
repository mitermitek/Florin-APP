import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.controls['password']?.value;
    const confirmPassword = formGroup.controls['passwordConfirmation']?.value;
    const passwordConfirmationControl = formGroup.controls['passwordConfirmation'];

    if (password === confirmPassword) {
      // if passwords match, remove any existing error
      if (passwordConfirmationControl?.hasError('passwordMismatch')) {
        delete passwordConfirmationControl.errors?.['passwordMismatch'];
        if (Object.keys(passwordConfirmationControl.errors || {}).length === 0) {
          passwordConfirmationControl.setErrors(null);
        }
      }
      return null;
    } else {
      // if passwords do not match, add the error to the control
      passwordConfirmationControl?.setErrors({
        ...passwordConfirmationControl.errors,
        passwordMismatch: true,
      });
      return { passwordMismatch: true };
    }
  };
}
