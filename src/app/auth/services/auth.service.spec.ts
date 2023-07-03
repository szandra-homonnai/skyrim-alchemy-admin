import { TestBed } from '@angular/core/testing';
import { AuthService } from '@app/auth/services/auth.service';

// TODO: more research on testing @angular/fire as it has no officially supported method
xdescribe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
