import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCredential } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { LoginComponent } from '@app/auth/components/login/login.component';
import { AuthService } from '@app/auth/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
      ],
      providers: [
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigateByUrl']) },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['signIn']) }
      ]
    })
      .compileComponents();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    matSnackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
  });

  describe('#onSubmit', () => {
    it('should do nothing when form is invalid', () => {
      component.form.setValue({ email: null, password: null });
      component.onSubmit();

      expect(authServiceSpy.signIn).not.toHaveBeenCalled();
    });

    it('should handle susscessful login', (done: DoneFn) => {
      const promise: Promise<UserCredential> = new Promise((resolve: (value: UserCredential) => void) => resolve(null));
      authServiceSpy.signIn.and.returnValue(promise);
      component.form.setValue({ email: 'some@email.com', password: 'abc123' });
      component.onSubmit();

      expect(authServiceSpy.signIn).toHaveBeenCalled();

      promise.then(() => {
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
        done();
      });
    });

    it('should handle failed login', (done: DoneFn) => {
      const promise: Promise<UserCredential> = new Promise(
        (resolve: (value: UserCredential) => void, reject: (reason: string) => void) => reject('Error!')
      );
      authServiceSpy.signIn.and.returnValue(promise);
      component.form.setValue({ email: 'some@email.com', password: 'abc123' });
      component.onSubmit();

      expect(authServiceSpy.signIn).toHaveBeenCalled();

      promise
        .catch(() => { return; })
        .finally(() => {
          expect(matSnackBarSpy.open).toHaveBeenCalled();
          done();
        });
    });
  });
});
