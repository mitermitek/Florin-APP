import { FormControl } from '@angular/forms';

export interface CategoryForm {
  name: FormControl<string>;
}

export interface CategoryRequest {
  name: string;
}
