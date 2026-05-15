import { FormControl } from '@angular/forms';

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}
