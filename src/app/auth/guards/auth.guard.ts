import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isLoggedIn
    .pipe(
      tap((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          router.navigateByUrl('/auth/login');
        }
      })
    );
}
