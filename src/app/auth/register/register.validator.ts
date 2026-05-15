import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RegisterForm } from './register.data';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const registerForm = control.parent as FormGroup<RegisterForm>;
    const password = control.value;
    const passwordConfirmation = registerForm?.controls.passwordConfirmation.value;

    if (password && passwordConfirmation && password !== passwordConfirmation) {
      return { passwordsMismatch: true };
    }

    return null;
  };
}
