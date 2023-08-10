import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginData, LoginForm } from '@app/auth/interfaces/login.interface';
import { AuthService } from '@app/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public form: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private matSnackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.form = new FormGroup({
      email: new FormControl<string>(null, [Validators.required, Validators.email]),
      password: new FormControl<string>(null, [Validators.required])
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const formValue: Partial<LoginData> = this.form.value;

      this.authService.signIn(formValue.email, formValue.password)
        .then(() => {
          this.router.navigateByUrl('/');
        })
        .catch(() => {
          this.matSnackBar.open(`You could not login!`, null, { panelClass: ['my-snack-bar-bg', 'bg-danger'] });
        });
    }
  }

}
