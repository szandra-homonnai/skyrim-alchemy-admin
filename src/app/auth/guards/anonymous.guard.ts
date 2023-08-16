import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { map } from 'rxjs';


export const anonymousGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isLoggedIn
    .pipe(
      map((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          router.navigateByUrl('/');
        }

        return !isLoggedIn;
      })
    );
};
