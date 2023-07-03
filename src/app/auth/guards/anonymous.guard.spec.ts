import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { anonymousGuard } from '@app/auth/guards/anonymous.guard';
import { AuthService } from '@app/auth/services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

describe('anonymousGuard', () => {
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

  it('should return false when logged in and navigate', (done: DoneFn) => {
    TestBed.runInInjectionContext(() => {
      authServiceSpy.isLoggedIn.next(true);

      (anonymousGuard(null, null) as Observable<boolean>).subscribe((canActivate: boolean) => {
        expect(canActivate).toBeFalse();
        expect(routerSpy.navigateByUrl).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should return true when logged out and do not navigate', (done: DoneFn) => {
    TestBed.runInInjectionContext(() => {
      authServiceSpy.isLoggedIn.next(false);

      (anonymousGuard(null, null) as Observable<boolean>).subscribe((canActivate: boolean) => {
        expect(canActivate).toBeTrue();
        expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
