import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isLoggedIn: boolean = null;

  constructor(
    private authService: AuthService,
    private iconRegistry: MatIconRegistry,
    private router: Router
  ) {
    this.iconRegistry.setDefaultFontSetClass('material-symbols-outlined');

    this.authService.isLoggedIn
      .subscribe((isLoggedIn: boolean) => this.isLoggedIn = isLoggedIn);
  }

  public onClickLogout(): void {
    this.authService.signOut()
      .then(() => this.router.navigateByUrl('/auth/login'));
  }
}
