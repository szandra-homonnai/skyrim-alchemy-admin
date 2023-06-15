import { FormControl } from '@angular/forms';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}
