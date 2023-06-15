import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';

export function checkIsLoggedIn(authService: AuthService) {
  return (): Promise<boolean> => {
    return authService.checkLoggedIn();
  };
}

// eslint-disable-next-line @typescript-eslint/typedef
export const APP_INITIALIZER_PROVIDER = {
  provide: APP_INITIALIZER,
  useFactory: checkIsLoggedIn,
  deps: [AuthService],
  multi: true
};
