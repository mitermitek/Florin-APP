import { FormControl } from '@angular/forms';

export interface AccountForm {
  name: FormControl<string>;
  startingBalance: FormControl<number | null>;
}

export interface AccountRequest {
  name: string;
  startingBalance?: number;
}
