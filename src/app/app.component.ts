import { Component } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isLoggedIn: boolean;

  constructor(
    private authService: AuthService
  ) {
    this.authService.isLoggedIn
      .subscribe((isLoggedIn: boolean) => this.isLoggedIn = isLoggedIn);
  }

  public onClickLogout(): void {
    this.authService.signOut()
      .then(() => location.reload());
  }
}
