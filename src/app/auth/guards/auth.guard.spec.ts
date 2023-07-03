import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from '@app/auth/guards/auth.guard';
import { AuthService } from '@app/auth/services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

describe('authGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockPromise: Promise<boolean> = new Promise((resolve: (value: boolean) => void) => resolve(true));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigateByUrl']) },
        {
          provide: AuthService, useValue: jasmine.createSpyObj('AuthService', [], {
            isLoggedIn: new BehaviorSubject(null)
          })
        }
      ]
    });

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    routerSpy.navigateByUrl.and.returnValue(mockPromise);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should return true when logged in and do not navigate', (done: DoneFn) => {
    TestBed.runInInjectionContext(() => {
      authServiceSpy.isLoggedIn.next(true);

      (authGuard(null, null) as Observable<boolean>).subscribe((canActivate: boolean) => {
        expect(canActivate).toBeTrue();
        expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
        done();
      });
    });
  });

  it('should return false when logged out and navigate', (done: DoneFn) => {
    TestBed.runInInjectionContext(() => {
      authServiceSpy.isLoggedIn.next(false);

      (authGuard(null, null) as Observable<boolean>).subscribe((canActivate: boolean) => {
        expect(canActivate).toBeFalse();
        expect(routerSpy.navigateByUrl).toHaveBeenCalled();
        done();
      });
    });
  });
});
