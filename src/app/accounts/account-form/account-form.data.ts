import { FormControl } from '@angular/forms';

export interface AccountForm {
  name: FormControl<string>;
  startingBalance: FormControl<number | undefined>;
}

export interface AccountRequest {
  name: string;
  startingBalance?: number;
}
