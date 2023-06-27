import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '@app/app.component';
import { AuthService } from '@app/auth/services/auth.service';
import { BehaviorSubject } from 'rxjs';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let iconRegistrySpy: jasmine.SpyObj<MatIconRegistry>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['signOut'], {
            isLoggedIn: new BehaviorSubject(false)
          })
        },
        {
          provide: MatIconRegistry, useValue: jasmine.createSpyObj('MatIconRegistry', ['setDefaultFontSetClass'])
        },
        {
          provide: Router, useValue: jasmine.createSpyObj('Router', ['navigateByUrl'])
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    iconRegistrySpy = TestBed.inject(MatIconRegistry) as jasmine.SpyObj<MatIconRegistry>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
    expect(app.isLoggedIn).toBeFalse();
    expect(iconRegistrySpy.setDefaultFontSetClass).toHaveBeenCalledTimes(1);
  });

  describe('#onClickLogout', () => {
    it('should reload location when logout was a success', (done: DoneFn) => {
      const promise: Promise<void> = new Promise((resolve: (value: void | PromiseLike<void>) => void) => resolve());
      authServiceSpy.signOut.and.returnValue(promise);

      app.onClickLogout();

      expect(authServiceSpy.signOut).toHaveBeenCalledTimes(1);

      promise.then(() => {
        expect(routerSpy.navigateByUrl).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });
});
